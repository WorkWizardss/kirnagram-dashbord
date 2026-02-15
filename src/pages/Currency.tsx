import { AdminLayout } from "@/components/admin/AdminLayout";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const API_BASE = "http://127.0.0.1:8000";

const Currency = () => {
  const { toast } = useToast();
  const [minWithdraw, setMinWithdraw] = useState(20);
  const [saving, setSaving] = useState(false);
  const [withdrawRequests, setWithdrawRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // =========================
  // FETCH CURRENT MIN VALUE
  // =========================
  const fetchSetting = async () => {
    try {
      const res = await fetch(`${API_BASE}/withdraw/min-withdraw`);

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to fetch");

      setMinWithdraw(data.minWithdrawAmount || 20);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchSetting();
  }, []);

  // Fetch all withdrawal requests and creator stats
  const fetchWithdrawRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/withdraw/requests`);
      if (res.status === 404) {
        setWithdrawRequests([]);
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to fetch requests");
      setWithdrawRequests(data);
    } catch (err: any) {
      // Only show error if not 404 (no requests is not an error)
      if (!err.message?.includes('404')) {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      }
      setWithdrawRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSetting();
    fetchWithdrawRequests();
  }, []);

  // =========================
  // UPDATE MIN WITHDRAW
  // =========================
  const handleUpdate = async () => {
    try {
      setSaving(true);

      const res = await fetch(`${API_BASE}/admin/withdraw/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          min_withdraw_amount: Number(minWithdraw),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Update failed");

      toast({
        title: "Success",
        description: "Minimum withdraw updated successfully",
      });

    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Minimum Withdraw Setting section removed as requested */}
        <div className="bg-muted/30 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Withdrawal Requests & Creator Stats</h2>
          {loading ? (
            <div>Loading...</div>
          ) : withdrawRequests.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">No withdrawal requests found.</div>
          ) : (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {withdrawRequests.map((req, i) => (
                <Card key={req._id || i}>
                  <CardHeader>
                    <CardTitle>₹{req.amount} - {req.status === "approved" ? <Badge variant="default">Approved</Badge> : req.status === "rejected" ? <Badge variant="destructive">Rejected</Badge> : <Badge variant="secondary">Pending</Badge>}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2 text-sm"><b>User ID:</b> {req.user_id}</div>
                    <div className="mb-2 text-sm"><b>UPI ID:</b> {req.upi_id}</div>
                    <div className="mb-2 text-sm"><b>Total Prompts:</b> {req.total_prompts}</div>
                    <div className="mb-2 text-sm"><b>Remixes:</b> {req.total_remixes}</div>
                    <div className="mb-2 text-sm"><b>Likes:</b> {req.total_likes}</div>
                    <div className="mb-2 text-sm"><b>Views:</b> {req.total_views}</div>
                    <div className="mb-2 text-sm"><b>Total Earned:</b> ₹{req.total_earned}</div>
                    <div className="mb-2 text-sm"><b>Total Withdrawn:</b> ₹{req.total_withdrawn}</div>
                    <div className="mb-2 text-sm font-bold"><b>Remaining:</b> ₹{req.remaining}</div>
                  </CardContent>
                  <CardFooter className="gap-2">
                    {req.status === "pending" && (
                      <>
                        <Button variant="default" onClick={() => handleApprove(req)}>Approve</Button>
                        <Button variant="destructive" onClick={() => handleReject(req)}>Reject</Button>
                      </>
                    )}
                    {req.status === "approved" && <span className="text-green-600">Approved</span>}
                    {req.status === "rejected" && <span className="text-red-600">Rejected</span>}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

// Approve handler
const handleApprove = async (req: any) => {
  // TODO: Call backend to approve, then send notification
  // You may want to move toast and fetchWithdrawRequests into props or context if needed
  // For now, this is a placeholder
  alert(`Approved withdraw for ${req.user_id}`);
};

// Reject handler
const handleReject = async (req: any) => {
  // TODO: Call backend to reject, then send notification
  alert(`Rejected withdraw for ${req.user_id}`);
};

export default Currency;
