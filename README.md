# 初恋ラボ公式サイト

## このリポジトリの位置づけ

このリポジトリは、同人サークル「初恋ラボ」公式サイトの**ソースコードとアセットのバックアップ**です。GitHub上の`main`ブランチは履歴管理と復旧を目的としており、GitHubへのpushだけで公開サイトが更新される構成ではありません。

本番公開は、現在もCloudflare Pagesの**Direct Upload**で行います。Cloudflare Pagesの公開プロジェクト、`hatsukoi-lab.com`の独自ドメイン、301リダイレクト設定を変更せず、ビルドで生成した`dist/public`の中身をCloudflare Pagesへアップロードしてください。

## 必要な環境

Node.jsとpnpmを使用します。リポジトリの`package.json`に記載されたpnpmのバージョンを優先してください。

```bash
pnpm install
```

環境変数ファイルや秘密情報はリポジトリへ追加しないでください。`.gitignore`では、`node_modules`、`dist`、`.manus`、`.manus-logs`、`client/public/__manus__`、`.env`系ファイルなどを除外しています。

## 本番静的ビルド

公開URLを指定して、次のコマンドをリポジトリのルートで実行します。

```bash
SITE_URL=https://hatsukoi-lab.com pnpm build:web
```

`build:web`は、データ検証、アセットマニフェスト生成、Viteビルド、共通SEO HTML、作品別OGP HTML、診断共有用OGP HTMLを順番に生成します。完成した静的サイトは次のディレクトリに出力されます。

```text
dist/public
```

ビルド前後の最低限の確認には、次のコマンドを使用します。

```bash
pnpm test
pnpm check
SITE_URL=https://hatsukoi-lab.com pnpm build:web
pnpm verify:web
```

必要に応じて、公開前にローカルの静的プレビューを起動できます。

```bash
pnpm preview:web
```

別のターミナルで`http://localhost:4173/`を開いて確認してください。

## Cloudflare Pagesへのアップロード

Cloudflareの管理画面で、**Workers & Pages → `hatsukoilab` → Deployments → Create a new deployment → Production**へ進みます。公開用ZIPを選択する場合は、`dist/public`の**フォルダそのものではなく、その中身**をZIPにしてください。

ZIPを開いたときに、最上位へ次のように見える状態が正しい構成です。

```text
index.html
about/index.html
heroines/index.html
diagnosis/index.html
works/<slug>/index.html
assets/
robots.txt
sitemap.xml
```

`dist`フォルダ全体をアップロードしたり、ソースリポジトリ全体をCloudflareへアップロードしたりしないでください。アップロード後はProductionデプロイが完了するまで待ち、`https://hatsukoi-lab.com/`と主要ルートを確認します。Cloudflare PagesのDirect Uploadに関する基本設定は、公式ドキュメントも参照してください。[1]

## 新作を追加するときの更新箇所

新作の追加では、作品データ、ヒロインデータ、Web表示用アセット、OGP、静的生成結果を同じslugで揃えます。既存作品の並びと命名規則を先に確認し、販売リンクや画像URLの対応を取り違えないようにしてください。

| 更新対象 | 主なファイル・場所 | 更新内容 |
|---|---|---|
| 作品情報 | `client/src/data/works.ts` | `slug`、タイトル、レーティング、概要、販売リンク、サンプル画像、OGP画像を追加 |
| ヒロイン情報 | `client/src/data/heroines.ts` | `slug`、名前、性格、タグ、プロフィール、`bustImage`、`standingImage`、必要な表示画像を追加 |
| サンプル画像 | Web配信用の`client/public/assets/` | 作品ページ用の全年齢サンプルをWebP等の配信用形式で追加し、`works.ts`の`sampleImages`へ登録 |
| OGP画像 | Web配信用の`client/public/assets/` | 作品slugに対応するOGP画像を追加し、`works.ts`の`ogpImage`へ登録 |
| SEO静的HTML | 自動生成 | 手作業で`dist/public`を編集せず、ビルド時の生成スクリプトで作り直す |

