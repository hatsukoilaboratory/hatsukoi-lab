# 童貞探偵の恋愛嗜好捜査｜編集ガイド

診断ページは `/diagnosis` です。質問・配点・GAME OVER台詞・結果文は、すべて `client/public/diagnosis/` のJSONで管理しています。Reactコンポーネントへ質問文を直接書き込まない運用にしてください。

| ファイル | 用途 | 主な編集箇所 |
|---|---|---|
| `questions.json` | 通常質問63問 | `questions[].prompt`、`options[].label`、`options[].scores`、`enabled` |
| `knockout_questions.json` | 一撃GAME OVER質問5種 | `options[].knockout`、`gameOverKey` |
| `game_over_dialogue.json` | GAME OVERの4コマ風台詞 | `cases[].panels` |
| `characters.json` | 診断対象ヒロイン | `resultTags`、`resultBase`、`ctaLabel` |
| `result_reason_templates.json` | 結果画面の推理メモ | 各ヒロインの `base` と `details` |

既存のヒロイン名・作品名・作品ページURL・立ち絵は、`slug` をキーに `heroines.ts` と `works.ts` から自動で補完します。`characters.json` の `image`、`workTitle`、`workUrl` は未指定のままで問題ありません。

## 質問を追加する

`questions.json` の `questions` に追加します。`id` は重複不可、`enabled` は `true`、各選択肢の `scores` はヒロインslugと点数の組み合わせです。点数は `1`、`2`、`3` を使えます。

```json
{
  "id": "Q999",
  "category": "relationship",
  "prompt": "新しい質問",
  "enabled": true,
  "options": [
    { "id": "Q999_01", "label": "選択肢", "scores": { "ginpatsu": 2, "koito": 1 } }
  ]
}
```

## GAME OVERを変更する

`knockout_questions.json` の肯定側選択肢へ `knockout: true` と `gameOverKey` を設定します。同じキーの会話を `game_over_dialogue.json` の `cases` に必ず追加してください。キーと台詞ケースが一致しない場合、該当ケースは表示されません。

## 動作確認

JSONを編集したら、プロジェクト直下で `pnpm check:data && pnpm check && pnpm build` を実行します。診断中の進行状況はブラウザのLocalStorageに保存され、トップ画面の「前回の捜査を再開する」から復帰できます。

## MVP確認済み項目

通常質問63問・一撃質問5問・ヒロイン9人・GAME OVERケース5件は、`pnpm check:data` で件数・配点先・キー対応を検査します。診断トップとトップページの入口は、390px幅のスマホ表示で確認済みです。
