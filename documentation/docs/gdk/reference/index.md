---
title: GDK Reference
sidebar_label: Reference
description: GDK crates and generated API documentation for Rust, Python, and Kotlin.
---

# GDK Reference

GDK is a set of Rust crates. Use the crates your application needs, or use the
Python and Kotlin bindings provided by `qutwo-ai-sdk`.

## Crates

Each crate links to its generated Rust documentation on docs.rs.

### [qutwo-ai-agent](https://docs.rs/qutwo-ai-agent/latest/qutwo_ai_agent/)

The agent runtime: a state machine built from an ordered list of operations and
inference steps. Each step can inspect the conversation, produce effects, or
yield control to the application. `StateMachine` can run the sequence for you,
or let you drive individual steps. Events stream out while work is running,
and cancellation finalizes interrupted steps and unanswered tool requests.

Use this crate when you want to assemble your own agent rather than run the
complete qutwo-ai application. `InferenceRunner` connects the machine to a model
provider, and `ToolOperation` exposes and executes your typed tools. You supply
the session type, a `SessionLoader`, and an `EffectHandler`, so storage and
application-specific behavior stay under your control. Persistence is supplied
by your runtime, not an embedded database. The core also supports WebAssembly
hosts, with platform-specific differences described in the crate documentation.

### [qutwo-ai-provider-types](https://docs.rs/qutwo-ai-provider-types/latest/qutwo_ai_provider_types/)

The common language between an application and a model backend. It defines the
`Provider` trait, `ModelConfig`, `Conversation`, messages and their content,
tool requests and responses, token usage, and provider errors. It also supplies
shared model metadata and helpers for context limits, prompt caching, and
reasoning content, so these concepts do not need a different representation for
every provider.

Depend on this crate when implementing a provider or working with GDK messages
without needing the provider implementations or agent runtime. A provider
implements streaming through `MessageStream`; the default `complete` method
collects that stream into a message and usage. Text can arrive incrementally,
while tool calls are emitted once their arguments are assembled.
`qutwo-ai-providers` re-exports these modules when you also need a working backend.

### [qutwo-ai-providers](https://docs.rs/qutwo-ai-providers/latest/qutwo_ai_providers/)

The model backend implementations. It includes providers for services such as
OpenAI, Anthropic, Google Gemini, Azure AI Foundry, and Databricks, as well as
Ollama and OpenAI-compatible endpoints. They translate service-specific requests
and responses into the shared provider interface. The supporting `ApiClient`
handles HTTP requests and authentication, while shared helpers cover response
errors and request formatting. You can use these providers directly without
building an agent.

Many compatible services can be configured through a declarative JSON definition
that selects an engine, endpoint, configuration keys, and models. Use the bundled
definitions or load your own rather than write another provider implementation.
Optional features add local inference and its hardware backends; live-session
and voice interfaces support applications beyond text completions, with an
optional WebSocket transport. For native HTTPS connections, enable either
`rustls-tls` or `native-tls`; neither is enabled by default.

### [qutwo-ai-context-management](https://docs.rs/qutwo-ai-context-management/latest/qutwo_ai_context_management/)

Summarization and conversation compaction for histories that are getting too
large for a model's context window. `summarize` turns a slice of messages into
a summary message and records the model usage. The higher-level `compact`
function reads and writes through `CompactionInput` and `CompactionOutput`, so
your application can keep its own conversation representation and storage.

Use `ProviderModel` to summarize with an existing GDK provider, or implement
`CompactionModel` to control model selection yourself. Prompt templates and an
optional `TokenEstimator` let you shape the summary and limit its input; the
crate also defines structured summaries with file activity. For a simpler
fallback, `CompactingProvider` wraps a provider and retries a context-length
error once with a summarized history. Compaction does not require the agent
state machine, and the trait-based API leaves saving the result to your app.

### [qutwo-ai-local-inference](https://docs.rs/qutwo-ai-local-inference/latest/qutwo_ai_local_inference/)

Runs models on the user's machine, using llama.cpp for GGUF models and an
optional MLX backend on Apple silicon. It handles loading models, sharing loaded
instances, evicting them from memory, and applying chat templates. It also
interprets model output, including tool calls and reasoning blocks, and handles
image input for supported models. This is the inference engine, not a separate
model server your application must launch.

