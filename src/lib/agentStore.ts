import type { Agent } from "@/types/agent";

const STORAGE_KEY = "kg_admin_agents";

const parseAgents = (raw: string | null, fallback: Agent[]) => {
  if (!raw) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(raw) as Array<Omit<Agent, "createdAt"> & { createdAt: string }>;
    return parsed.map((agent) => ({
      ...agent,
      createdAt: new Date(agent.createdAt),
    }));
  } catch {
    return fallback;
  }
};

export const loadAgents = (fallback: Agent[]) => parseAgents(localStorage.getItem(STORAGE_KEY), fallback);

export const saveAgents = (agents: Agent[]) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      agents.map((agent) => ({
        ...agent,
        createdAt: agent.createdAt.toISOString(),
      })),
    ),
  );
};