作品ページの画像パスは、公開HTML上では`/assets/...`になります。元画像を直接原寸配信せず、スマートフォンでの表示を考慮したWebP画像を使用してください。サンプル画像は全年齢表示の範囲を維持し、成人向け作品の場合もサイト内のサムネイル・OGP・サンプルに不適切な画像を使用しないでください。

データ追加後は、次の順で検証します。

```bash
pnpm check:data
pnpm test
SITE_URL=https://hatsukoi-lab.com pnpm build:web
pnpm verify:web
```

作品別OGPや診断共有URLの静的HTMLは、`pnpm build:web`の中で生成されます。手動で生成済みHTMLだけを編集すると、次回ビルドで上書きされるため避けてください。

## 更新後の確認項目

### 表示とルーティング

PC幅とスマートフォン幅の両方で、トップ、ヒロイン一覧、診断、依頼、About、追加した作品ページを確認します。作品ページは、ブラウザへURLを直接入力した場合と、ページをリロードした場合の両方で表示できることを確認してください。

最低限、次のURLを確認します。

```text
https://hatsukoi-lab.com/
https://hatsukoi-lab.com/heroines
https://hatsukoi-lab.com/diagnosis
https://hatsukoi-lab.com/commission
https://hatsukoi-lab.com/about
https://hatsukoi-lab.com/works/<new-slug>
https://hatsukoi-lab.com/sitemap.xml
```

新作ページでは、ヒロイン画像、タイトル、あらすじ、サンプルビューア、販売リンク、X共有ボタン、フッターへの戻り導線を確認します。画像の見切れ、404、横スクロール、リンク先の作品取り違えがないことも確認してください。

### OGPとSNS共有

作品ページと診断共有ページのOGP確認には、XのCard Validatorまたは利用可能なカードプレビュー機能を使います。Card Validatorの提供状況やキャッシュの影響で、更新直後に古い結果が表示される場合があります。その場合は、URL末尾に`?v=YYYYMMDD`のようなクエリを付けて再取得し、タイトル、説明文、画像、リンク先を確認してください。

また、次のHTML要素をページソースで確認します。

```html
<link rel="canonical" href="https://hatsukoi-lab.com/..." />
<meta property="og:url" content="https://hatsukoi-lab.com/..." />
```

canonicalと`og:url`は、確認しているページ自身のURLになっている必要があります。作品ページではGoogleのリッチリザルトテストでパンくずリストが検出されることも確認します。[2] [3]

### Cloudflare公開確認

Cloudflare PagesのデプロイがProductionとして完了した後、独自ドメインで変更が反映されていることを確認します。`pages.dev`側のURLをテストする場合は、301リダイレクトによって同じパスの`hatsukoi-lab.com`へ移動すること、クエリ文字列が必要に応じて保持されることを確認してください。

## 通常の更新フロー

通常の更新は、次の流れで行います。

```text
1. GitHubへソース変更をバックアップする
2. pnpm test と pnpm check を実行する
3. SITE_URL=https://hatsukoi-lab.com pnpm build:web を実行する
4. pnpm verify:web で静的出力を検証する
5. dist/publicの中身をZIP化する
6. Cloudflare PagesのProductionへDirect Uploadする
7. 主要ルート、OGP、画像、販売リンクを公開後に確認する
```

GitHubの`main`更新とCloudflare Pagesの公開は別の操作です。バックアップをpushしただけでは本番サイトは変わりません。公開内容を変更するときだけ、検証済みの`dist/public`をDirect Uploadしてください。

## References

[1]: https://developers.cloudflare.com/pages/get-started/direct-upload/ "Cloudflare Pages: Direct Upload"
[2]: https://developers.google.com/search/docs/appearance/structured-data/breadcrumb "Google Search Central: Breadcrumb structured data"
[3]: https://search.google.com/test/rich-results "Google Rich Results Test"
