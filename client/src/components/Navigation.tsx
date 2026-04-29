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

  const navLinkClass = "block rounded-xl px-3 py-2 text-base font-semibold text-slate-700 transition-colors hover:bg-sky-50 hover:text-blue-700";

  return (
    <nav className="sticky top-0 z-50 border-b border-sky-100/80 bg-white/90 shadow-[0_12px_34px_rgba(15,76,117,0.06)] backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <MedlinkLogo size="md" />
            </Link>

            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-8">
                <Link href="/providers" className="text-base font-semibold text-slate-700 transition-colors hover:text-blue-700">
                  Find Providers
                </Link>
                <Link href="/services" className="text-base font-semibold text-slate-700 transition-colors hover:text-blue-700">
                  Services
                </Link>
                <Link href="/how-it-works" className="text-base font-semibold text-slate-700 transition-colors hover:text-blue-700">
                  How It Works
                </Link>
                {!isAuthenticated && (
                  <Link href="/apply" className="text-base font-semibold text-slate-700 transition-colors hover:text-blue-700">
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
                    <Button variant="ghost" className="rounded-full text-blue-700 hover:bg-sky-50">
                      Provider Dashboard
                    </Button>
                  </Link>
                )}
                {user?.userType === "admin" && (
                  <>
                    <Link href="/comprehensive-admin-portal">
                      <Button variant="ghost" className="rounded-full text-blue-700 hover:bg-sky-50">
                        Admin Portal
                      </Button>
                    </Link>
                    <Link href="/provider-verification">
                      <Button variant="ghost" className="rounded-full text-blue-700 hover:bg-sky-50">
                        Provider Verification
                      </Button>
                    </Link>
                  </>
                )}
                {user?.userType === "provider" && (
                  <Link href="/provider-documents">
                    <Button variant="ghost" className="rounded-full text-blue-700 hover:bg-sky-50">
                      Submit Documents
                    </Button>
                  </Link>
                )}
                {user?.userType === "patient" && (
                  <Link href="/dashboard/patient">
                    <Button variant="ghost" className="rounded-full text-blue-700 hover:bg-sky-50">
                      My Dashboard
                    </Button>
                  </Link>
                )}
                <Button onClick={handleLogout} variant="outline" className="rounded-full border-sky-100 bg-white">
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleLogin} variant="ghost" className="rounded-full text-blue-700 hover:bg-sky-50">
                  Sign In
                </Button>
                <Button onClick={handleLogin} className="rounded-full bg-teal-500 shadow-sm shadow-teal-500/20 hover:bg-teal-600">
                  Get Started
                </Button>
              </>
            )}
          </div>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-full p-2 text-slate-700 hover:bg-sky-50"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-sky-100 py-3">
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

            <div className="mt-3 pt-3 border-t border-sky-100 space-y-2">
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
                  <Button onClick={handleLogin} variant="ghost" className="w-full rounded-full text-blue-700">
                    Sign In
                  </Button>
                  <Button
                    onClick={handleLogin}
                    className="w-full rounded-full bg-teal-500 hover:bg-teal-600"
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
