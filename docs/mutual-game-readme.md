# 「助手・鳴海の推理ゲーム（仮）」編集ガイド

ゲーム本体は`client/public/mutual/index.html`だけで完結しています。CSS、HTML、JavaScript、キャラクターマスタ、事件データ、判定セリフが1ファイルにまとまっているため、Cloudflare Pagesへそのまま配信できます。

## 編集の入口

`<script>`先頭の`CHARACTER_MASTER`、`CASE_DATA`、`VERDICT_LINES`を編集します。現在のキャラ名、属性、世代、台詞は仮置きです。正式データが届いたら、各キャラの`name`、`generation`、`trait`、`icon`を更新してください。ゲームタイトルは`<title>`・OGP・タイトル画面・X共有文に記載しているため、正式名称が決まったら合わせて置換してください。

| データ | 変更箇所 | 用途 |
|---|---|---|
| キャラクター | `CHARACTER_MASTER` | 名前、世代、証言用属性、顔クロップ用の画像パス |
| 事件 | `CASE_DATA` | タイトル、導入会話、固定解答、証言、締め会話 |
| 判定会話 | `VERDICT_LINES` | `h2b1`のような判定別セリフ配列 |
| 色 | CSSの`:root` | 背景、罫線、アクセント、影 |

## 正式PNGへ差し替える場合

現在は、既存ちびキャラWebPを`icon`へ設定し、`facePosition`と`faceScale`で**顔部分だけをクロップ表示**しています。各キャラの顔の位置を調整する場合は、この2値を個別に編集してください。

正方形256px以上のPNGまたはWebPを`client/public/mutual/img/`へ追加し、該当キャラの`icon`に`"/mutual/img/char01.webp"`のように記述します。差し替え後も顔クロップにしたい場合は`facePosition`・`faceScale`を残し、画像全体を見せたい場合は両方の設定を削除してCSSの`image-avatar`の`background-size`を調整します。ゲーム操作のため、名前ラベルは残してください。

## 事件を固定する場合

`CASE_DATA.answer`を`"random"`から、キャラクターIDの配列に置き換えます。ノーマルなら4人、イージーで同じ並びを使う場合は先頭3人が利用されます。

```js
answer: ["char03", "char07", "char01", "char09"]
```

## 公開手順

リポジトリのルートで、次を実行します。

```bash
pnpm test
pnpm check
SITE_URL=https://hatsukoi-lab.com pnpm build:web
pnpm verify:web
```

Cloudflare Pagesには`dist/public`の中身をアップロードしてください。公開後は`https://hatsukoi-lab.com/mutual`をiPhone Safari相当とPC Chrome相当で開き、タイトル、イージー、ノーマル、証言、クリア、X共有を確認します。

## 検索とテスト用URL

仮タイトルの期間は、ゲーム本体に`noindex,follow`を設定しています。サイトマップには導線確認用として`/mutual`を含めますが、正式タイトルが確定して検索流入を受け入れる段階で、`client/public/mutual/index.html`の`<meta name="robots" content="noindex,follow">`を削除してください。その後、改めてビルド・Direct Uploadを行い、Search ConsoleでURL検査を実行します。

`?demo=play`はノーマルの推理画面を表示し、`?demo`はイージーのクリア画面を表示する確認用パラメータです。テスト・スクリーンショット・説明用として残しています。通常のURL共有、サイトマップ、検索導線にはクエリを付けず、`https://hatsukoi-lab.com/mutual`を使用してください。
