import type { ToolCall, ToolCallUpdate } from '@agentclientprotocol/sdk';
import type { TokenState } from '../../types/chat';
import type { InferenceMetadata, Message, NotificationEvent } from '../../types/message';

export type AcpChatStateChange =
  | { type: 'messages'; messages: Message[] }
  | { type: 'tokenState'; tokenState: Partial<TokenState> }
  | { type: 'progressMessage'; message: string | undefined }
  | {
      type: 'sessionInfo';
      name?: string;
      activeRunId?: string | null;
      qutwoAiMode?: string;
    }
  | { type: 'localSteerConfirmed'; messageId: string }
  | { type: 'notification'; notification: NotificationEvent };

export interface AdapterState {
  messages: Message[];
  localSteerTextByMessageId: Map<string, string>;
  toolCallStatesById: Map<string, ToolCallState>;
}

export type ToolCallState = Omit<ToolCallUpdate, '_meta'>;

export interface QutwoAiMessageMeta {
  messageId?: string;
  created?: number;
  outputTokenLimitReached?: boolean;
  fallbackContent?: boolean;
  operationLogs?: string[];
  steer?: boolean;
  inference?: InferenceMetadata;
}

export interface ToolIdentity {
  toolName?: string;
  extensionName?: string;
}

export const DEFAULT_VISIBLE_MESSAGE_METADATA: Message['metadata'] = {
  userVisible: true,
  agentVisible: true,
};

export function messagesChange(state: AdapterState): AcpChatStateChange[] {
  // Pass the live array by reference: the store is the only consumer and it
  // clones on write (applyChatStateChanges). Cloning here as well made every
  // streamed chunk O(messages) twice, which turns session-load replay into
  // O(n^2) on large sessions.
  return [{ type: 'messages', messages: state.messages }];
}

export function cloneMessage(message: Message): Message {
  return {
    ...message,
    content: message.content.map((content) => ({ ...content })),
    metadata: { ...message.metadata },
  };
}

export function getQutwoAiMessageMeta(update: { _meta?: unknown }): QutwoAiMessageMeta {
  if (!isRecord(update._meta)) {
    return {};
  }

  const qutwo_ai = update._meta.qutwo_ai;
  if (!isRecord(qutwo_ai)) {
    return {};
  }

  const outputTokenLimitReached = qutwo_ai.outputTokenLimitReached === true;
  const operationLogs = Array.isArray(qutwo_ai.operationLogs)
    ? qutwo_ai.operationLogs.filter((line): line is string => typeof line === 'string')
    : undefined;

  return {
    created: typeof qutwo_ai.created === 'number' ? qutwo_ai.created : undefined,
    messageId: typeof qutwo_ai.messageId === 'string' ? qutwo_ai.messageId : undefined,
    outputTokenLimitReached: outputTokenLimitReached ? true : undefined,
    fallbackContent: qutwo_ai.fallbackContent === true ? true : undefined,
    operationLogs,
    steer: qutwo_ai.steer === true ? true : undefined,
    inference: getInferenceMeta(qutwo_ai.inference),
  };
}

function getInferenceMeta(inference: unknown): InferenceMetadata | undefined {
  if (
    !isRecord(inference) ||
    typeof inference.provider !== 'string' ||
    typeof inference.requestedModel !== 'string'
  ) {
    return undefined;
  }

  return {
    provider: inference.provider,
    requestedModel: inference.requestedModel,
    ...(typeof inference.resolvedModel === 'string'
      ? { resolvedModel: inference.resolvedModel }
      : {}),
  };
}

export function applyInferenceMeta(message: Message, qutwoAiMeta: QutwoAiMessageMeta): void {
  if (message.role === 'assistant' && qutwoAiMeta.inference) {
    message.metadata.inference = qutwoAiMeta.inference;
  }
}

export function getQutwoAiActiveRunId(update: { _meta?: unknown }): string | null | undefined {
  if (!isRecord(update._meta)) {
    return undefined;
  }

  const qutwo_ai = update._meta.qutwo_ai;
  if (!isRecord(qutwo_ai) || !('activeRunId' in qutwo_ai)) {
    return undefined;
  }

  return typeof qutwo_ai.activeRunId === 'string' || qutwo_ai.activeRunId === null
    ? qutwo_ai.activeRunId
    : undefined;
}

export function getQutwoAiQueuedSteer(update: { _meta?: unknown }): string | undefined {
  if (!isRecord(update._meta)) return undefined;
  const qutwo_ai = update._meta.qutwo_ai;
  if (!isRecord(qutwo_ai) || !isRecord(qutwo_ai.queuedSteer)) return undefined;
  return typeof qutwo_ai.queuedSteer.messageId === 'string' ? qutwo_ai.queuedSteer.messageId : undefined;
}

export function rawInputToArguments(rawInput: unknown): Record<string, unknown> {
  return isRecord(rawInput) ? rawInput : {};
}

export function toolIdentity(update: ToolCall | ToolCallUpdate): ToolIdentity {
  if (!isRecord(update._meta)) {
    return {};
  }

  const qutwo_ai = update._meta.qutwo_ai;
  if (!isRecord(qutwo_ai) || !isRecord(qutwo_ai.toolCall)) {
    return {};
  }

  return {
    toolName: typeof qutwo_ai.toolCall.toolName === 'string' ? qutwo_ai.toolCall.toolName : undefined,
    extensionName:
      typeof qutwo_ai.toolCall.extensionName === 'string' ? qutwo_ai.toolCall.extensionName : undefined,
  };
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
