/** 開発専用：ちびキャラを横並びで比較し、視覚サイズの手動調整値を出力する。 */
import { useMemo, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { chibiVisualSizes } from "@/data/chibiSizes";
import { heroines } from "@/data/heroines";

export default function ChibiSizeEditor() {
  const [sizes, setSizes] = useState(chibiVisualSizes);
  const output = useMemo(() => JSON.stringify(sizes, null, 2), [sizes]);
  const copy = async () => navigator.clipboard.writeText(output);
  return <main className="dev-page"><header className="dev-page__header"><p>開発専用／P0-3</p><h1>ちびキャラの視覚サイズ調整</h1><span>透明余白ではなく、画面上での存在感を横並び比較して調整します。</span></header><section className="dev-chibi-grid">{heroines.map((heroine) => <article key={heroine.slug} className="dev-chibi-card"><div className="dev-chibi-preview"><img src={heroine.chibiImage} alt={`${heroine.name}のちびキャラ`} style={{ width: sizes[heroine.slug], height: sizes[heroine.slug] }} /></div><h2>{heroine.name}</h2><p>現在の表示サイズ：<b>{sizes[heroine.slug]}px</b></p><div className="dev-slider-row"><button onClick={() => setSizes((items) => ({ ...items, [heroine.slug]: Math.max(110, items[heroine.slug] - 2) }))}>−</button><Slider min={110} max={220} step={1} value={[sizes[heroine.slug]]} onValueChange={([value]) => setSizes((items) => ({ ...items, [heroine.slug]: value }))} /><button onClick={() => setSizes((items) => ({ ...items, [heroine.slug]: Math.min(220, items[heroine.slug] + 2) }))}>＋</button></div></article>)}</section><section className="dev-output-wide"><h2>chibiVisualSizes 用設定値</h2><textarea readOnly value={output} /><button className="dev-copy" onClick={copy}>設定値をコピー</button></section></main>;
}
