import { useEffect } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SubscribeSuccess() {
  useEffect(() => {
    document.title = "Subscription Active — MedLink Marketplace";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="px-4 py-16">
        <div className="mx-auto max-w-xl">
          <Card className="shadow-sm">
            <CardContent className="p-10 text-center space-y-6">
              <h1 className="text-3xl font-bold text-gray-900">
                You&apos;re all set! Your MedLink subscription is active.
              </h1>
              <Link href="/providers">
                <Button className="bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)]">
                  Find a Provider
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
