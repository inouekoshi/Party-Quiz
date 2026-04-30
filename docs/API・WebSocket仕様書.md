# API・WebSocket仕様書

本ドキュメントでは、フロントエンドとバックエンド間でやり取りされるREST APIおよびWebSocketの仕様を定義します。

## 1. 共通ベースURL
- 開発環境： `http://127.0.0.1:8000/api`
- 本番環境： デプロイ先のドメイン `/api`

---

## 2. REST API 仕様

### 2.1. チーム関連

#### `POST /teams`
新規チームの登録、または既存チームのパスコード検証。

- **リクエストボディ**:
  ```json
  {
    "name": "string",
    "passcode": "string"
  }
  ```
- **レスポンス (200 OK)**:
  登録済みの `Team` モデル情報。
- **レスポンス (400 Bad Request)**:
  チーム名重複・パスコードエラーの場合などに返却。

#### `GET /teams`
登録されている全チームの情報を、現在のスコアが高い順に取得する。

- **レスポンス**:
  ```json
  [
    { "id": 1, "name": "TeamA", "score": 250, "passcode": "..." },
    ...
  ]
  ```

### 2.2. 問題関連

#### `GET /questions`
データベースに登録されているすべての問題およびその選択肢の取得。
プロジェクター用の詳細表示などに使用。

- **レスポンス**:
  ```json
  [
    {
      "id": 1,
      "text": "中学校の思い出の場所は？",
      "type": "normal",
      "timeLimit": 30,
      "options": [
        { "id": 10, "text": "図書室", "order": 1 }
      ]
    }
  ]
  ```

### 2.3. 解答提出

#### `POST /answers`
参加者が問題に対する解答を送信する。ベッティング倍率と、解答にかかった時間を含む。

- **リクエストボディ**:
  ```json
  {
    "team_id": 1,
    "question_id": 1,
    "option_id": 10,
    "bet": 2, // 1, 2, or 3
    "time_taken": 4.52 // 秒単位ミリセカンド精度
  }
  ```
- **バリデーション**:
  現在受付中の問題ID（`state.current_question_id`）と一致しない場合、または状態が `answering` 以外の場合は弾かれる(400 Error)。

### 2.4. 管理者制御用

#### `POST /admin/start/{question_id}`
特定のクイズの出題を開始する。WebSocket経由で全員に通知される。

#### `POST /admin/reveal/{question_id}`
解答の受付を締め切り、採点を実行し、WebSocket経由で結果と最新ランキングを全員に通知する。

---

## 3. WebSocket 仕様

全クライアントは起動時に `ws://<HOST>/ws` へ接続し、WebSocketManagerによって一元管理されます。
サーバーからはJSON形式の文字列がBroadcastされます。

### 3.1. 問題開始イベント
管理者が `start` APIを叩いた際に発火。
参加者画面はこの信号を受けてタイマー計測を開始します。
```json
{
  "event": "question_started",
  "data": {
    "question_id": 1
  }
}
```

### 3.2. フルリザルト発表イベント
管理者が `reveal` APIを叩いた際に発火。採点が完了し最新の順位情報を含みます。
プロジェクター画面はこのデータを使ってランキングアニメーションを描画します。
```json
{
  "event": "answer_revealed",
  "data": {
    "question_id": 1,
    "question_type": "normal",
    "correct_option": 1,
    "leaderboard": [
      { "id": 1, "name": "TeamA", "score": 350 },
      { "id": 2, "name": "TeamB", "score": 100 }
    ]
  }
}
```