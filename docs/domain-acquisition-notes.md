# 独自ドメイン取得メモ

## 推奨方針

Cloudflare Pagesで公開済みの初恋ラボには、Cloudflare Registrarで`hatsukoilab.com`を取得し、そのままCloudflare DNSとPagesへ接続する方法を第一候補とする。Cloudflare Registrarは`.com`を含む多数のTLDを扱い、登録・更新を原価ベースで提供し、WHOIS情報のマスキングとDNSSECを標準で案内している。

## 登録時の重要事項

- 購入前にCloudflare Registrarの検索画面で最終的な空き状況と金額を確認する。
- 登録者情報と確認メールは正確に入力し、ICANNの確認メールを必ず完了する。
- Cloudflare Registrarで取得するドメインはCloudflareネームサーバーを使用する。
- 自動更新を有効にし、Cloudflareアカウントの二要素認証を設定する。

## 公開先

Cloudflare Pagesの現在の公開URLは`https://hatsukoilab.pages.dev/`。
独自ドメイン取得後、Pagesプロジェクトのカスタムドメイン設定から`hatsukoilab.com`と`www.hatsukoilab.com`を接続する。

## 初回設定手順

1. Cloudflareダッシュボードの「Register domains」で`hatsukoilab.com`を検索する。
2. 表示される登録年数・初年度料金・更新料金を確認し、購入前に価格が通常の`.com`登録価格であることを確認する。
3. 連絡先情報と支払い情報を入力し、購入を完了する。登録後に届くICANN確認メールを必ず確認する。
4. Cloudflareの「Workers & Pages」からPagesプロジェクト`hatsukoilab`を開き、「Custom domains」>「Set up a domain」を選択する。
5. `hatsukoilab.com`を追加する。Cloudflare Registrarで取得した場合は、Cloudflare DNSの必要なレコードが自動設定される。
6. 同じ手順で`www.hatsukoilab.com`も追加し、どちらを正規URLにするかを決める。推奨は`https://hatsukoilab.com/`を正規URLとして、`www`からルートドメインへリダイレクトする構成。
7. カスタムドメインのステータスが有効になったら、トップ・`/heroines`・`/diagnosis`・`/commission`・作品ページを開いて確認する。

## 参照先

- https://www.cloudflare.com/products/registrar/
- https://developers.cloudflare.com/registrar/get-started/register-domain/
- https://www.cloudflare.com/learning/dns/how-much-does-a-domain-name-cost/
- https://porkbun.com/products/domains
