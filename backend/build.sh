#!/usr/bin/env bash
# Render Build Script
set -o errexit

pip install -r requirements.txt
# 環境変数で指定した場所にバイナリをダウンロード
prisma py fetch
# クライアント生成
prisma generate
# DB構造の反映
prisma db push