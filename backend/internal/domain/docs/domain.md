Job Application Management — ドメイン概要

目的:
  - 応募企業・選考予定・面接準備メモを一元管理し、「今日やるべきこと」を即座に取り出せるようにする。

主要集約/エンティティ:
  - Company
      id, name, recruitment_url?, industry?, location?
      マスタ的に扱い、ユーザーごとの Application から参照される。

  - Application (集約ルート)
      id, user_id, company_id, category{Main, Intern, Info},
      status{ToDo, Scheduled, InProgress, Done, Withdrawn},
      scheduled_at, color_tag, completed(bool, UI互換用), created_at, updated_at
      child: SelectionStage[]
      value: ApplicationNote

  - SelectionStage (可変ステップを扱う場合)
      id, application_id, name(ES/一次/二次/最終/内々定/内定),
      scheduled_at, status{Pending, Passed, Failed}, notes
      Application 集約に内包させ、同一トランザクションで更新する。

  - ApplicationNote (Value Object)
      motivation, what_to_do (入社後やりたいこと),
      job_axis (就活の軸), strengths (活かせる強み)

  - Reminder (将来)
      target_at, channel{in-app,email}, message
      リマインド送信は別コンテキストでも良い。

値オブジェクト:
  - Category: 本選考/Main | インターン/Intern | 説明会/Info
  - Status: ToDo → Scheduled → InProgress → Done / Withdrawn
  - ColorTag: UIに合わせた limited set (e.g. orange | purple)
  - Schedule: 日付または日時。タイムゾーンを保持する実装を推奨。

ビジネスルール / 不変条件:
  - user + company + category の組み合わせ重複を禁止または警告。
  - Status は定義済み遷移のみ許可 (Done/Withdrawn は終端)。
  - scheduled_at は現在時刻より過去を禁止（履歴入力機能を作るなら別 API）。
  - SelectionStage は Application に従属し、時系列順で保持。

ドメインサービス案:
  - ApplicationScheduler: 予定の重複/衝突検知。
  - ProgressPolicy: Status 遷移のバリデーション。
  - ReminderService (将来): リマインド生成と送信キュー投入。

ドメインイベント例:
  - ApplicationAdded
  - ApplicationUpdated
  - StatusChanged
  - NoteUpdated
  - SelectionStageScheduled
  - ReminderTriggered

API 最小セット（フロントの現在 UI を満たす範囲）:
  - POST /companies {name, recruitment_url?}
  - GET  /companies
  - POST /applications {company_id, category, status, scheduled_at, color_tag}
  - GET  /applications?date=today           // 今日のタスク表示用
  - GET  /applications?category&status&from&to
  - PUT  /applications/{id} {status?, scheduled_at?, color_tag?}
  - PUT  /applications/{id}/notes {motivation, what_to_do, job_axis, strengths}
  - DELETE /applications/{id}
  - (将来) POST /applications/{id}/stages, PUT /applications/{id}/stages/{stageId}
  - (将来) POST /applications/{id}/reminders

実装優先度（短期）:
  1) Company CRUD（name, recruitment_url）
  2) Application CRUD + Status 遷移バリデーション
  3) ApplicationNote 保存/更新
  4) 「今日のタスク」用 date フィルタ付きクエリ
  5) SelectionStage (任意)
  6) Reminder (任意・後回し)