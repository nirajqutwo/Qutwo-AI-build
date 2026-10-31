---
title: Top Qutwo-AI
description: GitHub issues and pull requests with persistent private qutwo-ai conversations over ACP.
displayed_sidebar: gdkSidebar
---

# Top Qutwo-AI

Top Qutwo-AI brings GitHub issues, pull requests, and private agent conversations
into one desktop application. Select an issue or PR to read the public
discussion alongside an agent working against your local clone.

Built with **qutwo-ai over ACP**: an Electron application that runs `qutwo-ai acp`
as a subprocess.

[Source](https://github.com/DOsinga/top-qutwo-ai)

## The clever bit

The conversation belongs to the piece of work, not to whichever chat window
happens to be open. Each issue or pull request maps to a persistent qutwo-ai
session. Switching views does not cancel another session's running turn, and
returning after an application restart loads the existing conversation.

The application owns the GitHub context and interface; qutwo-ai owns the agent's
conversation history and tool execution. Separate git worktrees let sessions
work concurrently without sharing a checkout.

An application-provided MCP tool can place a draft reply in the composer for
review, giving the agent a way to participate in the interface rather than
only returning chat text.

## How it works

1. Read issues and PRs from GitHub and show their discussions in the app.
2. On the first prompt, create a qutwo-ai session and, when enabled, its worktree.
3. Supply the public discussion as untrusted context for the agent.
4. Route streamed updates to the matching conversation. Load the stored
   session when the user returns.

The [session manager](https://github.com/DOsinga/top-qutwo-ai/blob/main/src/main/qutwo-ai/sessions.ts)
resumes a mapped session and applies the replay to the UI:

```typescript
const cwd = await sessionCwd(mapping);
const replay = await acp.loadSession(mapping.sessionId, cwd, []);
applyReplay(live, replay);
live.currentAgent = undefined;
await attachDraftServer(mapping.sessionId, issueNodeId, cwd);
await applyInstructions(mapping.sessionId, mapping.kind ?? "issue");
```

See the [ACP transport](https://github.com/DOsinga/top-qutwo-ai/blob/main/src/main/qutwo-ai/acp.ts),
[context synchronization](https://github.com/DOsinga/top-qutwo-ai/blob/main/src/main/qutwo-ai/contextSync.ts),
and [draft-reply MCP server](https://github.com/DOsinga/top-qutwo-ai/blob/main/src/main/mcp/draftServer.ts)
for the other sides of that integration.

## Run it yourself

You need Node.js 22.12 or later, a local repository clone, a GitHub classic
personal access token, and qutwo-ai 1.41 or later with a configured provider.
The project is developed and tested on macOS.

```bash
git clone https://github.com/DOsinga/top-qutwo-ai.git
cd top-qutwo-ai
npm install
npm run dev
```

First-run settings guide you through GitHub authentication, locating qutwo-ai, and
choosing a local clone. Follow the
[setup instructions](https://github.com/DOsinga/top-qutwo-ai#setup) for token scopes
and optional Projects integration.

:::warning Agent access
Top Qutwo-AI runs sessions in automatic mode and approves tool requests. Worktrees
separate git state; they are not a security sandbox. Use a repository and
credentials appropriate for that level of access.
:::
