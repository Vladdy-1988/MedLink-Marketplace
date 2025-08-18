import React, { useCallback, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { MedlinkLogo } from "./MedlinkLogo";

export default function Navigation() {
  const { isAuthenticated, user } = useAuth();
  const [location] = useLocation();

  const handleLogin = useCallback(() => {
    window.location.href = "/api/login";
  }, []);

  const handleLogout = useCallback(() => {
    window.location.href = "/api/logout";
  }, []);

  const handleServicesClick = useCallback(() => {
    if (location === '/') {
      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/#services';
    }
  }, [location]);

  const handleHowItWorksClick = useCallback(() => {
    if (location === '/') {
      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/#how-it-works';
    }
  }, [location]);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <MedlinkLogo size="md" />
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-8">
                <Link href="/providers" className="text-gray-700 hover:text-[hsl(207,90%,54%)] transition-colors">
                  Find Providers
                </Link>
                <Link href="/services" className="text-gray-700 hover:text-[hsl(207,90%,54%)] transition-colors">
                  Services
                </Link>
                <Link href="/how-it-works" className="text-gray-700 hover:text-[hsl(207,90%,54%)] transition-colors">
                  How It Works
                </Link>
                {!isAuthenticated && (
                  <Link href="/apply">
                    <button 
                      className="text-gray-700 hover:text-[hsl(207,90%,54%)] transition-colors"
                    >
                      Become a Provider
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {user?.userType === 'provider' && (
                  <Link href="/provider-dashboard">
                    <Button variant="ghost" className="text-[hsl(207,90%,54%)]">
                      Provider Dashboard
                    </Button>
                  </Link>
                )}
                {user?.userType === 'admin' && (
                  <Link href="/admin-portal">
                    <Button variant="ghost" className="text-[hsl(207,90%,54%)]">
                      Admin Portal
                    </Button>
                  </Link>
                )}
                {user?.userType === 'patient' && (
                  <Link href="/patient-dashboard">
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
