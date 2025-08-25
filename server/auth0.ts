import { Strategy as Auth0Strategy } from 'passport-auth0';
import passport from 'passport';
import session from 'express-session';
import type { Express, RequestHandler } from 'express';
import connectPg from 'connect-pg-simple';
import { storage } from './storage';

// Auth0 Configuration for Healthcare Application
export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  
  const isProduction = process.env.REPLIT_DEPLOYMENT === '1' || process.env.NODE_ENV === 'production';
  const isHttps = process.env.REPLIT_DEPLOYMENT === '1' || process.env.NODE_ENV === 'production';
  
  console.log("Session configuration:", { isProduction, isHttps });
  
  return session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-for-development',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    name: 'medlink.session',
    cookie: {
      httpOnly: true,
      secure: isHttps,
      maxAge: sessionTtl,
      sameSite: isProduction ? 'none' : 'lax',
      domain: isProduction ? '.mymedlink.ca' : undefined,
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

    // Auth0 Strategy - only if Auth0 credentials are available
    if (process.env.AUTH0_DOMAIN && process.env.AUTH0_CLIENT_ID && process.env.AUTH0_CLIENT_SECRET) {
      passport.use(new Auth0Strategy({
        domain: process.env.AUTH0_DOMAIN,
        clientID: process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
        callbackURL: process.env.AUTH0_CALLBACK_URL || 'https://mymedlink.ca/api/callback'
      }, async (accessToken: string, refreshToken: string, extraParams: any, profile: any, done: any) => {
        try {
          console.log("Auth0 callback - creating/updating user:", profile.id);
          
          const userData = {
            id: profile.id,
            email: profile.emails?.[0]?.value || profile.email || '',
            firstName: profile.given_name || profile.name?.givenName || '',
            lastName: profile.family_name || profile.name?.familyName || '',
            profileImageUrl: profile.picture || '',
          };
          
          console.log("Creating/updating user with data:", userData);
          const user = await storage.upsertUser(userData);
          
          console.log("User created/updated successfully:", user.id);
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
          console.log("Attempting to deserialize user with ID:", id);
          const user = await storage.getUser(id);
          if (!user) {
            console.log("User not found for ID:", id);
            return done(null, false);
          }
          console.log("User deserialized successfully:", user.email);
          done(null, user);
        } catch (error) {
          console.error("Error deserializing user:", error);
          // Don't pass the error, just return null user to avoid breaking the session
          done(null, false);
        }
      });

      // Auth0 routes
      app.get('/api/login', passport.authenticate('auth0', {
        scope: 'openid email profile'
      }));

      app.get('/api/callback', passport.authenticate('auth0', {
        failureRedirect: '/login-failed'
      }), (req, res) => {
        console.log("Auth0 callback successful, redirecting to home");
        res.redirect('/');
      });

      app.get('/api/logout', (req, res) => {
        const baseUrl = 'https://mymedlink.ca';
        const returnTo = encodeURIComponent(baseUrl);
        
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
    } else {
      console.log("Auth0 credentials not provided, using fallback session-only auth");
      
      // Fallback: simple session-based auth for testing
      app.post('/api/login', async (req, res) => {
        const { email } = req.body;
        if (!email) {
          return res.status(400).json({ error: 'Email required' });
        }
        
        try {
          // Create a test user
          const user = await storage.upsertUser({
            id: `test-${Date.now()}`,
            email,
            firstName: email.split('@')[0],
            lastName: 'User',
            profileImageUrl: '',
          });
          
          (req as any).login(user, (err: any) => {
            if (err) return res.status(500).json({ error: 'Login failed' });
            res.json(user);
          });
        } catch (error) {
          res.status(500).json({ error: 'Login failed' });
        }
      });
    }

    // Common auth routes
    app.get('/api/auth/user', (req, res) => {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      res.json(req.user);
    });

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