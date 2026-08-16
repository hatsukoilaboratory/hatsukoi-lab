# Cloudflare Pages 更新ガイド

## 現在の公開先

- 正式URL: `https://hatsukoi-lab.com/`
- Pagesプロジェクト名: `hatsukoilab`
- 公開方式: Cloudflare Pages Direct Upload

## 内容を更新するときの流れ

1. 変更したい内容をManusへ依頼する。例: 「作品ページに新作を追加」「ヒロイン紹介の画像を差し替え」「販売リンクを更新」。
2. Manus側でサイトを修正し、動作確認済みのCloudflareアップロード用ZIPを受け取る。
3. Cloudflareダッシュボードで **Workers & Pages** > **hatsukoilab** > **Deployments** を開く。
4. **Create a new deployment** を選び、環境として **Production** を選択する。
5. 受け取ったZIPをアップロードし、**Save and Deploy** を押す。
6. `https://hatsukoi-lab.com/` を開き、変更内容を確認する。

## 注意事項

- ZIP内は`index.html`と`assets/`が最上位にある公開用ZIPを使う。プロジェクト全体のソースZIPはアップロードしない。
- 更新前の公開版はCloudflareのDeployments一覧から確認できる。表示に問題があった場合は、直前の正常なデプロイへ戻せる。
- Direct Uploadプロジェクトは、後からGit連携へ切り替えられない。将来GitHubから自動デプロイしたくなった場合は、新しいPagesプロジェクトを作り、独自ドメインを新プロジェクトへ移す。
- 今回のサイトは静的サイトなので、Cloudflare上でビルドコマンドを設定する必要はない。Manusが作成する公開用ZIPをアップロードする。

## よく使う依頼例

- 「新作を追加して、Cloudflare公開用ZIPも作って」
- 「DLsiteのURLを差し替えて、公開用ZIPを更新して」
- 「トップの告知文を変えて、公開までの手順を教えて」

## 参照

- https://developers.cloudflare.com/pages/get-started/direct-upload/
