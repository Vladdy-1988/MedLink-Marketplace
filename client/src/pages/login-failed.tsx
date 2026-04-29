import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";

const authFailureMessages: Record<string, string> = {
  account_email_exists:
    "This email already exists under another sign-in method. Please try again now, or use the same method you used originally.",
  auth_callback:
    "Auth0 returned to MedLink, but the final sign-in step could not be completed.",
  authentication_failed:
    "The authentication service could not complete sign-in.",
  database:
    "MedLink could not finish creating or updating your account record.",
  database_schema:
    "MedLink is updating an account database field required for sign-in.",
  session:
    "MedLink could not start a fresh sign-in session.",
  session_login:
    "MedLink could not attach your account to the current session.",
  session_missing:
    "MedLink could not find the sign-in session after Auth0 returned.",
  session_save:
    "MedLink could not save your signed-in session.",
};

export default function LoginFailed() {
  const retryLogin = () => {
    window.location.assign("/api/login");
  };
  const reason =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("reason")
      : null;
  const authDetail = reason
    ? authFailureMessages[reason] ||
      "The authentication service returned an error. Please try again."
    : null;

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

          {authDetail && (
            <div className="mb-6 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-left text-sm text-red-700">
              <span className="font-semibold">Auth detail:</span> {authDetail}
            </div>
          )}
          
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
            <Button
              className="w-full"
              data-testid="button-try-again"
              onClick={retryLogin}
            >
              Try Again
            </Button>
            
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
