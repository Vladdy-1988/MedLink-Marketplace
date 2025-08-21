# Auth0 Production Setup for MyMedLink

## Critical Issue Resolution

The "Failed to deserialize user out of session" error occurs because Auth0 needs to be configured for your production domain.

## Required Auth0 Dashboard Configuration

### 1. Update Allowed Callback URLs
In your Auth0 Dashboard:
1. Go to Applications > Your App > Settings
2. Find "Allowed Callback URLs" 
3. Add: `https://mymedlink.ca/api/callback`
4. Keep existing: `http://localhost:5000/api/callback` (for development)

### 2. Update Allowed Logout URLs
1. Find "Allowed Logout URLs"
2. Add: `https://mymedlink.ca`
3. Keep existing: `http://localhost:5000` (for development)

### 3. Update Allowed Web Origins
1. Find "Allowed Web Origins"
2. Add: `https://mymedlink.ca`
3. Keep existing: `http://localhost:5000` (for development)

### 4. Save Changes
Click "Save Changes" at the bottom of the settings page.

## Environment Variables Needed
Make sure these are set in your Replit Secrets:
- `AUTH0_DOMAIN`: your-app.us.auth0.com
- `AUTH0_CLIENT_ID`: your client ID
- `AUTH0_CLIENT_SECRET`: your client secret
- `VITE_AUTH0_DOMAIN`: same as AUTH0_DOMAIN
- `VITE_AUTH0_CLIENT_ID`: same as AUTH0_CLIENT_ID

## Testing the Fix
After updating Auth0 settings:
1. Visit https://mymedlink.ca
2. Click "Sign In"
3. You should see Auth0 login options
4. Complete authentication with Google/email
5. Get redirected back to your app successfully

## Security Notes
- Production uses secure HTTPS cookies
- Session domain is set to `.mymedlink.ca`
- HIPAA-compliant authentication enabled
- Sessions stored in PostgreSQL for reliability

## Troubleshooting
If still getting errors:
1. Check Auth0 Dashboard logs (Monitoring > Logs)
2. Verify all callback URLs match exactly
3. Ensure HTTPS is working on your domain
4. Check browser developer console for errors