import {
  client,
  methods,
  type Client,
  type ClientConnection,
  type Stream,
} from '@agentclientprotocol/sdk';
import {
  QUTWO_AI_EXT_AGENT_REQUESTS,
  QUTWO_AI_EXT_NOTIFICATIONS,
  QutwoAiExtClient,
  type QutwoAiSessionNotification_unstable,
  type ProviderDeviceCodeNotification_unstable,
  type RecipeParamsResponse_unstable,
  type RequestRecipeParams_unstable,
  zQutwoAiSessionNotification_unstable,
  zProviderDeviceCodeNotification_unstable,
  zRequestRecipeParams_unstable,
} from '@aaif/qutwo-ai-acp-client';

const [qutwoAiSessionUpdate, providerDeviceCode] = QUTWO_AI_EXT_NOTIFICATIONS;
const [qutwoAiRecipeParamsRequest] = QUTWO_AI_EXT_AGENT_REQUESTS;

export type QutwoAiAcpCallbacks = Required<
  Pick<Client, 'requestPermission' | 'sessionUpdate' | 'createElicitation'>
> & {
  unstable_sessionRecipeRequestParams: (
    request: RequestRecipeParams_unstable
  ) => Promise<RecipeParamsResponse_unstable>;
  unstable_sessionUpdate: (notification: QutwoAiSessionNotification_unstable) => Promise<void>;
  unstable_providerDeviceCode: (
    notification: ProviderDeviceCodeNotification_unstable
  ) => Promise<void>;
};

export type QutwoAiAcpClient = {
  connection: ClientConnection;
  qutwo_ai: QutwoAiExtClient;
};

export function connectQutwoAiAcpClient(
  stream: Stream,
  callbacks: QutwoAiAcpCallbacks
): QutwoAiAcpClient {
  const app = client({ name: 'qutwo-ai' })
    .onRequest(methods.client.session.requestPermission, (context) =>
      callbacks.requestPermission(context.params)
    )
    .onNotification(methods.client.session.update, (context) =>
      callbacks.sessionUpdate(context.params)
    )
    .onRequest(methods.client.elicitation.create, (context) =>
      callbacks.createElicitation(context.params)
    )
    .onRequest(qutwoAiRecipeParamsRequest.method, zRequestRecipeParams_unstable, (context) =>
      callbacks.unstable_sessionRecipeRequestParams(context.params)
    )
    .onNotification(qutwoAiSessionUpdate.method, zQutwoAiSessionNotification_unstable, (context) =>
      callbacks.unstable_sessionUpdate(context.params)
    )
    .onNotification(
      providerDeviceCode.method,
      zProviderDeviceCodeNotification_unstable,
      (context) => callbacks.unstable_providerDeviceCode(context.params)
    );

  const connection = app.connect(stream);
  const qutwo_ai = new QutwoAiExtClient(connection.agent);

  return { connection, qutwo_ai };
}
