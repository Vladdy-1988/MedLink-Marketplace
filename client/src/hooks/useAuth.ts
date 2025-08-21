import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import type { User } from "@shared/schema";
import { useAuth0 } from '@auth0/auth0-react';

export function useAuth() {
  // Try to use Auth0 if available
  const auth0 = useAuth0();
  
  // Fallback to API-based auth if Auth0 is not configured
  const { data: user, isLoading: apiLoading } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !auth0.isLoading && !auth0.user, // Only use API auth if Auth0 is not active
  });

  // If Auth0 is configured and active, use Auth0 data
  if (auth0.user && !auth0.isLoading) {
    return {
      user: {
        id: auth0.user.sub || '',
        email: auth0.user.email || '',
        firstName: auth0.user.given_name || auth0.user.name?.split(' ')[0] || '',
        lastName: auth0.user.family_name || auth0.user.name?.split(' ')[1] || '',
        profileImageUrl: auth0.user.picture || '',
        userType: 'patient', // Default to patient, can be updated based on your logic
      } as User,
      isAuthenticated: auth0.isAuthenticated,
      isLoading: auth0.isLoading,
      loginWithRedirect: auth0.loginWithRedirect,
      logout: () => auth0.logout({ 
        logoutParams: { 
          returnTo: window.location.origin 
        } 
      }),
    };
  }

  // Fallback to API-based auth
  return {
    user: user || null,
    isLoading: apiLoading || auth0.isLoading,
    isAuthenticated: !!user,
    loginWithRedirect: () => { window.location.href = '/api/login'; },
    logout: () => { window.location.href = '/api/logout'; },
  };
}
