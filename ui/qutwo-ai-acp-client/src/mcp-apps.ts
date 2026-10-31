import { RESOURCE_MIME_TYPE } from "@modelcontextprotocol/ext-apps/app-bridge";
import type {
  McpUiAppResourceConfig,
  McpUiAppToolConfig,
} from "@modelcontextprotocol/ext-apps/server";
import type {
  BlobResourceContents,
  ReadResourceResult,
  TextResourceContents,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";

export const QUTWO_AI_MCP_UI_EXTENSION_ID = "io.modelcontextprotocol/ui" as const;

export interface QutwoAiMcpUiExtensionSettings {
  mimeTypes: string[];
}

export interface QutwoAiMcpHostCapabilities {
  extensions: Record<string, QutwoAiMcpUiExtensionSettings>;
}

export type QutwoAiToolUiMetadata = Extract<
  McpUiAppToolConfig["_meta"],
  { ui: unknown }
>["ui"];

export type QutwoAiToolMetadata = NonNullable<Tool["_meta"]> & {
  ui?: QutwoAiToolUiMetadata;
  qutwo_ai_extension?: string;
};

export type QutwoAiSessionTool = Tool & {
  meta?: QutwoAiToolMetadata;
  _meta?: QutwoAiToolMetadata;
};

export type QutwoAiTextResourceContents = TextResourceContents;

export type QutwoAiBlobResourceContents = BlobResourceContents;

export type QutwoAiResourceContents = TextResourceContents | BlobResourceContents;

export type QutwoAiReadResourceResult = ReadResourceResult;

export type QutwoAiResourceMetadata = NonNullable<
  Extract<NonNullable<McpUiAppResourceConfig["_meta"]>, { ui?: unknown }>["ui"]
>;

export interface QutwoAiMcpAppToolPayload {
  toolName: string;
  extensionName: string;
  resourceUri: string;
  toolMeta?: QutwoAiToolMetadata;
  resourceResult?: QutwoAiReadResourceResult | null;
  readError?: string;
}

export interface QutwoAiToolCallUpdateMeta {
  qutwo_ai?: {
    mcpApp?: QutwoAiMcpAppToolPayload;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export const DEFAULT_QUTWO_AI_MCP_HOST_CAPABILITIES: QutwoAiMcpHostCapabilities = {
  extensions: {
    [QUTWO_AI_MCP_UI_EXTENSION_ID]: {
      mimeTypes: [RESOURCE_MIME_TYPE],
    },
  },
};
