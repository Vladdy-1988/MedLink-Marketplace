import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function LoginFailed() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full mx-auto p-8">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Authentication Failed
          </h2>
          
          <p className="text-gray-600 mb-6">
            We couldn't sign you in. This might be because:
          </p>
          
          <ul className="text-left text-sm text-gray-600 mb-6 space-y-2">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Your Auth0 account needs to be verified</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>The authentication service is temporarily unavailable</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Your browser is blocking cookies</span>
            </li>
          </ul>
          
          <div className="space-y-3">
            <Link href="/api/login">
              <Button className="w-full" data-testid="button-try-again">
                Try Again
              </Button>
            </Link>
            
            <Link href="/">
              <Button variant="outline" className="w-full" data-testid="button-home">
                Go to Homepage
              </Button>
            </Link>
          </div>
          
          <p className="mt-6 text-xs text-gray-500">
            If you continue to have problems, please contact support
          </p>
        </div>
      </div>
    </div>
  );
}