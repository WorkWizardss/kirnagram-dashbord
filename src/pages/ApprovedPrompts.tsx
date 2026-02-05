import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PromptRequestList } from "@/components/admin/PromptRequestList";
import { PromptPreview } from "@/components/admin/PromptPreview";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { PromptRequest } from "@/types/prompt";

const ApprovedPrompts = () => {
  const [requests, setRequests] = useState<PromptRequest[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = "http://localhost:8000/admin/ai-creator/prompts";

  const selectedRequest = requests.find((r) => r.id === selectedId) || null;

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_URL}?status=approved`);
        if (!res.ok) throw new Error("Failed to fetch prompts");
        const data = await res.json();
        const mapped: PromptRequest[] = (Array.isArray(data) ? data : []).map((p: any) => ({
          id: p._id,
          unitId: p.unit_id,
          userId: p.user_id,
          creatorName: p.creator_contact?.full_name || p.user?.full_name || p.user?.username || "Creator",
          creatorUsername: p.user?.username,
          creatorEmail: p.creator_contact?.email,
          creatorMobile: p.creator_contact?.mobile,
          creatorDob: p.creator_contact?.dob,
          title: p.style_name,
          promptDescription: p.prompt_description || "",
          aiModel: p.ai_model,
          tags: p.tags || [],
          submittedAt: p.created_at ? new Date(p.created_at) : new Date(),
          status: p.status,
          reason: p.reason,
          previewImage: p.image_url,
          likesCount: Array.isArray(p.likes) ? p.likes.length : p.likes_count || 0,
          viewsCount: Array.isArray(p.views) ? p.views.length : p.views_count || 0,
          commentsCount: Array.isArray(p.comments) ? p.comments.length : p.comments_count || 0,
          remixesCount: Array.isArray(p.remixes) ? p.remixes.length : p.remixes_count || 0,
        }));
        setRequests(mapped);
      } catch (e: any) {
        setError(e.message || "Failed to load prompts");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  return (
    <AdminLayout>
      <div className="h-[calc(100vh-0px)] flex flex-col">
        <div className="p-6 border-b border-border shrink-0">
          <h1 className="text-2xl font-display font-bold text-foreground">Approved Prompts</h1>
          <p className="text-sm text-muted-foreground">
            All approved prompts with stats and creator details.
          </p>
        </div>

        <div className="flex-1 min-h-0">
          {loading && (
            <div className="p-6 text-sm text-muted-foreground">Loading prompts...</div>
          )}
          {error && !loading && (
            <div className="p-6 text-sm text-red-500">{error}</div>
          )}
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
              <PromptRequestList
                requests={requests}
                selectedId={selectedId}
                onSelect={setSelectedId}
                subtitle={`${requests.length} approved`}
              />
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize={75}>
              <PromptPreview
                request={selectedRequest}
                onAccept={() => undefined}
                onReject={() => undefined}
                onModify={() => undefined}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ApprovedPrompts;
