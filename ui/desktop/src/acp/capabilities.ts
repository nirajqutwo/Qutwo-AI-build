import type { InitializeResponse } from '@agentclientprotocol/sdk';
import { getAcpInitializeResponse } from './acpConnection';

export interface AcpFeatureCapabilities {
  localInference: boolean;
  recipeParameterScopes: boolean;
}

export async function getAcpFeatureCapabilities(): Promise<AcpFeatureCapabilities> {
  const initializeResponse = await getAcpInitializeResponse();

  return {
    localInference: hasLocalInferenceCapability(initializeResponse),
    recipeParameterScopes: hasRecipeParameterScopesCapability(initializeResponse),
  };
}

export function hasLocalInferenceCapability(
  initializeResponse: Pick<InitializeResponse, 'agentCapabilities'>
): boolean {
  const agentCapabilities = initializeResponse.agentCapabilities;
  if (!agentCapabilities) {
    return false;
  }

  const meta = agentCapabilities._meta;
  if (!isRecord(meta)) {
    return false;
  }

  const qutwo_ai = meta.qutwo_ai;
  if (!isRecord(qutwo_ai)) {
    return false;
  }

  return 'localInference' in qutwo_ai;
}

export function hasRecipeParameterScopesCapability(
  initializeResponse: Pick<InitializeResponse, 'agentCapabilities'>
): boolean {
  const agentCapabilities = initializeResponse.agentCapabilities;
  if (!agentCapabilities) {
    return false;
  }

  const meta = agentCapabilities._meta;
  if (!isRecord(meta)) {
    return false;
  }

  const qutwo_ai = meta.qutwo_ai;
  if (!isRecord(qutwo_ai)) {
    return false;
  }

  return 'recipeParameterScopes' in qutwo_ai;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
