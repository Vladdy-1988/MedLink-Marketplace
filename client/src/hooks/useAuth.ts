import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import type { User } from "@shared/schema";

export function useAuth() {
  // Canonical auth state comes from the server session (/api/login + /api/callback).
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  return {
    user: user || null,
    isLoading,
    isAuthenticated: !!user,
    loginWithRedirect: () => {
      window.location.href = "/api/login";
    },
    logout: () => {
      window.location.href = "/api/logout";
    },
  };
}
