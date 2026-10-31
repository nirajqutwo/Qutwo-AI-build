# Native Binary Packages for qutwo-ai

This directory contains the npm package scaffolding for distributing the
`qutwo-ai` Rust binary as platform-specific npm packages.

## Packages

| Package | Platform |
|---------|----------|
| `@aaif/qutwo-ai-binary-darwin-arm64` | macOS Apple Silicon |
| `@aaif/qutwo-ai-binary-darwin-x64` | macOS Intel |
| `@aaif/qutwo-ai-binary-linux-arm64` | Linux ARM64 |
| `@aaif/qutwo-ai-binary-linux-x64` | Linux x64 |
| `@aaif/qutwo-ai-binary-win32-x64` | Windows x64 |

## Usage

These are platform-specific implementation dependencies and are not intended
to be installed directly. Install `@aaif/qutwo-ai-acp` instead. It installs the
appropriate package automatically and provides the `qutwo-ai` command. Each
binary package contains its native executable. Its platform-specific internal
command preserves executable permissions during npm packing;
`@aaif/qutwo-ai-acp` remains the sole owner of the supported `qutwo-ai` command.

## Release preparation

The `.github/workflows/publish-npm.yml` workflow downloads the binaries from an
exact versioned Qutwo-AI release and prepares the platform package tarballs.
By default it only uploads the verified tarballs as a workflow artifact. Set
the manual `publish` input to publish them through the protected npm production
environment.
