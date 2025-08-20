import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function AuthTest() {
  const [email, setEmail] = useState('');
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth();
  const { toast } = useToast();

  const handleLogin = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    try {
      await apiRequest('POST', '/api/login', { email });
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
      // Reload to update user state
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error", 
        description: "Login failed",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <Navigation />
      
      <div className="pt-20 pb-16">
        <div className="max-w-md mx-auto px-6">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white text-center">
                Authentication Test
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isAuthenticated ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter any email address"
                      className="bg-white/20 border-white/30 text-white placeholder-gray-300"
                    />
                  </div>
                  <Button
                    onClick={handleLogin}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Test Login
                  </Button>
                  <p className="text-sm text-gray-300 text-center">
                    Enter any email address to test the authentication system
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-white">Welcome!</h3>
                    <p className="text-gray-300">{user?.email}</p>
                    <p className="text-sm text-gray-400">
                      Name: {user?.firstName} {user?.lastName}
                    </p>
                  </div>
                  <Button
                    onClick={logout}
                    variant="outline"
                    className="w-full border-white/30 text-white hover:bg-white/10"
                  >
                    Logout
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}