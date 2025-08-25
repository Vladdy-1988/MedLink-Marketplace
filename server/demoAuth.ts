import type { Express } from 'express';
import { storage } from './storage';

// Simple demo authentication for development
export function setupDemoAuth(app: Express) {
  // Demo login page
  app.get('/api/login', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Demo Login - MedLink</title>
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          .login-container {
            background: white;
            padding: 2rem;
            border-radius: 1rem;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            width: 100%;
            max-width: 400px;
          }
          h2 {
            margin: 0 0 1.5rem 0;
            color: #333;
            text-align: center;
          }
          .demo-users {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          .user-card {
            border: 1px solid #e0e0e0;
            padding: 1rem;
            border-radius: 0.5rem;
            cursor: pointer;
            transition: all 0.2s;
            text-decoration: none;
            color: inherit;
          }
          .user-card:hover {
            background: #f5f5f5;
            border-color: #4f46e5;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.15);
          }
          .user-name {
            font-weight: 600;
            color: #333;
            margin-bottom: 0.25rem;
          }
          .user-type {
            font-size: 0.875rem;
            color: #666;
            text-transform: capitalize;
          }
          .user-email {
            font-size: 0.875rem;
            color: #888;
          }
          .divider {
            margin: 1.5rem 0;
            text-align: center;
            color: #999;
            font-size: 0.875rem;
          }
          .back-link {
            display: block;
            text-align: center;
            margin-top: 1.5rem;
            color: #4f46e5;
            text-decoration: none;
            font-size: 0.875rem;
          }
          .back-link:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="login-container">
          <h2>Demo Login - MedLink</h2>
          <div class="divider">Select a demo account to sign in:</div>
          <div class="demo-users">
            <a href="/api/demo-login/patient" class="user-card">
              <div class="user-name">Sarah Johnson</div>
              <div class="user-type">Patient Account</div>
              <div class="user-email">sarah@example.com</div>
            </a>
            <a href="/api/demo-login/provider" class="user-card">
              <div class="user-name">Dr. Michael Chen</div>
              <div class="user-type">Provider Account</div>
              <div class="user-email">dr.chen@example.com</div>
            </a>
            <a href="/api/demo-login/admin" class="user-card">
              <div class="user-name">Admin User</div>
              <div class="user-type">Administrator Account</div>
              <div class="user-email">admin@mymedlink.ca</div>
            </a>
          </div>
          <a href="/" class="back-link">← Back to Home</a>
        </div>
      </body>
      </html>
    `);
  });

  // Demo login handlers
  app.get('/api/demo-login/:userType', async (req, res) => {
    const { userType } = req.params;
    
    try {
      let userData: any;
      
      switch (userType) {
        case 'patient':
          userData = {
            id: 'demo-patient-1',
            email: 'sarah@example.com',
            firstName: 'Sarah',
            lastName: 'Johnson',
            userType: 'patient' as const,
            profileImageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
          };
          break;
          
        case 'provider':
          userData = {
            id: 'demo-provider-1',
            email: 'dr.chen@example.com',
            firstName: 'Michael',
            lastName: 'Chen',
            userType: 'provider' as const,
            profileImageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200',
          };
          break;
          
        case 'admin':
          userData = {
            id: 'demo-admin-1',
            email: 'admin@mymedlink.ca',
            firstName: 'Admin',
            lastName: 'User',
            userType: 'admin' as const,
            profileImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
          };
          break;
          
        default:
          return res.status(400).json({ message: 'Invalid user type' });
      }
      
      // Create or update user in storage
      const user = await storage.upsertUser(userData);
      
      // Set user in session
      (req as any).session.userId = user.id;
      (req as any).session.user = user;
      
      // Redirect to home page
      res.redirect('/');
    } catch (error) {
      console.error('Demo login error:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  });

  // Get current user
  app.get('/api/auth/user', (req, res) => {
    const user = (req as any).session?.user;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    res.json(user);
  });

  // Logout
  app.post('/api/logout', (req, res) => {
    (req as any).session?.destroy(() => {
      res.json({ message: 'Logged out successfully' });
    });
  });
  
  app.get('/api/logout', (req, res) => {
    (req as any).session?.destroy(() => {
      res.redirect('/');
    });
  });
}