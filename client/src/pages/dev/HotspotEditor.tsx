/** 開発専用：集合絵上のヒロイン選択領域を%座標で編集し、設定JSONを出力する。 */
import { useMemo, useRef, useState } from "react";
import { heroineCollections, type Hotspot } from "@/data/heroineCollections";
import { heroines } from "@/data/heroines";

type DraftMap = Record<string, Hotspot>;
type DragState = { mode: "create" | "move" | "resize"; slug: string; x: number; y: number; origin?: Hotspot } | null;
const clamp = (value: number) => Math.max(0, Math.min(100, value));

export default function HotspotEditor() {
  const collection = heroineCollections.find((item) => item.display === "spotlight-group");
  const stageRef = useRef<HTMLDivElement>(null);
  const [selectedSlug, setSelectedSlug] = useState(collection?.entries[0]?.heroineSlug ?? "");
  const [drag, setDrag] = useState<DragState>(null);
  const [drafts, setDrafts] = useState<DraftMap>(() => Object.fromEntries((collection?.entries ?? []).flatMap((entry) => entry.hotspot ? [[entry.heroineSlug, entry.hotspot] as const] : [])));
  const output = useMemo(() => JSON.stringify(Object.fromEntries(collection?.entries.map((entry) => [entry.heroineSlug, drafts[entry.heroineSlug]]) ?? []), null, 2), [collection, drafts]);
  if (!collection?.image) return null;

  const point = (event: React.PointerEvent) => {
    const rect = stageRef.current!.getBoundingClientRect();
    return { x: clamp(((event.clientX - rect.left) / rect.width) * 100), y: clamp(((event.clientY - rect.top) / rect.height) * 100) };
  };
  const update = (slug: string, hotspot: Hotspot) => setDrafts((items) => ({ ...items, [slug]: hotspot }));
  const beginCreate = (event: React.PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest(".dev-hotspot")) return;
    const start = point(event); update(selectedSlug, { x: start.x, y: start.y, width: 1, height: 1 }); setDrag({ mode: "create", slug: selectedSlug, ...start }); event.currentTarget.setPointerCapture(event.pointerId);
  };
  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!drag) return;
    const current = point(event); const origin = drafts[drag.slug] ?? { x: drag.x, y: drag.y, width: 1, height: 1 };
    if (drag.mode === "create") {
      const width = Math.max(1, Math.abs(current.x - drag.x)); const height = Math.max(1, Math.abs(current.y - drag.y));
      update(drag.slug, { x: Math.min(drag.x, current.x) + width / 2, y: Math.min(drag.y, current.y) + height / 2, width, height });
    }
    if (drag.mode === "move" && drag.origin) update(drag.slug, { ...drag.origin, x: clamp(drag.origin.x + current.x - drag.x), y: clamp(drag.origin.y + current.y - drag.y) });
    if (drag.mode === "resize" && drag.origin) update(drag.slug, { ...drag.origin, width: Math.max(1, clamp(drag.origin.width + (current.x - drag.x) * 2)), height: Math.max(1, clamp(drag.origin.height + (current.y - drag.y) * 2)) });
  };
  const copy = async () => navigator.clipboard.writeText(output);

  return <main className="dev-page"><header className="dev-page__header"><p>開発専用／P0-2</p><h1>ヒロイン選択領域エディタ</h1><span>公開版には含まれません。人物を選んで集合絵上をドラッグしてください。</span></header><div className="dev-editor-layout">
    <aside className="dev-panel"><h2>キャラクターを割り当て</h2>{collection.entries.map((entry) => { const heroine = heroines.find((item) => item.slug === entry.heroineSlug)!; return <button key={entry.heroineSlug} className={selectedSlug === entry.heroineSlug ? "is-selected" : ""} onClick={() => setSelectedSlug(entry.heroineSlug)}>{heroine.name}</button>; })}<p>空白をドラッグで新規領域。既存枠はドラッグ移動、右下の丸で拡大縮小。</p></aside>
    <section className="dev-stage-wrap"><div ref={stageRef} className="dev-hotspot-stage" onPointerDown={beginCreate} onPointerMove={move} onPointerUp={() => setDrag(null)}><img src={collection.image} alt="編集対象の集合絵" />{Object.entries(drafts).map(([slug, spot]) => { const heroine = heroines.find((item) => item.slug === slug)!; return <div key={slug} className={`dev-hotspot ${selectedSlug === slug ? "is-selected" : ""}`} style={{ left: `${spot.x - spot.width / 2}%`, top: `${spot.y - spot.height / 2}%`, width: `${spot.width}%`, height: `${spot.height}%` }} onPointerDown={(event) => { event.stopPropagation(); const start = point(event); setSelectedSlug(slug); setDrag({ mode: "move", slug, ...start, origin: spot }); event.currentTarget.setPointerCapture(event.pointerId); }}><span>{heroine.name}</span><button aria-label={`${heroine.name}の領域を拡大縮小`} onPointerDown={(event) => { event.stopPropagation(); const start = point(event); setDrag({ mode: "resize", slug, ...start, origin: spot }); }} /></div>; })}</div></section>
    <aside className="dev-panel dev-output"><h2>設定JSON</h2><textarea readOnly value={output} /><button className="dev-copy" onClick={copy}>JSONをコピー</button></aside>
  </div></main>;
}
