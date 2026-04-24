import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { MedlinkLogo } from "./MedlinkLogo";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogin = useCallback(() => {
    if (typeof loginWithRedirect === "function") {
      loginWithRedirect();
    } else {
      window.location.href = "/api/login";
    }
  }, [loginWithRedirect]);

  const handleLogout = useCallback(() => {
    if (typeof logout === "function") {
      logout();
    } else {
      window.location.href = "/api/logout";
    }
  }, [logout]);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  useEffect(() => {
    closeMobileMenu();
  }, [location, closeMobileMenu]);

  const navLinkClass = "block px-3 py-2 text-gray-700 hover:text-[hsl(207,90%,54%)] transition-colors";

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
                  <Link href="/apply" className="text-gray-700 hover:text-[hsl(207,90%,54%)] transition-colors">
                    Become a Provider
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* UI-only role checks for navigation. Server/API enforce real authorization. */}
                {user?.userType === "provider" && (
                  <Link href="/dashboard/provider">
                    <Button variant="ghost" className="text-[hsl(207,90%,54%)]">
                      Provider Dashboard
                    </Button>
                  </Link>
                )}
                {user?.userType === "admin" && (
                  <>
                    <Link href="/comprehensive-admin-portal">
                      <Button variant="ghost" className="text-[hsl(207,90%,54%)]">
                        Admin Portal
                      </Button>
                    </Link>
                    <Link href="/provider-verification">
                      <Button variant="ghost" className="text-[hsl(207,90%,54%)]">
                        Provider Verification
                      </Button>
                    </Link>
                  </>
                )}
                {user?.userType === "provider" && (
                  <Link href="/provider-documents">
                    <Button variant="ghost" className="text-[hsl(207,90%,54%)]">
                      Submit Documents
                    </Button>
                  </Link>
                )}
                {user?.userType === "patient" && (
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

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-3">
            <div className="space-y-1">
              <Link href="/providers" className={navLinkClass} onClick={closeMobileMenu}>
                Find Providers
              </Link>
              <Link href="/services" className={navLinkClass} onClick={closeMobileMenu}>
                Services
              </Link>
              <Link href="/how-it-works" className={navLinkClass} onClick={closeMobileMenu}>
                How It Works
              </Link>
              {!isAuthenticated && (
                <Link href="/apply" className={navLinkClass} onClick={closeMobileMenu}>
                  Become a Provider
                </Link>
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
              {isAuthenticated ? (
                <>
                  {/* UI-only role checks for mobile navigation. Server/API enforce real authorization. */}
                  {user?.userType === "provider" && (
                    <Link href="/dashboard/provider" className={navLinkClass} onClick={closeMobileMenu}>
                      Provider Dashboard
                    </Link>
                  )}
                  {user?.userType === "admin" && (
                    <>
                      <Link href="/comprehensive-admin-portal" className={navLinkClass} onClick={closeMobileMenu}>
                        Admin Portal
                      </Link>
                      <Link href="/provider-verification" className={navLinkClass} onClick={closeMobileMenu}>
                        Provider Verification
                      </Link>
                    </>
                  )}
                  {user?.userType === "provider" && (
                    <Link href="/provider-documents" className={navLinkClass} onClick={closeMobileMenu}>
                      Submit Documents
                    </Link>
                  )}
                  {user?.userType === "patient" && (
                    <Link href="/dashboard/patient" className={navLinkClass} onClick={closeMobileMenu}>
                      My Dashboard
                    </Link>
                  )}
                  <Button
                    onClick={() => {
                      closeMobileMenu();
                      handleLogout();
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={handleLogin} variant="ghost" className="w-full text-[hsl(207,90%,54%)]">
                    Sign In
                  </Button>
                  <Button
                    onClick={handleLogin}
                    className="w-full bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)]"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
