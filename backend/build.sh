#!/usr/bin/env bash
# Render Build Script
set -o errexit

# 1. 依存関係のインストール
pip install -r requirements.txt

# 2. バイナリをプロジェクトルート（backend/）に強制ダウンロード
# PRISMA_PY_BINARY_CACHE_DIR を指定し、実行時にも参照可能な場所に置く
PRISMA_PY_BINARY_CACHE_DIR=. prisma py fetch

# 3. クライアント生成
prisma generate

# 4. DB構造の反映（5432ポートのダイレクト接続を想定）
prisma db push