Use it through `qutwo-ai-providers`' `local-inference` feature to get a
`LocalInferenceProvider` that implements the same `Provider` interface as remote
backends. Models can be loaded from local paths; the optional `hf-hub` feature
adds Hugging Face discovery, downloads, cache inventory, and model-management
APIs. CUDA, Vulkan, and MLX are selected through features. These backends have
native build requirements, and the models you can run depend on available
memory and hardware.

### [qutwo-ai-download-manager](https://docs.rs/qutwo-ai-download-manager/latest/qutwo_ai_download_manager/)

Background downloads for model files, with progress that an application can
display. A `DownloadManager` tracks jobs by model ID and exposes status, bytes
downloaded, total size, speed, estimated time remaining, and errors. It supports
single files and groups of model shards, with combined progress across the
files, cancellation, and an optional completion callback.

The downloader writes to partial files, uses HTTP range requests to continue
partial transfers, retries transient failures, and renames completed files into
place. Bearer-token support lets it fetch files from authenticated endpoints.
Use this crate when your application already knows the download URLs and
destination paths. Model discovery and cache inventory belong to the
`hf-hub` layer in `qutwo-ai-local-inference`; the download manager itself does not
choose a model or load it for inference.

### [qutwo-ai-sdk-types](https://docs.rs/qutwo-ai-sdk-types/latest/qutwo_ai_sdk_types/)

The shared wire types for qutwo-ai's additions to ACP. Its request, response, and
notification types describe methods under `_qutwo_ai/*`, including extension and
tool management, provider configuration, recipes, and local-model management.
Custom notifications carry information such as session usage, status messages,
per-message timing, and provider authentication updates alongside standard ACP
events.

Use this crate in Rust code that needs to exchange those qutwo-ai-specific
messages without depending on the qutwo-ai application. The types include
serialization and JSON-schema definitions, keeping the wire format in one place
for the server, clients, and generated documentation. It does not start an agent
or establish a connection: use an ACP client library for transport and standard
protocol methods, and the [qutwo-ai ACP reference](/docs/gdk/acp/reference) for the
additional methods.

### [qutwo-ai-sdk](https://docs.rs/qutwo-ai-sdk/latest/qutwo_ai_sdk/)

The cross-language bindings package and a small Rust entry point for the shared
wire types. With default features, it re-exports `custom_requests` and
`custom_notifications` from `qutwo-ai-sdk-types`. It is not an umbrella crate that
automatically assembles an agent or exposes every GDK component; Rust
applications building an in-process runtime use the component crates above.

The optional `uniffi` feature exposes native APIs to Python and Kotlin. These
bindings let you construct providers, list models, send typed message and tool
content, stream or collect completions, and compact conversations. They also
include typed decision requests and observability hooks for provider calls.
This is in-process access to the native library, not a connection to a running
qutwo-ai process. The full agent state machine is not exposed through these
bindings; see the generated language references below for the available API.

## API documentation

- **Rust:** follow the crate links above for the full native APIs.
- **[Python](/docs/gdk/sdk/api-reference?language=python):** generated bindings reference.
- **[Kotlin](/docs/gdk/sdk/api-reference?language=kotlin):** generated bindings reference.

For coding agents or other clients without JavaScript, use the generated
[Python Markdown reference](pathname:///docs/gdk/sdk/api-reference-python.md) or
[Kotlin Markdown reference](pathname:///docs/gdk/sdk/api-reference-kotlin.md).
Both include method anchors and links to their versioned API snapshots.

The Python and Kotlin bindings currently expose model providers, streaming
completions, and conversation compaction. They do not expose the full agent
runtime available in Rust.

Select the documentation version that matches your dependencies. GDK is in alpha;
APIs may change between releases.

## ACP

For apps that connect to the pre-built qutwo-ai agent, see the
[ACP walkthrough](/docs/gdk/acp), the
[standard protocol reference](https://agentclientprotocol.com/protocol/v1/overview),
and the generated reference for [qutwo-ai extensions](/docs/gdk/acp/reference).
