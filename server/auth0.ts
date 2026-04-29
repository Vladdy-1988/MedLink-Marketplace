import { Strategy as Auth0Strategy } from 'passport-auth0';
import passport from 'passport';
import session from 'express-session';
import type { Express, RequestHandler } from 'express';
import connectPg from 'connect-pg-simple';
import { storage } from './storage';

const SESSION_COOKIE_NAME = "medlink.session";

function getHeaderValue(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.join(", ");
  }
  return "";
}

function getAuthRequestContext(req: any) {
  const cookieHeader = getHeaderValue(req.headers?.cookie);
  return {
    host: req.headers?.host,
    forwardedHost: req.headers?.["x-forwarded-host"],
    forwardedProto: req.headers?.["x-forwarded-proto"],
    origin: req.headers?.origin,
    referer: req.headers?.referer,
    hasCookieHeader: cookieHeader.length > 0,
    hasSessionCookie: cookieHeader.includes(`${SESSION_COOKIE_NAME}=`),
    hasSessionObject: !!req.session,
    sessionId: req.sessionID,
  };
}

function getDatabaseError(error: any): any {
  return error?.cause ?? error;
}

function getSafeAuthFailureReason(error: any): string {
  const dbError = getDatabaseError(error);

  if (dbError?.code === "23505") {
    return "account_email_exists";
  }

  if (dbError?.code === "42703") {
    return "database_schema";
  }

  if (String(error?.message || "").includes("Failed query")) {
    return "database";
  }

  return "auth_callback";
}

function getBaseUrlFromRequest(req: any): string {
  const forwardedProto = req.headers["x-forwarded-proto"];
  const proto =
    typeof forwardedProto === "string"
      ? forwardedProto.split(",")[0].trim()
      : req.secure
        ? "https"
        : req.protocol || "http";

  const forwardedHost = req.headers["x-forwarded-host"];
  const host =
    (typeof forwardedHost === "string" && forwardedHost.split(",")[0].trim()) ||
    req.get("host");

  return `${proto}://${host}`;
}

function resolveCallbackUrl(req?: any): string {
  if (process.env.AUTH0_CALLBACK_URL) {
    return process.env.AUTH0_CALLBACK_URL;
  }
  if (req) {
    return `${getBaseUrlFromRequest(req)}/api/callback`;
  }
  if (process.env.REPL_SLUG && process.env.REPL_OWNER) {
    return `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co/api/callback`;
  }
  return "http://localhost:5000/api/callback";
}

function resolveLogoutReturnUrl(req?: any): string {
  if (process.env.AUTH0_LOGOUT_URL) {
    return process.env.AUTH0_LOGOUT_URL;
  }
  if (req) {
    return getBaseUrlFromRequest(req);
  }
  if (process.env.REPL_SLUG && process.env.REPL_OWNER) {
    return `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`;
  }
  return "http://localhost:5000";
}

// Auth0 Configuration for Healthcare Application
export function getSession() {
  if (!process.env.DATABASE_URL) {
    throw new Error("Missing required environment variable: DATABASE_URL");
  }
  if (!process.env.SESSION_SECRET) {
    throw new Error("Missing required environment variable: SESSION_SECRET");
  }

  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });

  // Check if we're in production
  const isProduction =
    process.env.REPLIT_DEPLOYMENT === '1' ||
    process.env.NODE_ENV === 'production';
  const isHttps = isProduction;

  console.log("Session configuration:", {
    isProduction,
    isHttps,
    sessionCookieName: SESSION_COOKIE_NAME,
  });

  return session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: true,
    saveUninitialized: true,
    proxy: true,
    name: SESSION_COOKIE_NAME,
    cookie: {
      httpOnly: true,
      secure: isHttps,
      maxAge: sessionTtl,
      sameSite: "lax",
    },
  });
}

