import { AdminLayout } from "@/components/admin/AdminLayout";
import { Coins } from "lucide-react";

const Currency = () => {
  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Currency
          </h1>
          <p className="text-muted-foreground">
            Manage virtual currency and transactions.
          </p>
        </div>
        
        <div className="glass-card rounded-xl p-12 flex flex-col items-center justify-center text-center">
          <Coins className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-display font-semibold text-foreground mb-2">
            Currency Management
          </h2>
          <p className="text-muted-foreground max-w-md">
            This section will contain currency exchange rates, transaction history, and wallet management.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Currency;
