import type { QutwoAiMcpHostCapabilities } from "./mcp-apps.js";

export interface QutwoAiClientCapabilitiesMeta {
  qutwo_ai?: {
    mcpHostCapabilities?: QutwoAiMcpHostCapabilities;
    customNotifications?: boolean;
  };
}
