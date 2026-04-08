import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface SubscriptionGateProps {
  children: ReactNode;
}

export function SubscriptionGate({ children }: SubscriptionGateProps) {
  const { user } = useAuth();
  const { data: subStatus, isLoading } = useQuery({
    queryKey: ["subscription-status"],
    queryFn: () =>
      fetch("/api/subscriptions/status", { credentials: "include" }).then((r) =>
        r.json(),
      ),
    enabled: !!user && user.userType === "patient",
  });

  if (!user || user.userType !== "patient") {
    return <>{children}</>;
  }
  if (isLoading) {
    return <>{children}</>;
  }
  if (subStatus?.isActive) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 p-8 text-center">
      <h2 className="text-xl font-semibold">Subscription required</h2>
      <p className="text-muted-foreground max-w-sm">
        A MedLink subscription gives you access to book in-home healthcare
        visits across Calgary.
      </p>
      <Button onClick={() => (window.location.href = "/subscribe")}>
        View Plans — $14.99/month
      </Button>
    </div>
  );
}
