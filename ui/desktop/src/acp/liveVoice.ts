import type {
  LiveVoiceAvailabilityResponse_unstable,
  LiveVoiceStartResponse_unstable,
} from '@aaif/qutwo-ai-acp-client';
import { getAcpClient } from './acpConnection';

export async function acpGetLiveVoiceAvailability(
  sessionId?: string
): Promise<LiveVoiceAvailabilityResponse_unstable> {
  const { qutwo_ai } = await getAcpClient();
  return qutwo_ai.sessionLiveVoiceAvailability_unstable(sessionId ? { sessionId } : {});
}

export async function acpStartLiveVoice(
  sessionId: string,
  offerSdp: string
): Promise<LiveVoiceStartResponse_unstable> {
  const { qutwo_ai } = await getAcpClient();
  return qutwo_ai.sessionLiveVoiceStart_unstable({
    sessionId,
    offerSdp,
  });
}

export async function acpStopLiveVoice(sessionId: string, interactionId: string): Promise<void> {
  const { qutwo_ai } = await getAcpClient();
  await qutwo_ai.sessionLiveVoiceStop_unstable({ sessionId, interactionId });
}
