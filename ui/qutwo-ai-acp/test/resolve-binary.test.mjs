import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import test from "node:test";
import { isAbsolute, join, relative, resolve } from "node:path";

import * as publicApi from "../dist/index.js";
import { resolveQutwoAiBinaryForRuntime } from "../dist/resolve-binary.js";

const supportedPlatforms = [
  ["darwin", "arm64", "@aaif/qutwo-ai-binary-darwin-arm64", "qutwo-ai"],
  ["darwin", "x64", "@aaif/qutwo-ai-binary-darwin-x64", "qutwo-ai"],
  ["linux", "arm64", "@aaif/qutwo-ai-binary-linux-arm64", "qutwo-ai"],
  ["linux", "x64", "@aaif/qutwo-ai-binary-linux-x64", "qutwo-ai"],
  ["win32", "x64", "@aaif/qutwo-ai-binary-win32-x64", "qutwo-ai.exe"],
];

function setQutwoAiBinary(t, value) {
  const original = process.env.QUTWO_AI_BINARY;
  process.env.QUTWO_AI_BINARY = value;
  t.after(() => {
    if (original === undefined) {
      delete process.env.QUTWO_AI_BINARY;
    } else {
      process.env.QUTWO_AI_BINARY = original;
    }
  });
}

for (const [
  platform,
  arch,
  packageName,
  executableName,
] of supportedPlatforms) {
  test(`resolves ${platform}-${arch}`, () => {
    let resolvedSpecifier;
    let checkedPath;
    const fixturePackageRoot = join("/fixtures", packageName);

    const result = resolveQutwoAiBinaryForRuntime(platform, arch, {
      resolvePackageJson(specifier) {
        resolvedSpecifier = specifier;
        return join(fixturePackageRoot, "package.json");
      },
      isFile(path) {
        checkedPath = path;
        return true;
      },
    });

    assert.equal(resolvedSpecifier, `${packageName}/package.json`);
    assert.equal(result, resolve(fixturePackageRoot, "bin", executableName));
    assert.equal(checkedPath, result);
    assert.equal(isAbsolute(result), true);
  });
}

test("exports only the public resolver from the package root", () => {
  assert.deepEqual(Object.keys(publicApi), ["resolveQutwoAiBinary"]);
});

test("uses QUTWO_AI_BINARY as an explicit override", (t) => {
  const directory = mkdtempSync(join(tmpdir(), "qutwo-ai-acp-override-"));
  const binaryPath = join(directory, "qutwo-ai");
  writeFileSync(binaryPath, "");
  setQutwoAiBinary(t, relative(process.cwd(), binaryPath));

  t.after(() => {
    rmSync(directory, { recursive: true, force: true });
  });

  assert.equal(publicApi.resolveQutwoAiBinary(), binaryPath);
});

test("rejects an invalid QUTWO_AI_BINARY override", (t) => {
  setQutwoAiBinary(t, "missing-qutwo-ai-binary");

  assert.throws(
    () => publicApi.resolveQutwoAiBinary(),
    /QUTWO_AI_BINARY does not point to a file/,
  );
});

test("reports unsupported platform and architecture combinations", () => {
  assert.throws(
    () =>
      resolveQutwoAiBinaryForRuntime("freebsd", "x64", {
        resolvePackageJson() {
          throw new Error("should not resolve a package");
        },
        isFile() {
          return false;
        },
      }),
    /No Qutwo-AI npm binary is available for freebsd-x64/,
  );
});

test("reports a missing optional platform package", () => {
  assert.throws(
    () =>
      resolveQutwoAiBinaryForRuntime("linux", "x64", {
        resolvePackageJson() {
          throw new Error("module not found");
        },
        isFile() {
          return false;
        },
      }),
    /Qutwo-AI binary package @aaif\/qutwo_ai-binary-linux-x64 is not installed/,
  );
});

test("reports a missing executable in an installed platform package", () => {
  assert.throws(
    () =>
      resolveQutwoAiBinaryForRuntime("darwin", "arm64", {
        resolvePackageJson() {
          return join(
            "/fixtures",
            "@aaif/qutwo-ai-binary-darwin-arm64/package.json",
          );
        },
        isFile() {
          return false;
        },
      }),
    /Qutwo-AI executable from @aaif\/qutwo_ai-binary-darwin-arm64 was not found/,
  );
});
