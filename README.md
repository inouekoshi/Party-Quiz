# 🎓 Party Quiz (リアルタイム参加型チーム対抗クイズシステム)

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js) ![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql) ![WebSockets](https://img.shields.io/badge/WebSockets-Realtime-blue)

**Party Quiz** は、イベントや同窓会、結婚式の二次会などを最高に盛り上げるために開発された、完全リアルタイム同期のクイズシステムです。

参加者のスマホ（解答画面）、会場のプロジェクター（結果投影）、そして司会者のPC（管理進行）の3つのデバイスが **WebSockets** によってミリ秒単位で完全に同期します。従来のクイズにはない「ベッティング（賭け）」や「多数派当て」を取り入れ、会場全体の熱狂と一体感を生み出します。

---

## 🌐 本番公開URL (Live Demo)

以下のURLから実際のシステムを体験・テストすることができます。

- 📱 **参加者・解答画面**: [https://hobo-reunion-quiz.vercel.app/](https://hobo-reunion-quiz.vercel.app/)
  *(※ 管理者画面で作成したパスコードが必要です)*
- 💻 **プロジェクター画面**: [https://hobo-reunion-quiz.vercel.app/projector](https://hobo-reunion-quiz.vercel.app/projector)
  *(※ 会場スクリーンに全画面で投影する用)*
- ⚙️ **管理者・司会者画面**: [https://hobo-reunion-quiz.vercel.app/admin](https://hobo-reunion-quiz.vercel.app/admin)
  *(※ 進行管理、問題作成用)*

---

## ✨ 主な機能と特徴 (Features)

本システムは、ただの4択クイズシステムではありません。戦略性とエンターテイメント性を高める独自ルールを搭載しています。

### 1. 🔑 ルーム（部屋）＆パスコード管理
管理者が「部屋」を作成するたびに、専用の5桁パスコードが発行されます。セッションごとにデータが完全に独立しているため、何度でも新しい大会を開催できます。

### 2. 🎲 2段階解答＆ベッティングシステム
参加者は単に答えを選ぶだけでなく、「倍率」を賭けて勝負します。
- **ステップ1**: 自信に合わせて倍率 (`x1` / `x2` / `x3`) を選択。
- **ステップ2**: 答え (A〜D) を選択。
- **制限ルール**: 大会を通して、`x3` は1回、`x2` は2回しか使えません（`x1`は無制限）。どこで高倍率を切るかの駆け引きが生まれます。

### 3. 📝 動的な問題作成・進行コントロール
クイズ問題は事前にDBを直接操作する必要はありません。**管理者画面のUIからリアルタイムに問題文・選択肢を作成し、出題リストに追加可能**です。イベントの進行に合わせてその場でアドリブの問題を追加することもできます。

### 4. 🤝 マジョリティ（価値観同調）クイズ
「正解がない」アンケート形式の問題に対応。会場の参加者のうち「多数派」を選んだチームが得点を獲得します。その選択肢の「得票率(%)」がそのままポイント倍率に反映されるため、参加者全体の価値観を読み切る必要があります。

### 5. ⚡ 解答速度ボーナス
通常のクイズでは、早く正解を選んだチームほど追加ボーナス（最大50pt）を獲得します。

### 6. 📊 ライブ・リーダーボード
プロジェクターには常に全チームの勢力図が表示されます。結果発表のタイミングで、獲得ポイントとともに順位がアニメーションで入れ替わるため、テレビ番組のような演出が可能です。

---

## 🛠 技術スタック (Tech Stack)

### フロントエンド (Frontend)
- **Framework**: Next.js (App Router)
- **Library**: React, TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

### バックエンド (Backend)
- **Framework**: FastAPI (Python)
- **Realtime**: WebSockets
- **Deployment**: Render

### データベース (Database)
- **DB**: PostgreSQL (Supabase)
- **ORM**: Prisma Client Python

---

## 📂 ディレクトリ構成 (Directory Structure)

```text
hobo-reunion-quiz/
├── backend/          # FastAPI & PrismaによるバックエンドAPI・WSサーバー
│   ├── app/          # APIルーター、状態管理(quiz_state.py)、WS管理(ws.py)
│   ├── prisma/       # データベーススキーマ (schema.prisma)
│   └── build.sh      # Renderデプロイ用ビルドスクリプト
├── frontend/         # Next.jsによるフロントエンドUI
│   └── src/app/
│       ├── (root)    # 参加者用 ログイン画面
│       ├── play/     # 参加者用 解答・ベッティング画面
│       ├── projector/# プロジェクター投影用画面 (リーダーボード)
│       └── admin/    # 管理者用 進行パネル・問題作成画面
└── docs/             # 使い方・要件定義・設計書などの各種ドキュメント
```

---

## 🎮 使い方・クイズ進行のフロー (How to use)

このアプリを初めて操作する方のための基本的な流れです。（詳細は `docs/使い方ガイド.md` を参照）

1. **[管理者] 部屋の作成**
   - 管理画面 (`/admin`) で「新しい部屋を作成」を押します。
   - 画面に5桁の英数字（パスコード）が表示されます。
2. **[参加者] 入室**
   - 参加者画面 (`/`) にアクセスし、チーム名とパスコードを入力して入場します。
3. **[管理者] 問題の作成・出題**
   - 管理画面のフォームから問題を直接作成し、「リストに追加」します。
   - 準備ができたら、リスト内の問題の「▶ 出題」ボタンを押します。
4. **[参加者] 解答**
   - スマホ画面が切り替わります。まず倍率（x1~x3）を選び、次に解答（A~D）を送信します。
5. **[管理者] 締め切りと結果発表**
   - 全チームが解答したのを確認し、管理画面で「⏱ 締め切り」を押します。
   - 続いて「🎯 結果発表」を押すと、プロジェクターに正解と順位変動の演出が表示されます。

---

## 🚀 ローカル環境での構築・起動手順 (Local Setup)

開発やローカル環境での動作確認を行う場合の手順です。

### 前提条件
- Python 3.9 以上
- Node.js v18 以上
- PostgreSQL (ローカルまたはSupabase等)

### Step 1: バックエンドの起動
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windowsの場合は venv\Scripts\activate
pip install -r requirements.txt

# DBスキーマの反映とPrismaクライアント生成
prisma db push
prisma generate

# FastAPIサーバーの起動 (デフォルトで http://localhost:8000 )
uvicorn app.main:app --reload
```

### Step 2: フロントエンドの起動
別のターミナルを開き、フロントエンドを起動します。
```bash
cd frontend
npm install

# ローカル環境変数の設定 (.env.localを作成し、必要に応じてWS/APIのURLを指定)
# NEXT_PUBLIC_API_URL=http://localhost:8000/api
# NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws

# Next.jsサーバーの起動 (デフォルトで http://localhost:3000 )
npm run dev
```

---

## 📚 ドキュメント一覧

システムの詳細な仕様や設計については、`docs/` フォルダ内の資料をご参照ください。

- [使い方ガイド](docs/使い方ガイド.md) - 当日のより詳細な操作マニュアル
- [要件定義書](docs/要件定義書.md) - システム全体が満たすべき機能要件
- [アーキテクチャ設計書](docs/アーキテクチャ設計書.md) - 通信やインメモリ/DBの構成
- [API・WebSocket仕様書](docs/API・WebSocket仕様書.md) - REST APIとWebSocketイベント詳細
- [デプロイ手順書](docs/デプロイ手順書.md) - Render/Vercel/Supabaseへの本番配備手順
