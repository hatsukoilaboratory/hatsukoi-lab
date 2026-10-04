# CLAUDE.md — らぶらぶダイスダンジョンズ（らぶダン）

> r0 DRAFT 2026-10-04（Claude 作成・Human 承認待ち）
> Claude Code（クラウド／ローカル）が毎セッション最初に読む申し送り。
> セッションにはプロジェクトの記憶がない。ここに無いことは推測で埋めず、報告で質問として返す。

## 0. セッション開始時に必ずやること

1. `git status` / ブランチ名 / HEAD の SHA を確認し、報告の冒頭に書く。
2. 依頼ファイル `tasks/<ID>.md` を読む。依頼に書かれた範囲だけをやる。
3. 依頼が参照する仕様の写し（`docs/specs/`）を読む。写しが無い・古い疑いがあれば、作業を止めて報告する。

## 1. プロジェクト

- 成人向けローグライトのノベルゲーム。ダイスを振って役を作り、スコアボードに書いた点で敵（ステージごとに1体、HP 制）を倒す。ヒロイン9人、敵の親玉はサキュバスの女王。
- 本番は PC・16:9（1920×1080）。production は単一 HTML（Pyodide）。
- 当面のゴール: 小糸編の体験版（小糸・NORMAL 固定、R18 は E01 のみ、HTML で身内に配布）。
- 最終決定者は Human（初恋ラボ）。採用・仕様の判断は Claude Code が下さない。

## 2. 正本（authority）

- ゲームルールの唯一の正本 = Shared Gameplay Core（GAME_SYSTEM_FEATURE_COMPLETE_V1 の shared_core）。
- その上の presentation adapter（BATTLE_PRESENTATION_INTEGRATION_READINESS_V1）と unlock/profile layer（CHARACTER_UNLOCK_V0_1）を、新しいゲームルールの fork と解釈しない。
- ゲームロジックを Core の外に再実装しない。計測・テストの harness は Core を包んで呼ぶ。
- 戦闘画面は Core を直接呼ばない。外枠（SCR-02 v1.0）を通す。独自の bridge を作らない。
- 仕様文書の正本は Google Drive。`docs/specs/` はその写し。写しと Drive が食い違えば Drive が正。
- コードの正本は GitHub。production として採用された commit は tag で示し、tag は push する。
- 【Human 決定待ち】Drive の deliveries/ への納品（ZIP＋SHA-256）を続けるか、PR＋tag に一本化するか。

ルールや仕様の中身はここに書かない（二重管理を避ける）。`docs/specs/` と Core を見ること。

## 3. 画面に出す言葉（player-facing）

- 「戦闘」「Battle」は画面に出さない。制作語（Gate / fixture / runtime / candidate / debug / test など）も出さない。内部名・ファイル名・レポートでは使ってよい。
- 確定している表記: 連鎖（内部名 chain は変えない）／振り直し（ダイス）／リロール（ショップ）／ヨット／攻撃役・準備役（低目・中目・高目）／同目系・順目系・合計系／小の組・中の組・大の組／熟成／HOLD／攻め・備え／中断・再開（「セーブ・ロード」と呼ばない）／レア度はコモン・アンコモン・レア・エピック・レジェンダリー。
- 金6・0点・形役などのゲーム用語は表記を固定し、かなに開かない。
- 戦闘画面の文字はすべて Shippori Mincho。
- 会話で主人公の台詞は名前欄を空欄にする。

## 4. クラウドで扱わないもの

- 最終の見た目の判定（pixel-perfect）、Windows フォントに依存する ui01、Canvas の文字幅を見る ui09b の照合 → Windows 側。
- 購入素材（ぴぽや・効果音パック・gameUIset_24 など）を repo に新しく追加しない。素材単体の再配布は規約で不可。素材が要る作業は差し替えできる仮素材で進める。
- gameUIset_24_v100（空想曲線）の UI 部品が写った画像・スクリーンショットは、モデルが画像として読まない（生成・編集・解析すべて不可。Human 決定 1WgBTSgM0dW7eohgvE1PgiDcxzLGq9yuw）。見た目の確認が要るときは、その部品を仮素材に置き換えて撮るか、撮影だけして Human の確認に回す。
- R18 の中身（シーン本文・CG の指示・衣装の壊れ方）は扱わない。分岐やシーン枠など流れの仕組みは扱ってよい。
- クラウドの出力で tracked baseline を上書きしない。

## 5. 作業の進め方

- ブランチ: `<タスクID小文字>/<短い説明>`。main へ直接 push しない。PR で出す。
- 仕様にない判断が要るとき: 推奨案で仮に実装し（切り替えは設定1か所で）、選択肢・推奨・理由を報告に書いて Human に返す。黙って決めない。保留のまま止めない。
- 依頼の範囲外で見つけた問題は直さず、報告に「範囲外の気づき」として書く。
- 乱数は seed 固定で再現できる形にする。計測には seed 数を明記する。
- 見た目に関わる変更は `reports/<タスクID>/` にスクリーンショット（必要なら短い動画）を置く。Human がスマホで一次確認するため。
- 計測やテストの結果は要約を `reports/<タスクID>/summary.md` に書く。重い生データは commit しない。
- 長いテストはバッチに分けてよいが、結果は1つの要約にまとめる。

