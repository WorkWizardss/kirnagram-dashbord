export interface Agent {
  id: string;
  username: string;
  password: string;
  permissions: {
    prompts: boolean;
    ads: boolean;
    currency: boolean;
    // Optionally add aiCreatorRequests if needed
  };
  createdAt: Date;
  isActive: boolean;
}
export interface AgentPermissions {
  prompts: boolean;
  ads: boolean;
  currency: boolean;
  aiCreatorRequests: boolean;
  username: string;
  password: string;
  permissions: AgentPermissions;
  createdAt: Date;
  isActive: boolean;
}
