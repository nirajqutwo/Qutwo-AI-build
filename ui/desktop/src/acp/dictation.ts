import type {
  DictationDownloadProgress,
  DictationLocalModelStatus,
  DictationProviderStatusEntry,
} from '@aaif/qutwo-ai-acp-client';
import { getAcpClient } from './acpConnection';

export type { DictationProviderStatusEntry };

export type DictationProviders = Record<string, DictationProviderStatusEntry>;
export type LocalDictationModel = DictationLocalModelStatus;
export type LocalDictationDownloadProgress = DictationDownloadProgress;

export async function getDictationConfig(): Promise<DictationProviders> {
  const client = await getAcpClient();
  const response = await client.qutwo_ai.dictationConfig_unstable({});
  return response.providers ?? {};
}

export async function transcribeDictation(
  audio: string,
  mimeType: string,
  provider: string
): Promise<string> {
  const client = await getAcpClient();
  const response = await client.qutwo_ai.dictationTranscribe_unstable({ audio, mimeType, provider });
  return response.text;
}

export async function listLocalDictationModels(): Promise<LocalDictationModel[]> {
  const client = await getAcpClient();
  const response = await client.qutwo_ai.dictationModelsList_unstable({});
  return response.models;
}

export async function downloadLocalDictationModel(modelId: string): Promise<void> {
  const client = await getAcpClient();
  await client.qutwo_ai.dictationModelsDownload_unstable({ modelId });
}

export async function getLocalDictationModelDownloadProgress(
  modelId: string
): Promise<LocalDictationDownloadProgress | null> {
  const client = await getAcpClient();
  const response = await client.qutwo_ai.dictationModelsDownloadProgress_unstable({ modelId });
  return response.progress ?? null;
}

export async function cancelLocalDictationModelDownload(modelId: string): Promise<void> {
  const client = await getAcpClient();
  await client.qutwo_ai.dictationModelsCancel_unstable({ modelId });
}

export async function deleteLocalDictationModel(modelId: string): Promise<void> {
  const client = await getAcpClient();
  await client.qutwo_ai.dictationModelsDelete_unstable({ modelId });
}
