import { statSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";

const PLATFORM_PACKAGES: Record<string, string> = {
  "darwin-arm64": "@aaif/qutwo-ai-binary-darwin-arm64",
  "darwin-x64": "@aaif/qutwo-ai-binary-darwin-x64",
  "linux-arm64": "@aaif/qutwo-ai-binary-linux-arm64",
  "linux-x64": "@aaif/qutwo-ai-binary-linux-x64",
  "win32-x64": "@aaif/qutwo-ai-binary-win32-x64",
};

const require = createRequire(import.meta.url);

export interface BinaryResolverDependencies {
  resolvePackageJson(specifier: string): string;
  isFile(path: string): boolean;
}

const resolverDependencies: BinaryResolverDependencies = {
  resolvePackageJson: (specifier) => require.resolve(specifier),
  isFile: (path) => {
    try {
      return statSync(path).isFile();
    } catch {
      return false;
    }
  },
};

export function resolveQutwoAiBinary(): string {
  const override = process.env.QUTWO_AI_BINARY?.trim();
  if (override) {
    const binaryPath = resolve(override);
    if (!resolverDependencies.isFile(binaryPath)) {
      throw new Error(`QUTWO_AI_BINARY does not point to a file: ${binaryPath}.`);
    }
    return binaryPath;
  }

  return resolveQutwoAiBinaryForRuntime(
    process.platform,
    process.arch,
    resolverDependencies,
  );
}

export function resolveQutwoAiBinaryForRuntime(
  platform: string,
  arch: string,
  dependencies: BinaryResolverDependencies,
): string {
  const platformKey = `${platform}-${arch}`;
  const packageName = PLATFORM_PACKAGES[platformKey];

  if (!packageName) {
    throw new Error(
      `No Qutwo-AI npm binary is available for ${platformKey}. Supported platforms: ${Object.keys(PLATFORM_PACKAGES).join(", ")}.`,
    );
  }

  let packageJsonPath: string;
  try {
    packageJsonPath = dependencies.resolvePackageJson(
      `${packageName}/package.json`,
    );
  } catch (cause) {
    throw new Error(
      `Qutwo-AI binary package ${packageName} is not installed. Reinstall @aaif/qutwo-ai-acp with optional dependencies enabled.`,
      { cause },
    );
  }

  const executableName = platform === "win32" ? "qutwo-ai.exe" : "qutwo-ai";
  const binaryPath = resolve(dirname(packageJsonPath), "bin", executableName);

  if (!dependencies.isFile(binaryPath)) {
    throw new Error(
      `Qutwo-AI executable from ${packageName} was not found at ${binaryPath}.`,
    );
  }

  return binaryPath;
}
