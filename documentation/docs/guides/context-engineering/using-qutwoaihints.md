---
title: Providing Hints to qutwo-ai
sidebar_position: 1
sidebar_label: Using qutwoaihints
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { Menu } from 'lucide-react';

`.qutwoaihints` is a text file used to provide additional context about your project and improve the communication with qutwo-ai. The use of `.qutwoaihints` ensures that qutwo-ai understands your requirements better and can execute tasks more effectively.

<details>
  <summary>qutwo-ai Hints Video Walkthrough</summary>
  <iframe
  class="aspect-ratio"
  src="https://www.youtube.com/embed/kWXJC5p0608"
  title="qutwo-ai Hints"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
  ></iframe>
</details>

A good time to consider adding a `.qutwoaihints` file is when you find yourself repeating prompts, or providing the same kind of instructions multiple times. It's also a great way to provide a lot of context which might be better suited in a file.

This guide will walk you through creating and using `.qutwoaihints` files to streamline your workflow with custom instructions and context.

:::info Developer extension required
To make use of the hints file, you need to have the `Developer` extension [enabled](/docs/getting-started/using-extensions).
:::

## Creating Your Hints File

qutwo-ai supports two types of hint files:
- **Global hints file** - These hints will apply to all your sessions with qutwo-ai, regardless of directory. Global hints are stored in `~/.config/qutwo-ai/.qutwoaihints`.
- **Local hints files** -  These hints will only apply when working in a specific directory or directory hierarchy.

You can use both global and local hints at the same time. When both exist, qutwo-ai will consider both your global preferences and project-specific requirements. If the instructions in your local hints file conflict with your global preferences, qutwo-ai will prioritize the local hints.

