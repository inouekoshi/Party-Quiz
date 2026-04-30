#!/usr/bin/env bash
# Render Build Script
set -o errexit

# 1. 依存関係のインストール
pip install -r requirements.txt

# 2. バイナリをカレントディレクトリ（backend/）に強制ダウンロード
# PRISMA_PY_BINARY_CACHE_DIR を指定することで、隠しフォルダではなく見える場所に置きます
PRISMA_PY_BINARY_CACHE_DIR=. prisma py fetch

# 3. クライアント生成
prisma generate

# 4. DB構造の反映
prisma db push