// Example Auth0 integration for healthcare application
// This would replace the current Replit Auth setup

import { Strategy as Auth0Strategy } from 'passport-auth0';
import passport from 'passport';
import session from 'express-session';
import type { Express } from 'express';

// Auth0 Configuration (HIPAA-compliant setup)
export function setupAuth0(app: Express) {
  // Session configuration
  app.use(session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  // Auth0 Strategy
  passport.use(new Auth0Strategy({
    domain: process.env.AUTH0_DOMAIN!,
    clientID: process.env.AUTH0_CLIENT_ID!,
    clientSecret: process.env.AUTH0_CLIENT_SECRET!,
    callbackURL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:5000/callback'
  }, async (accessToken, refreshToken, extraParams, profile, done) => {
    // Upsert user in database
    try {
      const user = await storage.upsertUser({
        id: profile.id,
        email: profile.emails?.[0]?.value || '',
        firstName: profile.given_name || '',
        lastName: profile.family_name || '',
        profileImageUrl: profile.picture || '',
      });
      return done(null, user);
    } catch (error) {
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
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Auth routes
  app.get('/api/login', passport.authenticate('auth0', {
    scope: 'openid email profile'
  }));

  app.get('/callback', passport.authenticate('auth0', {
    failureRedirect: '/login-failed'
  }), (req, res) => {
    res.redirect('/');
  });

  app.get('/api/logout', (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).send('Logout failed');
      
      // Auth0 logout URL
      const returnTo = encodeURIComponent(process.env.BASE_URL || 'http://localhost:5000');
      const logoutURL = `https://${process.env.AUTH0_DOMAIN}/v2/logout?returnTo=${returnTo}&client_id=${process.env.AUTH0_CLIENT_ID}`;
      
      res.redirect(logoutURL);
    });
  });

  app.get('/api/auth/user', (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    res.json(req.user);
  });
}

// Required environment variables for Auth0:
// AUTH0_DOMAIN=your-domain.auth0.com
// AUTH0_CLIENT_ID=your-client-id
// AUTH0_CLIENT_SECRET=your-client-secret
// AUTH0_CALLBACK_URL=http://localhost:5000/callback (or your domain)
// SESSION_SECRET=your-session-secret