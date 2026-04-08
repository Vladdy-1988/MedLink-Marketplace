import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function ConnectSuccess() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 text-center">
      <CheckCircle2 className="h-16 w-16 text-green-500" />
      <h1 className="text-2xl font-bold text-gray-900">Payout account connected!</h1>
      <p className="text-gray-600 max-w-sm">You will receive 80% of each booking directly to your bank account.</p>
      <Link href="/dashboard/provider">
        <Button>Go to Dashboard</Button>
      </Link>
    </div>
  );
}
