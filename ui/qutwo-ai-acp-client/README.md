# @aaif/qutwo-ai-acp-client

TypeScript client library for communicating with Qutwo-AI over an existing Agent
Client Protocol (ACP) transport.

This package provides:

- TypeScript types and Zod validators for Qutwo-AI ACP extension methods
- `QutwoAiExtClient` for calling Qutwo-AI extension methods
- Client capability definitions and MCP Apps helpers

It does not install, resolve, or start the Qutwo-AI executable. Applications own
the transport and process lifecycle.

## Installation

```bash
npm install @aaif/qutwo-ai-acp-client @agentclientprotocol/sdk
```

## Usage

Compose the Qutwo-AI extension client with the standard ACP SDK:

```typescript
import {
  client as createAcpClient,
  methods,
  PROTOCOL_VERSION,
  type Stream,
} from "@agentclientprotocol/sdk";
import { QutwoAiExtClient } from "@aaif/qutwo-ai-acp-client";

async function connectToQutwoAi(stream: Stream) {
  const app = createAcpClient({ name: "my-product" });
  const connection = app.connect(stream);
  const qutwo-ai = new QutwoAiExtClient(connection.agent);

  await connection.agent.request(methods.agent.initialize, {
    protocolVersion: PROTOCOL_VERSION,
    clientInfo: {
      name: "my-product",
      version: "1.0.0",
    },
    clientCapabilities: {},
  });

  return { connection, qutwo-ai };
}
```

The application creates and owns the `stream`, including its connection and
process lifecycle. Call `connection.close()` when the application no longer
needs the connection.

## Development

From `ui/qutwo-ai-acp-client`:

```bash
pnpm run build
```

The generated TypeScript types come from the Rust schemas in `crates/qutwo-ai`.
