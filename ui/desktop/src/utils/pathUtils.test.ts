import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { isAbsoluteQutwoAiPath, resolveQutwoAiPathRoot, sanitizeQutwoAiPathRoot } from './pathUtils';

describe('resolveQutwoAiPathRoot', () => {
  it('rejects empty and relative values', () => {
    expect(resolveQutwoAiPathRoot(undefined)).toBeUndefined();
    expect(resolveQutwoAiPathRoot('   ')).toBeUndefined();
    expect(resolveQutwoAiPathRoot('relative/root')).toBeUndefined();
  });

  it('retains absolute paths without requiring them to exist', () => {
    const absolute = path.resolve('nonexistent-qutwo-ai-root');
    expect(resolveQutwoAiPathRoot(`  ${absolute}  `)).toBe(absolute);
  });

  it('expands a home-relative root before validation', () => {
    expect(resolveQutwoAiPathRoot('~')).toBe(os.homedir());
  });

  it('removes a rejected value from the child-process environment', () => {
    const env = { QUTWO_AI_PATH_ROOT: 'relative/root' };
    expect(sanitizeQutwoAiPathRoot(env)).toBeUndefined();
    expect(env).not.toHaveProperty('QUTWO_AI_PATH_ROOT');
  });

  it('matches Rust absolute-path handling on Windows', () => {
    expect(isAbsoluteQutwoAiPath('C:\\qutwo-ai\\root', 'win32')).toBe(true);
    expect(isAbsoluteQutwoAiPath('\\\\server\\share\\qutwo-ai', 'win32')).toBe(true);
    expect(isAbsoluteQutwoAiPath('C:qutwo-ai\\root', 'win32')).toBe(false);
    expect(isAbsoluteQutwoAiPath('\\qutwo-ai\\root', 'win32')).toBe(false);
    expect(isAbsoluteQutwoAiPath('/qutwo-ai/root', 'win32')).toBe(false);
  });
});
