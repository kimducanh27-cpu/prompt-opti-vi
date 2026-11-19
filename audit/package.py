"""Đóng gói bàn giao: mã nguồn (kèm báo cáo, bằng chứng) và bản build web.

Chạy từ thư mục gốc dự án: `python3 audit/package.py`.
Đầu ra nằm trong /sdcard/Download/DSH-Go.
"""
import os
import shutil
import zipfile

ROOT = os.getcwd()
NAME = 'prompt-optimizer-vi-mobile-2.15.2'
STAGE = f'/tmp/pkg/{NAME}'
OUT_DIR = '/sdcard/Download/DSH-Go'

EXCLUDE_DIRS = {'node_modules', 'dist', '.vite', '.git', 'playwright-report', 'test-results'}
EXCLUDE_FILES = {'source.zip', 'pw-smoke.mjs'}


def build_stage():
    if os.path.exists('/tmp/pkg'):
        shutil.rmtree('/tmp/pkg')
    os.makedirs(STAGE, exist_ok=True)
    for entry in sorted(os.listdir(ROOT)):
        if entry in EXCLUDE_DIRS or entry in EXCLUDE_FILES:
            continue
        src = os.path.join(ROOT, entry)
        dst = os.path.join(STAGE, entry)
        if os.path.isdir(src):
            shutil.copytree(
                src, dst,
                ignore=shutil.ignore_patterns(*EXCLUDE_DIRS, *EXCLUDE_FILES),
            )
        else:
            shutil.copy2(src, dst)


def write_zip(root_dir, out_path, prefix):
    count = 0
    with zipfile.ZipFile(out_path, 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as zf:
        for base, dirs, files in os.walk(root_dir):
            dirs[:] = [d for d in dirs if d not in {'node_modules', 'dist', '.vite', '.git'}]
            for f in files:
                if f in EXCLUDE_FILES:
                    continue
                full = os.path.join(base, f)
                rel = os.path.relpath(full, root_dir)
                zf.write(full, os.path.join(prefix, rel))
                count += 1
    return count


def package_source(out):
    n = write_zip(STAGE, out, NAME)
    print('source files:', n, '|', out, round(os.path.getsize(out) / 1024 / 1024, 1), 'MB')


def package_web_dist(out):
    dist = os.path.join(ROOT, 'packages/web/dist')
    if not os.path.isdir(dist):
        print('skip web dist: not built')
        return
    n = write_zip(dist, out, f'{NAME}-web-dist')
    print('web dist files:', n, '|', out, round(os.path.getsize(out) / 1024 / 1024, 1), 'MB')


if __name__ == '__main__':
    os.makedirs(OUT_DIR, exist_ok=True)
    build_stage()
    package_source(os.path.join(OUT_DIR, f'{NAME}-src.zip'))
    package_web_dist(os.path.join(OUT_DIR, f'{NAME}-web-dist.zip'))
