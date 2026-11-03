"""Stamp a secrets file into a built deployment zip (rewrites config/secrets.json, preserves symlinks/permissions).

usage: python stamp_zip.py <src.zip> <dst.zip> <secrets.json>
"""
import json
import os
import sys
import zipfile

src, dst, secrets = sys.argv[1:4]
payload = json.dumps(json.load(open(secrets, encoding='utf-8')), indent=2).encode() + b'\n'
with zipfile.ZipFile(src) as zi, zipfile.ZipFile(dst, 'w', zipfile.ZIP_DEFLATED) as zo:
    hit = 0
    for info in zi.infolist():
        data = zi.read(info)
        if info.filename == 'config/secrets.json':
            data = payload
            hit += 1
        zo.writestr(info, data)
assert hit == 1, hit
print(os.path.basename(dst), os.path.getsize(dst) // 1048576, 'MB stamped')
