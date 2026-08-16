# Xカードのキャッシュ確認メモ

2026-08-16に`https://hatsukoi-lab.com/diagnosis/result/bokukko`と`/diagnosis/gameover`の本番HTMLを直接確認した。各ページは結果別の`og:title`、`og:url`、`og:image`、`twitter:image`、canonical URLを返している。

Xに古い灰色のリンクカードが表示される場合、サイト側のOGP未設定ではなく、Xが同じURLで取得済みのカード情報をキャッシュしている可能性がある。投稿時は更新済みURLに`?v=20260816`のような任意のクエリを一つ付与すると、Xが別URLとして新たに取得する回避策になる。

例:

`https://hatsukoi-lab.com/diagnosis/result/bokukko?v=20260816`

XのDeveloper Communityでは、カード情報のキャッシュが残る場合に変更したURLパラメータを使う方法が案内されている。

- https://devcommunity.x.com/t/twitter-summary-cards-are-they-cached/18345
- https://devcommunity.x.com/t/without-validator-anymore-how-are-we-supposed-to-re-cache-a-links-card-image/183993
