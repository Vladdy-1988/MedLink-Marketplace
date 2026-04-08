import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  useEffect(() => {
    document.title = "Page Not Found — MedLink Marketplace";
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            The page you&apos;re looking for doesn&apos;t exist or may have moved.
          </p>
          <Link href="/">
            <Button className="mt-6 w-full">Return Home</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
