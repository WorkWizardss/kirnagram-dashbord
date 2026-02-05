export type PromptStatus = "pending" | "approved" | "rejected" | "modify";

export interface PromptRequest {
  id: string;
  unitId?: string | null;
  userId: string;
  creatorName: string;
  creatorUsername?: string;
  creatorEmail?: string;
  creatorMobile?: string;
  creatorDob?: string;
  title: string;
  promptDescription: string;
  aiModel?: string;
  tags: string[];
  submittedAt: Date;
  status: PromptStatus;
  reason?: string;
  previewImage?: string;
  likesCount?: number;
  viewsCount?: number;
  commentsCount?: number;
  remixesCount?: number;
}
