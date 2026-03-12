const API_BASE = "http://127.0.0.1:8000";

export type PublisherApplicationStatus = "pending" | "approved" | "rejected";

export type PublisherApplication = {
  _id: string;
  user_id: string;
  status: PublisherApplicationStatus;
  created_at?: string | null;
  updated_at?: string | null;
  reviewed_at?: string | null;
  admin_note?: string | null;
  user: {
    firebase_uid?: string;
    username?: string;
    full_name?: string;
    email?: string;
    mobile?: string;
    image_name?: string;
  };
  application: {
    full_name?: string;
    business_name?: string;
    business_type?: string;
    target_audience?: string;
  };
};

export const fetchPublisherApplications = async (
  status: "all" | PublisherApplicationStatus = "all",
): Promise<PublisherApplication[]> => {
  const res = await fetch(`${API_BASE}/admin/ads/publisher-applications?status=${status}`);
  if (!res.ok) throw new Error("Failed to fetch publisher applications");
  return res.json();
};

export const updatePublisherApplicationStatus = async (
  applicationId: string,
  status: "approved" | "rejected",
  adminNote?: string,
): Promise<{ success: boolean; application_id: string; status: PublisherApplicationStatus }> => {
  const res = await fetch(`${API_BASE}/admin/ads/publisher-applications/${applicationId}/status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, admin_note: adminNote || null }),
  });

  if (!res.ok) throw new Error("Failed to update application status");
  return res.json();
};
