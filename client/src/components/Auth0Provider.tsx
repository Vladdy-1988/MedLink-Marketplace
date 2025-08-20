import { ReactNode } from 'react';

interface Auth0ProviderProps {
  children: ReactNode;
}

// Simplified Auth0Provider that just passes through children for now
// This avoids import errors while we set up the authentication system
export function Auth0Provider({ children }: Auth0ProviderProps) {
  // Auth0 is available but not configured yet - fallback to session auth
  console.log('Auth0 provider loaded, using session-based auth fallback');
  return <>{children}</>;
}