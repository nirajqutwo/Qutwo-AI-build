---
title: Agentic Testing with Playwright CLI Skill
description: Use qutwo-ai with the Playwright CLI to generate automated tests using natural language
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import QutwoAiBuiltinInstaller from '@site/src/components/QutwoAiBuiltinInstaller';

<iframe
  class="aspect-ratio"
  src="https://www.youtube.com/embed/_MpbmD_unnU?si=dpHvuLVkbONN_0Hk"
  title="Agentic testing with Playwright CLI skill tutorial video"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  referrerPolicy="strict-origin-when-cross-origin"
  allowFullScreen
></iframe>

With the [Playwright CLI](https://github.com/microsoft/playwright-cli), qutwo-ai can navigate websites, click buttons, fill forms, and turn those interactions into Playwright tests, all from natural language. Unlike the Playwright MCP, which sends the full page structure to the LLM on every request, Playwright CLI stores the accessibility tree locally. That means faster responses, lower costs, and no issues with large pages.

## Why as a Skill?

LLMs may not be trained on Playwright's CLI, so when asking an agent to use it, it may hallucinate commands and arguments resulting in errors and wasted tokens. The [Playwright CLI Skill](https://github.com/microsoft/playwright-cli/blob/main/skills/playwright-cli/SKILL.md) teaches qutwo-ai how to use the CLI and when to invoke specific commands.

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- Install Playwright CLI globally:
  ```bash
  npm install -g @playwright/cli@latest
  ```
- (Optional) [Playwright](https://playwright.dev/) installed if you want to run the generated tests (`npm init playwright@latest`)

## Configuration

### Install Skill

1. From the command line, install the Playwright skill in your project directory:

```bash
npx skills add https://github.com/microsoft/playwright-cli --skill playwright-cli
```

2. Enter `y` when asked to install the skills package

3. Choose `qutwo-ai` when asked which agent to install to

4. Choose `Global` scope to be able to use the skill in any project, or `Local` to only have access within the current working directory

5. Choose `Symlink` to have one copy that all of your agents can reference

6. You'll get a confirmation of the installation, choose `Yes` to proceed

### Enable Summon Extension
In qutwo-ai, enable the [Summon extension](/docs/mcp/summon-mcp) to load Agent Skills within sessions.

<Tabs groupId="interface">
  <TabItem value="ui" label="qutwo-ai Desktop" default>
  <QutwoAiBuiltinInstaller
    extensionName="Summon"
  />
  </TabItem>
  <TabItem value="cli" label="qutwo-ai CLI">

  1. Run the `configure` command:
  ```sh
  qutwo-ai configure
  ```

  2. Choose to `Toggle Extensions`
  ```sh
  ┌   qutwo-ai-configure 
  │
  ◇  What would you like to configure?
  │  Toggle Extensions 
  │
  ◆  Enable extensions: (use "space" to toggle and "enter" to submit)
  // highlight-start    
  │  ● summon
  // highlight-end
  |
  └  Extension settings updated successfully
  ```
  </TabItem>
</Tabs>


## Generate a Test with Video and Traces

Give qutwo-ai a single prompt that describes what you want to test:

```
Using the Playwright CLI skill, open qutwo-ai-docs.ai, click on the Docs menu, click on Context Engineering, 
then click on Using Skills and generate a test with video and traces
```

### How It Works

Each `playwright-cli` command automatically outputs the corresponding Playwright code. For example, this command:

```bash
playwright-cli click e11
```

executes the following Playwright code:

```ts
await page.getByRole('link', { name: 'Docs' }).click();
```

### What qutwo-ai does

1. Opens the browser: `playwright-cli open qutwo-ai-docs.ai`
2. Starts recording: `playwright-cli video-start` and `playwright-cli tracing-start`
3. Takes snapshots to find elements: `playwright-cli snapshot`
4. Performs clicks: `playwright-cli click <ref>`
5. Stops recording: `playwright-cli video-stop` and `playwright-cli tracing-stop`
6. Assembles the generated code into a test file

### Generated Files

| File | Description |
|------|-------------|
| `tests/using-skills-navigation.spec.ts` | Your Playwright test |
| `.playwright-cli/video-*.webm` | Video recording of the session |
| `.playwright-cli/traces/*.trace` | Trace file for debugging |

### Generated Test Code

The generated test might look like:

```typescript
import { test, expect } from '@playwright/test';

test('navigate to Using Skills guide via docs menu', async ({ page }) => {
  await page.goto('https://qutwo-ai-docs.ai');
  await expect(page).toHaveTitle(/qutwo-ai/);
  
  // Click on Docs in the navigation
  await page.getByRole('link', { name: 'Docs' }).click();
  
  // Expand Context Engineering category
  await page.getByRole('button', { name: 'Expand sidebar category \'Context Engineering\'' }).click();
  
  // Click on Using Skills
  await page.getByRole('link', { name: 'Using Skills' }).click();
  
  // Verify navigation
  await expect(page).toHaveURL(/using-skills/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Using Skills');
});
```

### Running the Test

qutwo-ai can even run the test for you to make sure it works as expected. If Playwright is already set up, just ask it to run the test. If not, qutwo-ai can install Playwright for you and then run the test.

## Viewing the Video

To see a video of what happened, prompt qutwo-ai:

```
Show me the video
```

qutwo-ai will use the CLI to open the recorded video, so you can see exactly what happened during the session.

## Viewing the Trace

To debug or review what happened, prompt qutwo-ai:

```
Open the trace
```

The trace viewer shows:
- Timeline of all actions
- Screenshots before/after each action
- Console logs and errors
- Network requests
- Element locators used

## Visual Dashboard for Multiple Sessions

When you have qutwo-ai running several browser tasks at once, it can be hard to keep track of what's happening. The visual dashboard gives you a bird's eye view of all your active browser sessions, letting you watch progress in real time or jump in and take control when needed.

```
Show playwright dashboard
```

From here you can see live previews of every browser qutwo-ai is controlling. Click into any session to watch it full-size, or take over the mouse and keyboard yourself if qutwo-ai needs a hand. Press `Escape` when you're done and qutwo-ai picks up right where you left off.

## Full Capabilities

Want to know what else the Playwright skill can do? Ask qutwo-ai:

```
What else can you do with the Playwright skill?
```

| Category | Capabilities |
|----------|-------------|
| **Browser Control** | open, goto, click, fill, close |
| **Capture & Debug** | screenshot, snapshot, video, trace |
| **Tab Management** | Open, switch, close tabs |
| **Storage & Auth** | Save/restore cookies, handle login states |
| **Network** | Mock APIs, intercept requests |
| **Input** | Type text, press keys, mouse actions |

### Example Use Cases

- ✅ Test web applications with natural language
- ✅ Fill out forms automatically
- ✅ Scrape data from websites
- ✅ Debug issues with video recordings
- ✅ Test authentication flows
- ✅ Record demos for documentation
- ✅ Mock APIs for isolated testing

## Conclusion

Getting started with the Playwright CLI agent skill is easy and opens up powerful browser automation capabilities directly from natural language prompts. Whether you're generating tests, debugging with videos and traces, or automating complex interactions, the Playwright CLI agent skill provides a token-efficient way to leverage Playwright's full power with qutwo-ai.

## Resources

- [Summon Extension Documentation](/docs/mcp/summon-mcp)
- [Using Skills Guide](/docs/guides/context-engineering/using-skills) - Learn how to create and use skills with qutwo-ai
- [Playwright CLI GitHub](https://github.com/microsoft/playwright-cli)
