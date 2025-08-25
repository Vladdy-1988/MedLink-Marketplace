import type { Express } from 'express';

export function setupAuth0Debug(app: Express) {
  // Debug endpoint to check Auth0 configuration
  app.get('/api/auth/debug', (req, res) => {
    const config = {
      auth0Domain: process.env.AUTH0_DOMAIN ? 'Set' : 'Not set',
      auth0ClientId: process.env.AUTH0_CLIENT_ID ? 'Set' : 'Not set',
      auth0ClientSecret: process.env.AUTH0_CLIENT_SECRET ? 'Set' : 'Not set',
      auth0CallbackUrl: process.env.AUTH0_CALLBACK_URL || 'Not set',
      auth0LogoutUrl: process.env.AUTH0_LOGOUT_URL || 'Not set',
      replitDeployment: process.env.REPLIT_DEPLOYMENT || 'Not set',
      nodeEnv: process.env.NODE_ENV || 'Not set',
      replitSlug: process.env.REPL_SLUG || 'Not set',
      replitOwner: process.env.REPL_OWNER || 'Not set',
      host: req.headers.host,
      protocol: req.protocol,
      originalUrl: req.originalUrl,
      sessionSecret: process.env.SESSION_SECRET ? 'Set' : 'Not set',
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set'
    };
    
    res.json(config);
  });
  
  // Test endpoint to verify session
  app.get('/api/auth/session', (req, res) => {
    res.json({
      sessionId: req.sessionID,
      session: req.session,
      isAuthenticated: req.isAuthenticated ? req.isAuthenticated() : false,
      user: (req as any).user || null
    });
  });
}