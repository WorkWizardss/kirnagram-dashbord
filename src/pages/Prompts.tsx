import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PromptRequestList } from "@/components/admin/PromptRequestList";
import { PromptPreview } from "@/components/admin/PromptPreview";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { PromptRequest } from "@/types/prompt";
import { toast } from "sonner";

const Prompts = () => {
  const [requests, setRequests] = useState<PromptRequest[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedRequest = requests.find((r) => r.id === selectedId) || null;

  const handleAccept = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "approved" as const } : r))
    );
    toast.success("Prompt accepted and published live!");
  };

  const handleReject = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "rejected" as const } : r))
    );
    toast.error("Prompt has been rejected.");
  };

  const handleModify = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "needs_modification" as const } : r))
    );
    toast.info("Modification request sent to creator.");
  };

  return (
    <AdminLayout>
      <div className="h-[calc(100vh-0px)] flex flex-col">
        <div className="p-6 border-b border-border shrink-0">
          <h1 className="text-2xl font-display font-bold text-foreground">Prompts</h1>
          <p className="text-sm text-muted-foreground">
            Review and manage creator prompt submissions.
          </p>
        </div>

        <div className="flex-1 min-h-0">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
              <PromptRequestList
                requests={requests}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize={75}>
              <PromptPreview
                request={selectedRequest}
                onAccept={handleAccept}
                onReject={handleReject}
                onModify={handleModify}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Prompts;
