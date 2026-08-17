# Mini Game Structure

ゲーム本体は`client/public/mutual/index.html`の単一ファイルであり、外部JavaScript・画像・ライブラリには依存しない。

| 領域 | 役割 |
|---|---|
| `CHARACTER_MASTER` | 9人分の仮名、世代、属性、将来差し替えるPNGパス |
| `CASE_DATA` | 事件名、導入会話、固定またはランダム解答、証言、締め会話 |
| `VERDICT_LINES` | `h{hit}b{blow}`キーごとの道庭セリフ配列 |
| `state` | 難易度、解答、現在の配置、履歴、解放済み証言、手数 |
| `render*` | タイトル・導入・推理・クリア画面のDOM描画 |
| `submitGuess` | 両想い／すれ違いの計算、履歴追加、証言解放、クリア遷移 |

ゲームを追加したい場合は`/mutual`の静的ルートを保ち、ビルド後の`dist/public/mutual/index.html`をCloudflareへ配信する。