## 6. 報告（PR 本文と最後の返答に同じものを書く）

1. ブランチ / HEAD SHA / 変更したファイル
2. やったこと・テスト結果（件数、PASS/FAIL）
3. Human の判断が要る点（選択肢と推奨）
4. Windows で確認が要る点
5. 範囲外の気づき

最後に必ず次を付ける:

```
【ボール報告】
スレ: <タスクID>（Claude Code クラウド）
終わったこと:
いま持っている:
次に渡す先:
```

## 7. この repo について（初回セッションが埋める）

> 初回セッション（2026-10-04、HEAD `6e84676`）で実際に確認した内容。確認できなかったものは「不明」と書き、推測で埋めていない。

### 最重要: この repo はらぶダンのゲーム本体ではない

この repo（`hatsukoilaboratory/hatsukoi-lab`）は **初恋ラボ公式サイト**（同人サークルのサイト）のソースとアセットのバックアップ。らぶダン本体のコードや仕様は、確認した範囲では存在しない。

- Shared Gameplay Core、presentation adapter、unlock/profile layer、SCR-02、Pyodide を使ったコードは無い（「らぶダン」「Pyodide」「shared_core」「fixture」で全文検索して 0 件）。
- `docs/specs/`、`tasks/`、`reports/` は無い。§0 の手順 2・3 はこの repo では実行できない。
- したがって §2〜§5 のゲーム固有の規則は、この repo の作業には直接かからない。らぶダンの作業が来たら、どの repo が対象か Human に確認する。【Human 決定待ち】らぶダン本体の repo はどこか。この repo に置く予定か。

### ディレクトリ構成の要点

- `client/` — React 19 + Vite + wouter + Tailwind 4 の SPA。`client/src/pages/`（Home / HeroineList / Diagnosis / Fun / Commission / AboutProduction など）、`client/src/data/`（`works.ts`、`heroines.ts`、`diagnosis.ts` ほか）、`client/src/pages/dev/`（制作用の補助画面）。
- `client/public/` — 静的配信物。`assets/`（画像）、`diagnosis/`、`mutual/`（後述のミニゲーム）、`_redirects`、`robots.txt`、`sitemap.xml`。
- `scripts/` — データ検証、SEO / OGP の静的 HTML 生成、静的ビルド検証、画像変換（Python）。
- `server/index.ts` — 静的配信用の Express。`shared/const.ts` — 共有定数。
- `docs/` — 公開前確認・Cloudflare 更新手順などの運用メモ。`README.md` に Cloudflare Pages への公開手順がある。
- `STRUCTURE.md` / `MEMORY.md` / `PLAN.md` / `ASSETS.md` — 「両想いとすれ違い」ミニゲームの構成・経緯・計画。
- `reward-spec-input/` — ご褒美 CG の実装指示書と素材。

### production の入口ファイル

- サイト: `client/index.html` → `client/src/main.tsx`。ビルド後は `dist/public/` を Cloudflare Pages へ Direct Upload する（GitHub への push だけでは本番は更新されない。README 参照）。
- ミニゲーム「両想いとすれ違い」: `client/public/mutual/index.html`（単一ファイル、`/mutual` で配信）。推理ロジックは `client/public/mutual/investigation-engine.js`。
- らぶダンの production 入口（単一 HTML）: 不明（この repo に無い）。

### テスト・計測のコマンド

パッケージマネージャは pnpm（`package.json` の `packageManager` に従う。確認時は pnpm 10.4.1 / Node 22）。

```bash
pnpm install --frozen-lockfile
pnpm test          # vitest run
pnpm check         # tsc --noEmit
pnpm check:data    # 作品・ヒロイン・診断データの整合性検証
SITE_URL=https://hatsukoi-lab.com pnpm build:web   # 静的ビルド（dist/public）
pnpm verify:web    # ビルド結果の検証
```

- 2026-10-04 の確認結果: `pnpm check` と `pnpm check:data` は PASS。`pnpm test` は 36 件中 35 PASS・1 FAIL。FAIL は `client/src/debug-verification-secret.test.ts` で、環境変数 `DEBUG_VERIFICATION_MODE=external-read-only` が未設定のため。外部サイト（`hatsukoi-lab.com`）へ通信するテストなので、クラウドでは設定していない。この FAIL は今回の変更とは無関係（既存）。
- 乱数計測・seed を使うコマンド: 不明（この repo に無い）。

### fixture repo とその取得方法

不明。この repo に fixture への参照は無い。らぶダン側の作業が来たとき、Human に取得方法を確認する。

### クラウド用セットアップ

- `.claude/` の設定・SessionStart hook は無い。毎セッション `pnpm install --frozen-lockfile` が必要（約 5 秒）。
- pnpm が「Ignored build scripts: @tailwindcss/oxide, esbuild」と警告するが、上のコマンドはそのまま動いた。
- `.env` 系・秘密情報は repo に置かない（`.gitignore` 済み）。

### 既知のクラウドと Windows の差

不明。この repo の作業では、まだ両者の差を確認していない。ミニゲームの見た目は 390px 幅と 1280px 幅で確認する運用が `MEMORY.md` にある。
