# 「鳴海からの挑戦状」編集ガイド

ゲーム本体は`client/public/mutual/index.html`だけで完結しています。CSS、HTML、JavaScript、キャラクターマスタ、導入会話、ヒント、道庭との接点が1ファイルにまとまっており、Cloudflare Pagesへ静的配信できます。

## 編集するデータ

`<script>`先頭の`CHARACTER_MASTER`を編集します。各キャラクターには画面表示用の`name`・`icon`・顔クロップ用の`facePosition`／`faceScale`、任意の後日追加用`gift: null`、3段階の`hints`、リザルト・コレクション用の`connection`を置いています。

| データ | 編集箇所 | 用途 |
|---|---|---|
| キャラクター | `CHARACTER_MASTER` | 名前、画像、顔クロップ、ヒント、接点、将来用の差し入れ欄 |
| 導入会話 | `INTRO` | タイトルから人数選択へ進む会話 |
| 鳴海リアクション | `verdictLine()` | HIT / BLOWごとの判定リアクション |
| 色と余白 | CSSの`:root`および各クラス | 背景、罫線、アクセント、画面サイズ |

ヒントはボタンを押すたびに、正解に含まれる別キャラクターの`hints`を1段階ずつ使います。位置・正解そのものが露出しないよう、ヒント文の差し替え時もこの方針を守ってください。

## コレクションと抽選

クリアした回に登場したヒロインは、ブラウザの`localStorage`へ発見済みとして保存されます。未発見キャラクターがいる間は、各回の解答に最低1人を優先して含める設計です。コレクションの保存確認は、クリア後にページを再読み込みして`先生との縁`を開いてください。

## 公開手順

リポジトリのルートで次を実行します。

```bash
pnpm test
pnpm check
SITE_URL=https://hatsukoi-lab.com pnpm build:web
STATIC_TEST_ORIGIN=http://127.0.0.1:4173 pnpm verify:web
```

Cloudflare Pagesには`dist/public`の**中身**をアップロードしてください。公開後は、`/mutual`でタイトル・導入・3人／4人モード・任意ヒント・履歴・リザルト・コレクション・X共有をスマホとPCで確認します。

`?demo=play`は4人モードのゲーム盤、`?demo`は3人モードのリザルトを直接表示する確認用パラメータです。ゲーム本体は現時点で`noindex,follow`のため、検索公開するときは`<meta name="robots" content="noindex,follow">`を削除してから再ビルドしてください。
