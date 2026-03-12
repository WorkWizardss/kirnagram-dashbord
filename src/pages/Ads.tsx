import { AdminLayout } from "@/components/admin/AdminLayout";
import { useEffect, useMemo, useState } from "react";
import { Megaphone, Mail, Phone, User, Building2, Tag, Users } from "lucide-react";
import {
  fetchPublisherApplications,
  PublisherApplication,
  updatePublisherApplicationStatus,
} from "@/lib/adsApi";
import { Button } from "@/components/ui/button";

const Ads = () => {
  const [requests, setRequests] = useState<PublisherApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPublisherApplications("all");
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const pendingRequests = useMemo(
    () => requests.filter((r) => r.status === "pending"),
    [requests],
  );
  const reviewedRequests = useMemo(
    () => requests.filter((r) => r.status !== "pending"),
    [requests],
  );

  const handleDecision = async (id: string, status: "approved" | "rejected") => {
    try {
      setProcessingId(id);
      await updatePublisherApplicationStatus(id, status);
      await loadRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update request");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Ads
          </h1>
          <p className="text-muted-foreground">
            Review publisher applications and manage ad onboarding.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="glass-card rounded-xl p-12 flex flex-col items-center justify-center text-center">
            <Megaphone className="w-16 h-16 text-muted-foreground mb-4 animate-pulse" />
            <h2 className="text-xl font-display font-semibold text-foreground mb-2">
              Loading publisher requests...
            </h2>
          </div>
        ) : (
          <div className="space-y-8">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-display font-semibold text-foreground">
                  Pending Requests ({pendingRequests.length})
                </h2>
              </div>
              {pendingRequests.length === 0 ? (
                <div className="glass-card rounded-xl p-10 text-center text-muted-foreground">
                  No pending requests.
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {pendingRequests.map((request) => (
                    <div key={request._id} className="glass-card rounded-xl p-5 space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">User Details</p>
                        <div className="mt-2 space-y-1 text-sm">
                          <p className="flex items-center gap-2"><User className="w-4 h-4" /> {request.user.full_name || request.application.full_name || "-"}</p>
                          <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> {request.user.email || "-"}</p>
                          <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> {request.user.mobile || "-"}</p>
                          <p className="flex items-center gap-2"><User className="w-4 h-4" /> @{request.user.username || "-"}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">Application Details</p>
                        <div className="mt-2 space-y-1 text-sm">
                          <p className="flex items-center gap-2"><Building2 className="w-4 h-4" /> {request.application.business_name || "-"}</p>
                          <p className="flex items-center gap-2"><Tag className="w-4 h-4" /> {request.application.business_type || "-"}</p>
                          <p className="flex items-center gap-2"><Users className="w-4 h-4" /> {request.application.target_audience || "-"}</p>
                          <p className="text-xs text-muted-foreground pt-1">
                            Submitted: {request.created_at ? new Date(request.created_at).toLocaleString() : "-"}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleDecision(request._id, "approved")}
                          disabled={processingId === request._id}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleDecision(request._id, "rejected")}
                          disabled={processingId === request._id}
                          variant="destructive"
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-display font-semibold text-foreground">
                  Reviewed Requests ({reviewedRequests.length})
                </h2>
              </div>
              {reviewedRequests.length === 0 ? (
                <div className="glass-card rounded-xl p-10 text-center text-muted-foreground">
                  No reviewed requests yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {reviewedRequests.map((request) => (
                    <div key={request._id} className="glass-card rounded-xl p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">{request.application.business_name || request.user.full_name || "Request"}</h3>
                        <span className={request.status === "approved" ? "text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400" : "text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400"}>
                          {request.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Applicant: {request.user.full_name || request.application.full_name || "-"} ({request.user.email || "-"})
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Business Type: {request.application.business_type || "-"} | Target: {request.application.target_audience || "-"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Reviewed: {request.reviewed_at ? new Date(request.reviewed_at).toLocaleString() : "-"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Ads;
