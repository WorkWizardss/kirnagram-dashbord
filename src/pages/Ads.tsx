import { AdminLayout } from "@/components/admin/AdminLayout";
import { Megaphone } from "lucide-react";

const Ads = () => {
  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Ads
          </h1>
          <p className="text-muted-foreground">
            Manage advertising campaigns and analytics.
          </p>
        </div>
        
        <div className="glass-card rounded-xl p-12 flex flex-col items-center justify-center text-center">
          <Megaphone className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-display font-semibold text-foreground mb-2">
            Ads Management
          </h2>
          <p className="text-muted-foreground max-w-md">
            This section will contain ad campaigns, targeting options, and performance metrics.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Ads;
