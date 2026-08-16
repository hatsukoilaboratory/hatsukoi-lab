# 実装確認記録（2026-08-16）

## 画面確認

- `/about-production` をPC・390px幅のスマホで確認した。恋色ノート調の背景・便箋カード・制作ツール一覧が表示され、横スクロールは確認されなかった。
- `/works/ginpatsu` をPC・390px幅のスマホで確認した。ストア購入導線の直下、他ヒロイン導線の直上に「この作品をXで共有する」ボタンが表示された。

## 静的出力確認

- `pnpm build:web`で、9作品分の静的OGP HTMLを生成した。
- `pnpm verify:web`で、15ルート・124アセット・各作品ページのOGP画像とcanonical URLを検証した。
- `dist/public/works/ginpatsu/index.html`に、`https://hatsukoi-lab.com/assets/ogp_ginpatsu.jpg`を含むOGP・Twitterメタデータが出力されていることを確認した。