:::tip Custom Context Files
You can use other agent rule files with qutwo-ai by using the [`CONTEXT_FILE_NAMES` environment variable](#custom-context-files).
:::

<Tabs groupId="interface">
    <TabItem value="ui" label="qutwo-ai Desktop" default>

    #### Global hints file
    1. Create a `.qutwoaihints` file in `~/.config/qutwo-ai`

    #### Local hints file

    1. Click the directory path at the bottom of the app and open the directory where you want to create the file
    2. Click the hamburger button <Menu className="inline" size={16} /> in the top-left to open the sidebar
    3. Click `Settings` in the sidebar
    4. Click `Chat`
    5. Scroll down to the `Project Hints (.qutwoaihints)` section and click `Configure`
    6. Enter your local hints in the text area
    7. Click `Save`
    8. Restart your session so qutwo-ai can read the updated `.qutwoaihints`

    If a `.qutwoaihints` file already exists in the given directory, you can edit your existing hints.

    </TabItem>
    <TabItem value="manual" label="Manual">
    
    - **Global hints file** - Create a `.qutwoaihints` file in `~/.config/qutwo-ai`.
    - **Local hints file** -  Create a `.qutwoaihints` file at the root of your project and/or in any directory in the hierarchy.

    </TabItem>
</Tabs>

The `.qutwoaihints` file can include any instructions or contextual details relevant to your projects.

## Setting Up Hints

The `.qutwoaihints` file supports natural language. Write clear, specific instructions using direct language that qutwo-ai can easily understand and follow. Include relevant context about your project and workflow preferences, and prioritize your most important guidelines first.

qutwo-ai loads hints at the start of your session. As it accesses files in nested directories, it also loads the hint files for those directories. qutwo-ai adds hints to the system prompt for every request. Because `.qutwoaihints` content uses tokens, keeping it concise can reduce cost and improve performance.

### Example Global `.qutwoaihints` File

```
Always use TypeScript for new Next.js projects.

@coding-standards.md  # Contains our coding standards
docs/contributing.md  # Contains our pull request process

Follow the [Google Style Guide](https://google.github.io/styleguide/pyguide.html) for Python code.

Run unit tests before committing any changes.

Prefer functional programming patterns where applicable.
```

### Example Local `.qutwoaihints` File

```
This is a simple example JavaScript web application that uses the Express.js framework. View [Express documentation](https://expressjs.com/) for extended guidance.

Go through the @README.md for information on how to build and test it as needed.

Make sure to confirm all changes with me before applying.

Run tests with `npm run test` ideally after each change.
```

These examples show two ways to reference other files:
- **`@` syntax**: Automatically includes the file content in qutwo-ai's immediate context
- **Plain reference**: Points qutwo-ai to files to review when needed (use for optional or very large files)

### Nested `.qutwoaihints` Files

qutwo-ai supports hierarchical local hints in git repositories. When your session starts, qutwo-ai loads the configured context files from your working directory up to the repository root. As qutwo-ai reads or modifies files in nested subdirectories, it can also discover and load additional hint files from those directories automatically.

This is especially useful in monorepos or large projects where different parts of the codebase have different conventions.

By default, qutwo-ai looks for both `AGENTS.md` and `.qutwoaihints` at each level. If you're using [custom context files](#custom-context-files), qutwo-ai applies the same nested loading behavior to those filenames too.

As a best practice, `.qutwoaihints` at each level should only include hints relevant to that scope:
- **Root level**: Include project-wide standards, build processes, and general guidelines
- **Module/feature level**: Add specific requirements for that area of the codebase
- **Directory level**: Include very specific context like local testing procedures or component patterns

**Example Project Structure:**
```sh
my-project/
├── .git/
├── .qutwoaihints              # Project-wide hints
├── frontend/
│   ├── .qutwoaihints          # Frontend-specific hints
│   └── components/
│       ├── .qutwoaihints      # Component-specific hints
│       └── Button.tsx
└── backend/
    ├── .qutwoaihints          # Backend-specific hints
    └── api/
        └── routes.py
```

If you start qutwo-ai in `my-project/`, the root-level hints are loaded immediately. Later, when qutwo-ai accesses files under `frontend/components/`, it loads the nested hints for that path and combines them in the following order:
1. <details>
     <summary>`my-project/.qutwoaihints` (project root)</summary>
        ```
        This is a React + TypeScript project using Vite.

        @README.md                    # Project overview and setup instructions
        @docs/development-setup.md    # Development environment configuration

        Always run tests before committing: `npm test`
        Use conventional commits for all changes.
        ```
   </details>
2. <details>
     <summary>`frontend/.qutwoaihints`</summary>
        ```
        This frontend uses React 18 with TypeScript and Tailwind CSS.

        @package.json                      # Dependencies and scripts
        @docs/frontend-architecture.md     # Frontend structure and patterns

        ## Development Standards
        - Use functional components with hooks (no class components)
        - Implement proper TypeScript interfaces for all props
        - Follow the component structure: /components/ComponentName/index.tsx
        - Use Tailwind classes instead of custom CSS when possible

        ## Testing Requirements  
        - Write unit tests for all components using React Testing Library
        - Test files should be co-located: ComponentName.test.tsx
        - Run `npm run test:frontend` before committing changes

        ## State Management
        - Use React Query for server state
        - Use Zustand for client state management
        - Avoid prop drilling - lift state appropriately

        Always confirm UI changes with design team before implementation.
        ```
   </details>
3. <details>
     <summary>`frontend/components/.qutwoaihints` (current directory)</summary>
        ```
        Components in this directory use our design system.

        @docs/component-api.md    # Component interface standards and examples

        All components must:
        - Export a default component
        - Include TypeScript props interface
        - Have corresponding .test.tsx file
        - Follow naming convention: PascalCase
        ```
   </details>

:::note
After nested hints are loaded for a directory, they remain active for the rest of the session. If you update a hint file and want qutwo-ai to pick up the new content reliably, restart the session.
:::

## Common Use Cases
Here are some ways people have used hints to provide additional context to qutwo-ai:

- **Decision-Making**: Specify if qutwo-ai should autonomously make changes or confirm actions with you first.

- **Validation Routines**: Provide test cases or validation methods that qutwo-ai should perform to ensure changes meet project specifications.

- **Feedback Loop**: Include steps that allow qutwo-ai to receive feedback and iteratively improve its suggestions.

- **Point to more detailed documentation**: Indicate important files like `README.md`, `docs/setup-guide.md`, or others that qutwo-ai should consult for detailed explanations.

- **Organize with @-mentions**: For frequently-needed documentation, use `@filename.md` or `@relative/path/testing.md` to automatically include file content in your current context instead of just referencing it. This ensures qutwo-ai has immediate access to important information. 
Include core documentation (like API schemas or coding standards) with @-mentions for immediate context, but use plain references (without `@`) for optional or very large files.

Like prompts, this is not an extensive list to shape your `.qutwoaihints` file. You can include as much context as you need.

## Best Practices

- **Keep files updated**: Regularly update the `.qutwoaihints` files to reflect any changes in project protocols or priorities.
- **Be concise**: Make sure the content is straightforward and to the point, ensuring qutwo-ai can quickly parse and act on the information.
- **Start small**: Create a small set of clear, specific hints and gradually expand them based on your needs. This makes it easier to understand how qutwo-ai interprets and applies your instructions.
- **Reference other files**: Point qutwo-ai to relevant files like /docs/style.md or /scripts/validation.js to reduce repetition and keep instructions lightweight.

## Custom Context Files

qutwo-ai looks for `AGENTS.md` then `.qutwoaihints` files by default, but you can configure a different filename or multiple context files using the `CONTEXT_FILE_NAMES` environment variable. This is useful for:

- **Tool compatibility**: Use conventions from other AI tools (e.g. `CLAUDE.md`)
- **Organization**: Separate frequently-used rules into multiple files that load automatically
- **Project conventions**: Use context files from your project's established toolchain (`.cursorrules`)

Here's how it works:
1. qutwo-ai looks for each configured filename in both global (`~/.config/qutwo-ai/`) and local project locations
2. At session start, qutwo-ai loads matching files from your working directory hierarchy
3. During the session, qutwo-ai can load additional matching files when it accesses nested subdirectories
4. All found files are loaded and combined into the context

### Configuration

Set the `CONTEXT_FILE_NAMES` environment variable to a JSON array of filenames. The default is `["AGENTS.md", ".qutwoaihints"]`.

```bash
# Single custom file
export CONTEXT_FILE_NAMES='["AGENTS.md"]'

# Project toolchain files
export CONTEXT_FILE_NAMES='[".cursorrules", "AGENTS.md"]'

# Multiple files
export CONTEXT_FILE_NAMES='["CLAUDE.md", ".qutwoaihints", "project_rules.txt"]'
```
