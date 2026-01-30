import type { Agent } from "@/types/agent";
import { loadAgents } from "./agentStore";

const AGENT_AUTH_STORAGE_KEY = "kg_agent_authed";
const AGENT_ID_STORAGE_KEY = "kg_agent_id";

export interface AgentAuthInfo {
  id: string;
  username: string;
  permissions: {
    prompts: boolean;
    ads: boolean;
    currency: boolean;
  };
}

export const isAgentAuthenticated = () => localStorage.getItem(AGENT_AUTH_STORAGE_KEY) === "true";

export const getAuthenticatedAgent = (): AgentAuthInfo | null => {
  if (!isAgentAuthenticated()) {
    return null;
  }
  const agentId = localStorage.getItem(AGENT_ID_STORAGE_KEY);
  if (!agentId) {
    return null;
  }
  const agents = loadAgents([]);
  const agent = agents.find((a) => a.id === agentId);
  if (!agent) {
    return null;
  }
  return {
    id: agent.id,
    username: agent.username,
    permissions: agent.permissions,
  };
};

export const setAgentAuthenticated = (agentId: string) => {
  localStorage.setItem(AGENT_AUTH_STORAGE_KEY, "true");
  localStorage.setItem(AGENT_ID_STORAGE_KEY, agentId);
};

export const clearAgentAuthenticated = () => {
  localStorage.removeItem(AGENT_AUTH_STORAGE_KEY);
  localStorage.removeItem(AGENT_ID_STORAGE_KEY);
};

export const validateAgentCredentials = (username: string, password: string): Agent | null => {
  const agents = loadAgents([]);
  const agent = agents.find(
    (a) => a.username.toLowerCase() === username.toLowerCase() && a.password === password && a.isActive,
  );
  return agent || null;
};
