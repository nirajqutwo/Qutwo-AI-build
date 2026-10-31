---
sidebar_position: 20
title: qutwo-ai Permission Modes
sidebar_label: qutwo-ai Permissions
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { PanelLeft } from 'lucide-react';

qutwo-ai’s permissions determine how much autonomy it has when modifying files, using extensions, and performing automated actions. By selecting a permission mode, you have full control over how qutwo-ai interacts with your development environment.

<details>
  <summary>Permission Modes Video Walkthrough</summary>
  <iframe
  class="aspect-ratio"
  src="https://www.youtube.com/embed/bMVFFnPS_Uk"
  title="qutwo-ai Permission Modes Explained"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
  ></iframe>
</details>

## Permission Modes

| Mode | Description | Best For |
|------|-------------|----------|
| **Completely Autonomous** | qutwo-ai can modify files, use extensions, and delete files **without requiring approval** | Users who want **full automation** and seamless integration into their workflow |
| **Manual Approval** | qutwo-ai **asks for confirmation** before using any tools or extensions (supports granular [tool permissions](/docs/guides/managing-tools/tool-permissions)) | Users who want to **review and approve** every change and tool usage |
| **Smart Approval** | qutwo-ai uses a risk-based approach to **automatically approve low-risk actions** and **flag others** for approval (supports granular [tool permissions](/docs/guides/managing-tools/tool-permissions))  | Users who want a **balanced mix of autonomy and oversight** based on the action’s impact |
| **Chat Only** | qutwo-ai **only engages in chat**, with no extension use or file modifications | Users who prefer a **conversational AI experience** for analysis, writing, and reasoning tasks without automation |

:::warning
`Autonomous Mode` is applied by default.
:::

## Configuring qutwo-ai mode

Here's how to configure:

<Tabs groupId="interface">
  <TabItem value="ui" label="qutwo-ai Desktop" default>

    Each session has its own permission mode. Use Settings to choose the default mode for new sessions. Existing sessions keep their current mode when you change this default.

    1. Click the <PanelLeft className="inline" size={16} /> button on the top-left to open the sidebar.
    2. Click the `Settings` button on the sidebar.
    3. Click `Chat`.
    4. Under `Default Mode`, choose the mode you'd like.
  </TabItem>
  <TabItem value="cli" label="qutwo-ai CLI">

    <Tabs groupId="method">
      <TabItem value="session" label="In Session" default>
        To change modes mid-session, use the `/mode` command.

        * Autonomous: `/mode auto`
        * Smart Approve: `/mode smart_approve`
        * Approve: `/mode approve`
        * Chat: `/mode chat`     
      </TabItem>
      <TabItem value="settings" label="From Settings">
        1. Run the following command:

        ```sh
        qutwo-ai configure
        ```

        2. Select `qutwo-ai settings` from the menu and press Enter.

        ```sh
        ┌ qutwo-ai-configure
        │
        ◆ What would you like to configure?
        | ○ Configure Providers
        | ○ Add Extension
        | ○ Toggle Extensions
        | ○ Remove Extension
        // highlight-start
        | ● qutwo-ai settings (Set the qutwo-ai mode, Tool Output, Tool Permissions, Experiment, qutwo-ai recipe github repo and more)
        // highlight-end
        └
        ```

        3. Choose `qutwo-ai mode` from the menu and press Enter.

        ```sh
        ┌   qutwo-ai-configure
        │
        ◇  What would you like to configure?
        │  qutwo-ai settings 
        │
        ◆  What setting would you like to configure?
        // highlight-start
        │  ● qutwo-ai mode (Configure qutwo-ai mode)
        // highlight-end
        │  ○ Router Tool Selection Strategy 
        │  ○ Tool Permission 
        │  ○ Tool Output 
        │  ○ Max Turns 
        │  ○ Toggle Experiment 
        │  ○ qutwo-ai recipe github repo 
        │  ○ Scheduler Type 
        └
        ```

        4.  Choose the qutwo-ai mode you would like to configure.

        ```sh
        ┌   qutwo-ai-configure
        │
        ◇  What would you like to configure?
        │  qutwo-ai settings
        │
        ◇  What setting would you like to configure?
        │  qutwo-ai mode
        │
        ◆  Which qutwo-ai mode would you like to configure?
        // highlight-start
        │  ● Auto Mode (Full file modification, extension usage, edit, create and delete files freely)
        // highlight-end
        |  ○ Approve Mode
        |  ○ Smart Approve Mode    
        |  ○ Chat Mode
        |
        └  Set to Auto Mode - full file modification enabled
        ```     
      </TabItem>
    </Tabs>
  </TabItem>
</Tabs>

  :::info
  In manual and smart approval modes, you will see "Allow" and "Deny" buttons in your session windows during tool calls. 
  qutwo-ai will only ask for permission for tools that it deems are 'write' tools, e.g. any 'text editor write', 'text editor edit', 'bash - rm, cp, mv' commands. 
  
  Read/write approval makes best effort attempt at classifying read or write tools. This is interpreted by your LLM provider. 
  :::

## CLI Provider Permission Integration

When using [CLI providers](/docs/guides/cli-providers) like Claude Code, qutwo-ai integrates with the provider's native permission system. In approve mode, permission requests from Claude Code are routed through qutwo-ai's confirmation interface, giving you a unified experience.

For example, with Claude Code in approve mode:
- Claude Code detects sensitive operations (file writes, shell commands, tool calls)
- The permission prompt appears in qutwo-ai's interface (CLI or Desktop)
- Your allow/deny decision is sent back to Claude Code
- Claude Code proceeds or adapts based on your response

This integration uses the same mechanism as the official Claude Agent SDKs, ensuring compatibility and consistent behavior.

See [CLI Providers - Claude Code Configuration](/docs/guides/cli-providers#claude-code-configuration) for setup details.
