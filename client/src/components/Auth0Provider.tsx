import { ReactNode } from 'react';

interface Auth0ProviderProps {
  children: ReactNode;
}

export function Auth0Provider({ children }: Auth0ProviderProps) {
  // Auth is handled by server-side Auth0 session routes (/api/login, /api/callback).
  return <>{children}</>;
}
