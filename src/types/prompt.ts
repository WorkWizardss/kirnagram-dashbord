export type PromptStatus = "pending" | "approved" | "rejected" | "needs_modification";

export interface PromptRequest {
  id: string;
  title: string;
  creator: string;
  creatorAvatar?: string;
  category: string;
  content: string;
  style: string;
  tags: string[];
  submittedAt: Date;
  status: PromptStatus;
  previewImage?: string;
}
