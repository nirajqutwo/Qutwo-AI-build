---
title: Set up qutwo-ai in Zed
sidebar_position: 10
displayed_sidebar: tutorialSidebar
description: See how Zed installs and configures qutwo-ai as an ACP agent.
---

# Set up qutwo-ai in Zed

Zed can run qutwo-ai as an ACP agent. Install qutwo-ai from the ACP Registry for the
simplest setup, or configure it manually to use your own qutwo-ai binary and
environment overrides.

## Install qutwo-ai from the ACP Registry

Zed has built-in ACP Registry support, so it can download and run qutwo-ai for you
without manual configuration.

1. Open Zed
2. Open Agent Settings
3. Click `Add Agent`, then choose `Install from Registry`
4. Select `qutwo-ai`

A registry-installed qutwo-ai runs the same `qutwo-ai acp` server and reads your
existing qutwo-ai configuration, so your providers, models, and extensions carry
over. Zed keeps the installed version up to date for you.

## Configure qutwo-ai manually

Use a custom agent if you want to run your own qutwo-ai binary, such as a local
development build, or pass environment overrides.

### Prerequisites

Ensure you have both Zed and the qutwo-ai CLI installed:

- **Zed**: Download from [zed.dev](https://zed.dev/)
- **qutwo-ai CLI**: Follow the [installation guide](/docs/getting-started/installation)

Verify qutwo-ai is installed:

```bash
qutwo-ai --version
```

### Add qutwo-ai to your Zed settings

1. Open Zed
2. Open Agent Settings, click `Add Agent`, then choose `Add Custom Agent`. Zed
   scaffolds an `agent_servers` entry and opens your settings file
3. Edit the entry so it runs qutwo-ai:

```json
{
  "agent_servers": {
    "qutwo-ai": {
      "type": "custom",
      "command": "qutwo-ai",
      "args": ["acp"]
    }
  }
}
```

You can now interact with qutwo-ai directly in Zed. ACP sessions use the extensions
enabled in your qutwo-ai configuration, so their tools are also available in Zed.

## Override the provider and model

By default, qutwo-ai uses the provider and model defined in your
[configuration file](/docs/guides/config-files). Override them for a specific
agent configuration with the `QUTWO_AI_PROVIDER` and `QUTWO_AI_MODEL` environment
variables.

This example configures two qutwo-ai agents with different model settings:

```json
{
  "agent_servers": {
    "qutwo-ai": {
      "type": "custom",
      "command": "qutwo-ai",
      "args": ["acp"]
    },
    "qutwo-ai (GPT-4o)": {
      "type": "custom",
      "command": "qutwo-ai",
      "args": ["acp"],
      "env": {
        "QUTWO_AI_PROVIDER": "openai",
        "QUTWO_AI_MODEL": "gpt-4o"
      }
    }
  }
}
```

## Use Zed MCP servers with qutwo-ai

MCP servers in Zed's `context_servers` configuration are automatically
available to qutwo-ai. This lets native Zed features and the qutwo-ai agent use the
same MCP servers.

```json
{
  "context_servers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/path/to/allowed/dir"
      ]
    }
  },
  "agent_servers": {
    "qutwo-ai": {
      "type": "custom",
      "command": "qutwo-ai",
      "args": ["acp"]
    }
  }
}
```

All MCP servers in `context_servers` are available to qutwo-ai when they use stdio
(command-based) or HTTP transports. qutwo-ai does not support servers using the
deprecated SSE transport.

If a server in `context_servers` has the same name as a qutwo-ai extension, qutwo-ai
uses its own [configuration](/docs/guides/config-files).
