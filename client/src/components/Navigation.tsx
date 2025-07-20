import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Heart } from "lucide-react";

export default function Navigation() {
  const { isAuthenticated, user } = useAuth();
  const [location] = useLocation();

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Heart className="h-8 w-8 medical-blue mr-2" />
              <span className="text-xl font-bold text-gray-900">MedLink House Calls</span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-8">
                <Link href="/providers" className="text-gray-700 hover:text-[hsl(207,90%,54%)] transition-colors">
                  Find Providers
                </Link>
                <a href="#services" className="text-gray-700 hover:text-[hsl(207,90%,54%)] transition-colors">Services</a>
                <a href="#how-it-works" className="text-gray-700 hover:text-[hsl(207,90%,54%)] transition-colors">How It Works</a>
                {!isAuthenticated && (
                  <a href="#become-provider" className="text-gray-700 hover:text-[hsl(207,90%,54%)] transition-colors">Become a Provider</a>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {user?.userType === 'provider' && (
                  <Link href="/dashboard/provider">
                    <Button variant="ghost" className="text-[hsl(207,90%,54%)]">
                      Provider Dashboard
                    </Button>
                  </Link>
                )}
                {user?.userType === 'admin' && (
                  <Link href="/dashboard/admin">
                    <Button variant="ghost" className="text-[hsl(207,90%,54%)]">
                      Admin Panel
                    </Button>
                  </Link>
                )}
                {user?.userType === 'patient' && (
                  <Link href="/dashboard/patient">
                    <Button variant="ghost" className="text-[hsl(207,90%,54%)]">
                      My Dashboard
                    </Button>
                  </Link>
                )}
                <Button onClick={handleLogout} variant="outline">
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleLogin} variant="ghost" className="text-[hsl(207,90%,54%)]">
                  Sign In
                </Button>
                <Button onClick={handleLogin} className="bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)]">
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
