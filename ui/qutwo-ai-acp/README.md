# @aaif/qutwo-ai-acp

Install and resolve the Qutwo-AI executable through npm.

This package distributes the Qutwo-AI CLI using platform-specific optional npm
dependencies. It does not contain or depend on the Qutwo-AI ACP client.

## Installation

```bash
npm install @aaif/qutwo-ai-acp
```

The matching `@aaif/qutwo-ai-binary-*` package is installed automatically. Do not
install a platform package directly; `@aaif/qutwo-ai-acp` provides the supported
`qutwo-ai` command.

## Usage

Run the Qutwo-AI CLI installed by the package:

```bash
npx qutwo-ai acp
npx qutwo-ai serve
```

The launcher forwards arguments and standard input, output, and error streams to
the native executable. It preserves the executable's exit status and forwards
termination signals.

Resolve the executable path programmatically:

```typescript
import { resolveQutwoAiBinary } from "@aaif/qutwo-ai-acp";

const binaryPath = resolveQutwoAiBinary();
```

`resolveQutwoAiBinary()` first uses `QUTWO_AI_BINARY` when it is set. Otherwise, it
selects the package matching `process.platform` and `process.arch`. In both
cases it verifies that the executable exists and returns an absolute path.

Use the override to run a locally built or custom Qutwo-AI executable:

```bash
QUTWO_AI_BINARY=/path/to/qutwo-ai npx qutwo-ai acp
```

`QUTWO_AI_BINARY` must point directly to a native Qutwo-AI executable, not a
`node_modules/.bin/qutwo-ai` command shim.

Supported platforms:

| Operating system | Architecture |
| ---------------- | ------------ |
| macOS            | ARM64        |
| macOS            | x64          |
| Linux            | ARM64        |
| Linux            | x64          |
| Windows          | x64          |

Package managers must install optional dependencies. If optional dependencies
are disabled, the resolver reports which platform package is missing.
