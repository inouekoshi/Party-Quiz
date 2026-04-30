#!/usr/bin/env bash
# Render Build Script
set -o errexit

# 1. 依存関係のインストール
pip install -r requirements.txt

# 2. バイナリを一度キャッシュにダウンロード
prisma py fetch

# 3. キャッシュされたバイナリを検索し、カレントディレクトリ(backend/)へコピー
# これにより、実行環境にバイナリが確実に含まれるようになります
find /opt/render/.cache/prisma-python/binaries -name "prisma-query-engine-*" -exec cp {} . \;

# 4. コピーしたバイナリに実行権限を付与
chmod +x prisma-query-engine-*

# 5. クライアント生成
prisma generate

# 6. DB構造の反映
prisma db push