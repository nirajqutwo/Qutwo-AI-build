"""Export the tracked source to a clean directory for the public build repo, then scan it for secrets.

usage: python export.py <dest_dir> <deploy_secrets_json>
Fails (exit 1) if the real key or any credential-looking string is present in the export.
"""
import json
import os
import re
import shutil
import subprocess
import sys

dest, secrets_file = sys.argv[1], sys.argv[2]
repo = subprocess.check_output(['git', 'rev-parse', '--show-toplevel'], text=True).strip()
here = os.path.dirname(os.path.abspath(__file__))

EXCLUDE_PREFIXES = ('.github/', 'CLAUDE.md', 'JOURNAL.md', 'TODO.md', 'AGENTS.md')

if os.path.exists(dest):
    shutil.rmtree(dest)
os.makedirs(dest)

files = subprocess.check_output(['git', 'ls-files', '-z'], cwd=repo, text=True).split('\0')
for f in files:
    if not f or f.startswith(EXCLUDE_PREFIXES):
        continue
    src = os.path.join(repo, f)
    if not os.path.isfile(src):
        continue
    out = os.path.join(dest, f)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    shutil.copy2(src, out)

wf = os.path.join(dest, '.github', 'workflows')
os.makedirs(wf)
shutil.copy2(os.path.join(here, 'build.yml'), os.path.join(wf, 'build.yml'))

real = [v for v in json.load(open(secrets_file, encoding='utf-8')).values() if isinstance(v, str) and len(v) > 8]
patterns = [
    re.compile(r'sk-[A-Za-z0-9_-]{16,}'),
    re.compile(r'gh[pousr]_[A-Za-z0-9]{20,}'),
    re.compile(r'-----BEGIN [A-Z ]*PRIVATE KEY-----'),
    re.compile(r'AKIA[0-9A-Z]{16}'),
    re.compile(r'xox[abp]-[A-Za-z0-9-]{10,}'),
]
# Upstream test fixtures / doc placeholders (reviewed: not real credentials). The real-key check below has no exceptions.
FIXTURE_FILES = (
    'crates/qutwo-ai/src/providers/gcpauth.rs',
    'crates/qutwo-ai-providers/src/api_client.rs',
    'documentation/docs/mcp/github-mcp.md',
)
bad = []
for dp, _, fns in os.walk(dest):
    for fn in fns:
        p = os.path.join(dp, fn)
        try:
            t = open(p, encoding='utf-8', errors='ignore').read()
        except OSError:
            continue
        for v in real:
            if v in t:
                bad.append((p, 'REAL KEY'))
        if os.path.relpath(p, dest).replace(os.sep, '/') in FIXTURE_FILES:
            continue
        for pat in patterns:
            m = pat.search(t)
            if m:
                bad.append((p, pat.pattern, m.group(0)[:6] + '...'))
if bad:
    for b in bad:
        print('SECRET-LIKE:', b)
    sys.exit(1)
print('exported', len(files), 'tracked files; scan clean')
