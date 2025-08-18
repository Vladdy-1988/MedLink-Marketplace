import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import ScrollToTop from "@/components/ScrollToTop";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Providers from "@/pages/providers";
import ProviderProfile from "@/pages/provider-profile";
import Booking from "@/pages/booking";
import PatientDashboard from "@/pages/patient-dashboard";
import ProviderDashboard from "@/pages/provider-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import ProviderRegistration from "@/pages/provider-registration-optimized";
import Services from "@/pages/services";
import HowItWorks from "@/pages/how-it-works";
import RapidServices from "@/pages/rapid-services";
import About from "@/pages/about";
import Safety from "@/pages/safety";
import Support from "@/pages/support";
import Checkout from "@/pages/checkout";
import BookingSuccess from "@/pages/booking-success";
import Messages from "@/pages/messages";
import ProviderVerification from "@/pages/provider-verification";
import AdminData from "@/pages/admin-data";
import AdminPortal from "@/pages/admin-portal";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/providers" component={Providers} />
          <Route path="/provider/:id" component={ProviderProfile} />
          <Route path="/apply" component={ProviderRegistration} />
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
          <Route path="/provider/:id" component={ProviderProfile} />
          <Route path="/booking/:providerId/:serviceId" component={Booking} />
          <Route path="/apply" component={ProviderRegistration} />
          <Route path="/services" component={Services} />
          <Route path="/how-it-works" component={HowItWorks} />
          <Route path="/rapid-services" component={RapidServices} />
          <Route path="/about" component={About} />
          <Route path="/safety" component={Safety} />
          <Route path="/support" component={Support} />
          <Route path="/dashboard/patient" component={PatientDashboard} />
          <Route path="/dashboard/provider" component={ProviderDashboard} />
          <Route path="/dashboard/admin" component={AdminDashboard} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/booking-success" component={BookingSuccess} />
          <Route path="/messages" component={Messages} />
          <Route path="/provider/verification" component={ProviderVerification} />
          <Route path="/admin-data" component={AdminData} />
          <Route path="/admin-portal" component={AdminPortal} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ScrollToTop />
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
