import { useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";

export default function ConnectRefresh() {
  useEffect(() => {
    apiRequest("POST", "/api/connect/onboard")
      .then((r) => r.json())
      .then(({ url }) => { if (url) window.location.href = url; })
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600">Resuming Stripe onboarding…</p>
    </div>
  );
}