export async function setupAuth(app: Express) {
  try {
    console.log("Setting up Auth0 authentication...");
    
    // Check required environment variables
    const requiredEnvVars = ['DATABASE_URL', 'SESSION_SECRET'];
    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
      }
    }

    // Don't setup session here if it's already setup in routes.ts
    // app.use(getSession());
    app.use(passport.initialize());
    app.use(passport.session());

    if (!process.env.AUTH0_DOMAIN || !process.env.AUTH0_CLIENT_ID || !process.env.AUTH0_CLIENT_SECRET) {
      throw new Error("Missing required Auth0 environment variables");
    }

    const callbackURL = resolveCallbackUrl();
    const isProduction =
      process.env.REPLIT_DEPLOYMENT === '1' ||
      process.env.NODE_ENV === 'production';

    console.log('Auth0 configuration:', {
      deployment: process.env.REPLIT_DEPLOYMENT,
      nodeEnv: process.env.NODE_ENV,
      isProduction,
      callbackURL,
      domain: process.env.AUTH0_DOMAIN,
      hasCallbackEnvVar: !!process.env.AUTH0_CALLBACK_URL,
    });

    passport.use(new Auth0Strategy({
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      callbackURL: callbackURL,
      state: true // Enable state parameter for security
    }, async (_accessToken: string, _refreshToken: string, _extraParams: any, profile: any, done: any) => {
      try {
        const userData = {
          id: profile.id,
          email: profile.emails?.[0]?.value || profile.email || '',
          firstName: profile.given_name || profile.name?.givenName || '',
          lastName: profile.family_name || profile.name?.familyName || '',
          profileImageUrl: profile.picture || '',
        };

        const user = await storage.upsertUser(userData);

        // Track new signups (fire-and-forget)
        // createdAt ≈ updatedAt only on first insert (no conflict)
        const isNewUser =
          user.createdAt &&
          user.updatedAt &&
          Math.abs(user.createdAt.getTime() - user.updatedAt.getTime()) < 2000;
        if (isNewUser) {
          void storage.recordAnalytics({
            date: new Date(),
            metric: "daily_signups",
            value: "1",
            category: "users",
            metadata: null,
          }).catch((err) => console.error("Analytics error:", err));
        }

        return done(null, user);
      } catch (error) {
        console.error("Error in Auth0 strategy:", error);
        return done(error);
      }
    }));

    // Serialize user for session
    passport.serializeUser((user: any, done) => {
      done(null, user.id);
    });

    passport.deserializeUser(async (id: string, done) => {
      try {
        const user = await storage.getUser(id);
        if (!user) {
          return done(null, false);
        }
        done(null, user);
      } catch (error) {
        console.error("Error deserializing user:", error);
        done(null, false);
      }
    });

    // Auth0 routes
    // NOTE: Do NOT pass a per-request callbackURL here. The strategy was
    // initialised with the correct AUTH0_CALLBACK_URL (or a derived fallback)
    // at startup. Overriding it per-request can cause a mismatch between the
    // URL used to generate the `state` param and the URL used to verify it,
    // which manifests as "user = false" and a redirect to /login-failed.
    app.get('/api/login', (req, res, next) => {
      const startAuth = () => {
        console.log('[auth] /api/login initiated', {
          ...getAuthRequestContext(req),
          callbackURL,
        });
        passport.authenticate('auth0', {
          scope: 'openid email profile',
        })(req, res, next);
      };

      if (req.session?.regenerate) {
        req.session.regenerate((err) => {
          if (err) {
            console.error("[auth] /api/login — session regenerate failed:", err);
            return res.redirect("/login-failed?reason=session");
          }
          startAuth();
        });
        return;
      }

      startAuth();
    });

    app.get('/api/callback', (req, res, next) => {
      console.log("[auth] /api/callback received", {
        ...getAuthRequestContext(req),
        query: {
          hasCode: !!req.query.code,
          hasState: !!req.query.state,
          error: req.query.error,
          errorDescription: req.query.error_description,
        },
      });

      passport.authenticate('auth0', {}, (err: any, user: any, info: any) => {
        if (err) {
          console.error("[auth] /api/callback — passport error:", {
            message: err?.message,
            stack: err?.stack,
            info: JSON.stringify(info),
            ...getAuthRequestContext(req),
          });
          return res.redirect(`/login-failed?reason=${getSafeAuthFailureReason(err)}`);
        }

        if (!user) {
          // `info` from passport-auth0 contains the specific failure reason
          // (e.g. state mismatch, token exchange failure, user lookup failure).
          console.error("[auth] /api/callback — authentication failed (no user):", {
            info: JSON.stringify(info),
            ...getAuthRequestContext(req),
            query: {
              hasCode: !!req.query.code,
              hasState: !!req.query.state,
              error: req.query.error,
              errorDescription: req.query.error_description,
            },
          });
          const reason = req.query.error || info?.error || "authentication_failed";
          return res.redirect(`/login-failed?reason=${encodeURIComponent(String(reason))}`);
        }

        console.log('[auth] /api/callback — user authenticated, starting session', { userId: user.id });
        req.logIn(user, (loginErr) => {
          if (loginErr) {
            console.error("[auth] /api/callback — req.logIn failed:", loginErr);
            return res.redirect("/login-failed?reason=session_login");
          }

          if (!req.session) {
            console.error("[auth] /api/callback — req.session missing after req.logIn");
            return res.redirect("/login-failed?reason=session_missing");
          }

          req.session.save((saveErr) => {
            if (saveErr) {
              console.error("[auth] /api/callback — session.save failed:", saveErr);
              return res.redirect("/login-failed?reason=session_save");
            }
            console.log("[auth] /api/callback — session persisted", {
              ...getAuthRequestContext(req),
              userId: user.id,
            });
            return res.redirect('/');
          });
        });
      })(req, res, next);
    });

    app.get('/api/logout', (req, res) => {
      const returnUrl = resolveLogoutReturnUrl(req);

      const returnTo = encodeURIComponent(returnUrl);

      req.logout((err) => {
        if (err) {
          console.error("Logout error:", err);
          return res.status(500).send('Logout failed');
        }

        // Auth0 logout URL
        const logoutURL = `https://${process.env.AUTH0_DOMAIN}/v2/logout?returnTo=${returnTo}&client_id=${process.env.AUTH0_CLIENT_ID}`;
        res.redirect(logoutURL);
      });
    });

    console.log("Auth0 authentication setup completed successfully");

    // Common auth routes - removed since it's handled in routes.ts

  } catch (error) {
    console.error("Error setting up authentication:", error);
    throw error;
  }
}

// Authentication middleware
export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};
