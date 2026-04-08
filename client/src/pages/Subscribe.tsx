import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Subscribe() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "Subscribe — MedLink Marketplace";
  }, []);

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/subscriptions/create-checkout", {
        method: "POST",
        credentials: "include",
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Failed to start checkout");
      }
      window.location.href = data.url;
    } catch (error) {
      console.error("Subscription checkout error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="px-4 py-16">
        <div className="mx-auto max-w-xl">
          <Card className="shadow-sm">
            <CardHeader className="text-center space-y-3">
              <CardTitle className="text-3xl font-bold text-gray-900">
                MedLink Patient Access
              </CardTitle>
              <p className="text-gray-600">
                Book in-home healthcare visits across Calgary
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-xl border bg-white p-6 text-center space-y-4">
                <div className="text-4xl font-bold text-gray-900">$14.99</div>
                <div className="text-sm font-medium uppercase tracking-wide text-gray-500">
                  / month CAD
                </div>
                <ul className="space-y-3 text-sm text-gray-700 text-left">
                  <li>Access to all healthcare disciplines</li>
                  <li>In-home visits across Calgary</li>
                  <li>Secure messaging with providers</li>
                  <li>Insurance billing support</li>
                  <li>Cancel anytime</li>
                </ul>
              </div>

              <Button
                className="w-full bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)]"
                onClick={handleSubscribe}
                disabled={isLoading}
              >
                {isLoading ? "Redirecting..." : "Subscribe Now"}
              </Button>

              <p className="text-center text-sm text-gray-500">
                Secure payment via Stripe · Cancel anytime
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
