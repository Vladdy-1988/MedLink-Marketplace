import { Auth0Provider as Auth0ReactProvider } from '@auth0/auth0-react';
import { ReactNode } from 'react';

interface Auth0ProviderProps {
  children: ReactNode;
}

export function Auth0Provider({ children }: Auth0ProviderProps) {
  // Check if Auth0 credentials are available
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  
  if (!domain || !clientId) {
    // Fallback: render children without Auth0 wrapper
    console.log('Auth0 credentials not configured, using session-based auth fallback');
    return <>{children}</>;
  }

  console.log('Auth0 configured, enabling social logins');
  
  return (
    <Auth0ReactProvider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: `https://${domain}/api/v2/`,
        scope: "openid profile email"
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      {children}
    </Auth0ReactProvider>
  );
}