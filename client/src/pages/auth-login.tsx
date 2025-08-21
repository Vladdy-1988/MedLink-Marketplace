import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useLocation } from 'wouter';

export default function AuthLogin() {
  const { user, isAuthenticated, isLoading, loginWithRedirect } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    // If user is already authenticated, redirect to home
    if (isAuthenticated && user) {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-white mx-auto mb-4" />
          <p className="text-white text-lg">Loading authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <Navigation />
      
      <div className="pt-32 pb-16">
        <div className="max-w-md mx-auto px-6">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-white text-center">
                Welcome to MyMedLink
              </CardTitle>
              <p className="text-gray-300 text-center mt-2">
                Sign in to access your healthcare dashboard
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Button
                  onClick={() => loginWithRedirect()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
                  data-testid="button-auth0-login"
                >
                  Sign In with Auth0
                </Button>
                
                <div className="text-center">
                  <p className="text-sm text-gray-300">
                    Sign in with Google, GitHub, email, or other supported methods
                  </p>
                </div>

                <div className="border-t border-white/20 pt-4">
                  <p className="text-xs text-gray-400 text-center">
                    By signing in, you agree to our Terms of Service and Privacy Policy. 
                    Your healthcare data is protected with HIPAA-compliant security.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}