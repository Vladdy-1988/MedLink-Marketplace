import { lazy, Suspense } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import ScrollToTop from "@/components/ScrollToTop";
import { Auth0Provider } from "@/components/Auth0Provider";
import { OnboardingWizard } from "@/components/OnboardingWizard";
import { SubscriptionGate } from "@/components/SubscriptionGate";
import ConnectSuccess from "@/pages/connect-success";
import ConnectRefresh from "@/pages/connect-refresh";

const NotFound = lazy(() => import("@/pages/not-found"));
const Landing = lazy(() => import("@/pages/landing"));
const Home = lazy(() => import("@/pages/home"));
const Providers = lazy(() => import("@/pages/providers"));
const ProviderProfile = lazy(() => import("@/pages/provider-profile"));
const Booking = lazy(() => import("@/pages/booking"));
const PatientDashboard = lazy(() => import("@/pages/patient-dashboard"));
const ProviderDashboard = lazy(() => import("@/pages/provider-dashboard"));
const AdminDashboard = lazy(() => import("@/pages/admin-dashboard"));
const ProviderRegistration = lazy(() => import("@/pages/provider-registration-optimized"));
const Services = lazy(() => import("@/pages/services"));
const HowItWorks = lazy(() => import("@/pages/how-it-works"));
const RapidServices = lazy(() => import("@/pages/rapid-services"));
const About = lazy(() => import("@/pages/about"));
const Safety = lazy(() => import("@/pages/safety"));
const Support = lazy(() => import("@/pages/support"));
const Checkout = lazy(() => import("@/pages/checkout"));
const BookingSuccess = lazy(() => import("@/pages/booking-success"));
const Messages = lazy(() => import("@/pages/messages"));
const ProviderVerification = lazy(() => import("@/pages/provider-verification"));
const ProviderDocumentSubmission = lazy(() => import("@/pages/provider-document-submission"));
const ComprehensiveAdminPortal = lazy(() => import("@/pages/comprehensive-admin-portal"));
const AdminData = lazy(() => import("@/pages/admin-data"));
const AdminPortal = lazy(() => import("@/pages/admin-portal"));
const AuthTest = lazy(() => import("@/pages/auth-test"));
const AuthLogin = lazy(() => import("@/pages/auth-login"));
const LoginFailed = lazy(() => import("@/pages/login-failed"));
const Subscribe = lazy(() => import("@/pages/Subscribe"));
const SubscribeSuccess = lazy(() => import("@/pages/SubscribeSuccess"));

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  const showOnboarding =
    isAuthenticated &&
    !isLoading &&
    user &&
    (user as any).onboardingCompleted === false &&
    (user as any).userType === "patient";

  return (
    <>
      {showOnboarding && (
        <OnboardingWizard userName={(user as any).firstName || undefined} />
      )}
    <Switch>
      {/* Admin portals always accessible - handles auth internally */}
      <Route path="/admin-portal" component={AdminPortal} />
      <Route path="/comprehensive-admin-portal" component={ComprehensiveAdminPortal} />
      <Route path="/provider-verification" component={ProviderVerification} />
      <Route path="/provider-documents" component={ProviderDocumentSubmission} />
      <Route path="/auth-test" component={AuthTest} />
      <Route path="/auth-login" component={AuthLogin} />
      <Route path="/login-failed" component={LoginFailed} />
      <Route path="/connect/success" component={ConnectSuccess} />
      <Route path="/connect/refresh" component={ConnectRefresh} />
      
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/providers" component={Providers} />
          <Route path="/providers/:id" component={ProviderProfile} />
          <Route path="/provider/:id" component={ProviderProfile} />
          <Route path="/apply" component={ProviderRegistration} />
          <Route path="/subscribe" component={Subscribe} />
          <Route path="/subscribe/success" component={SubscribeSuccess} />
          <Route path="/services" component={Services} />
          <Route path="/how-it-works" component={HowItWorks} />
          <Route path="/rapid-services" component={RapidServices} />
          <Route path="/about" component={About} />
          <Route path="/safety" component={Safety} />
          <Route path="/support" component={Support} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/providers" component={Providers} />
          <Route path="/providers/:id" component={ProviderProfile} />
          <Route path="/provider/:id" component={ProviderProfile} />
          <Route path="/booking/:providerId/:serviceId">
            <SubscriptionGate>
              <Booking />
            </SubscriptionGate>
          </Route>
          <Route path="/apply" component={ProviderRegistration} />
          <Route path="/subscribe" component={Subscribe} />
          <Route path="/subscribe/success" component={SubscribeSuccess} />
          <Route path="/services" component={Services} />
          <Route path="/how-it-works" component={HowItWorks} />
          <Route path="/rapid-services" component={RapidServices} />
          <Route path="/about" component={About} />
          <Route path="/safety" component={Safety} />
          <Route path="/support" component={Support} />
          <Route path="/dashboard/patient" component={PatientDashboard} />
          <Route path="/dashboard/provider" component={ProviderDashboard} />
          <Route path="/dashboard/admin" component={AdminDashboard} />
          <Route path="/checkout">
            <SubscriptionGate>
              <Checkout />
            </SubscriptionGate>
          </Route>
          <Route path="/booking-success" component={BookingSuccess} />
          <Route path="/messages" component={Messages} />
          <Route path="/provider/verification" component={ProviderVerification} />
          <Route path="/admin-data" component={AdminData} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
    </>
  );
}

function App() {
  return (
    <Auth0Provider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ScrollToTop />
          <Toaster />
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            }
          >
            <Router />
          </Suspense>
        </TooltipProvider>
      </QueryClientProvider>
    </Auth0Provider>
  );
}

export default App;
