/**
 * 初恋ラボのトップ専用ちびキャラ演出。「ふわり恋色ノート」に沿って、中央のメッセージを避け、描画領域の差を個別サイズ補正して静かに現れる。
 */
import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { heroines } from "@/data/heroines";
import { chibiVisualSizes } from "@/data/chibiSizes";

type ActiveChibi = {
  id: number;
  heroineId: number;
  slotId: string;
  side: "left" | "right";
  offset: number;
  vertical: "top" | "bottom";
  verticalOffset: number;
  duration: number;
};

type ChibiSlot = {
  id: string;
  side: "left" | "right";
  offset: number;
  vertical: "top" | "bottom";
  verticalOffset: number;
  band: "top" | "bottom";
};

// 中央のサークル名・キャッチコピー・CTAを避け、上下端の安全マージン内へ分散する。
const chibiSlots: ChibiSlot[] = [
  { id: "top-left", side: "left", offset: 2, vertical: "top", verticalOffset: 0, band: "top" },
  { id: "top-right", side: "right", offset: 2, vertical: "top", verticalOffset: 0, band: "top" },
  { id: "bottom-left", side: "left", offset: 2, vertical: "bottom", verticalOffset: 18, band: "bottom" },
  { id: "bottom-right", side: "right", offset: 2, vertical: "bottom", verticalOffset: 18, band: "bottom" },
];

const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];
const randomBetween = (min: number, max: number) => Math.round(min + Math.random() * (max - min));

function pickDispersedSlot(activeChibis: ActiveChibi[], previousSlotId: string | null): ChibiSlot | null {
  const availableSlots = chibiSlots.filter((slot) => !activeChibis.some((chibi) => chibi.slotId === slot.id));
  if (!availableSlots.length) return null;
  if (!previousSlotId) return pick(availableSlots);

  const previousSlot = chibiSlots.find((slot) => slot.id === previousSlotId);
  if (!previousSlot) return pick(availableSlots);

  const oppositeSide = availableSlots.filter((slot) => slot.side !== previousSlot.side);
  const oppositeBand = oppositeSide.filter((slot) => slot.band !== previousSlot.band);
  return pick(oppositeBand.length ? oppositeBand : oppositeSide.length ? oppositeSide : availableSlots);
}

function createChibi(usedIds: number[], activeChibis: ActiveChibi[], previousSlotId: string | null): ActiveChibi | null {
  const available = heroines.filter((heroine) => !usedIds.includes(heroine.id));
  const slot = pickDispersedSlot(activeChibis, previousSlotId);
  if (!available.length || !slot) return null;
  const heroine = pick(available);

  return {
    id: Date.now() + Math.round(Math.random() * 10000),
    heroineId: heroine.id,
    slotId: slot.id,
    side: slot.side,
    offset: slot.offset,
    vertical: slot.vertical,
    verticalOffset: slot.verticalOffset,
    duration: randomBetween(4500, 7000),
  };
}

export function ChibiFloaters() {
  const [, setLocation] = useLocation();
  const lastSlotRef = useRef<string | null>(null);
  const [activeChibis, setActiveChibis] = useState<ActiveChibi[]>(() => {
    const initialChibi = createChibi([], [], lastSlotRef.current);
    if (initialChibi) lastSlotRef.current = initialChibi.slotId;
    return initialChibi ? [initialChibi] : [];
  });
  const [jumpingId, setJumpingId] = useState<number | null>(null);
  const activeRef = useRef<ActiveChibi[]>([]);
  const timeoutsRef = useRef<number[]>([]);

  useEffect(() => {
    activeRef.current = activeChibis;
  }, [activeChibis]);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (motionQuery.matches) {
      const staticSlots = [chibiSlots[0], chibiSlots[3], chibiSlots[2]];
      const staticChibis = [heroines[1], heroines[5], heroines[7]].map((heroine, index) => ({
        id: heroine.id,
        heroineId: heroine.id,
        slotId: staticSlots[index].id,
        side: staticSlots[index].side,
        offset: staticSlots[index].offset,
        vertical: staticSlots[index].vertical,
        verticalOffset: staticSlots[index].verticalOffset,
        duration: 0,
      }));
      setActiveChibis(staticChibis);
      return;
    }

    let cancelled = false;
    const schedule = (callback: () => void, delay: number) => {
      const timeout = window.setTimeout(callback, delay);
      timeoutsRef.current.push(timeout);
    };

    activeRef.current.forEach((chibi) => {
      schedule(() => {
        setActiveChibis((items) => items.filter((item) => item.id !== chibi.id));
      }, chibi.duration);
    });

    const spawn = () => {
      if (cancelled) return;
      const current = activeRef.current;
      if (current.length < 3) {
        const next = createChibi(current.map((chibi) => chibi.heroineId), current, lastSlotRef.current);
        if (next) {
          lastSlotRef.current = next.slotId;
          setActiveChibis((items) => [...items, next]);
          schedule(() => {
            setActiveChibis((items) => items.filter((item) => item.id !== next.id));
          }, next.duration);
        }
      }
      schedule(spawn, randomBetween(1200, 3000));
    };

    schedule(spawn, 0);
    return () => {
      cancelled = true;
      timeoutsRef.current.forEach((timeout) => window.clearTimeout(timeout));
      timeoutsRef.current = [];
    };
  }, []);

  const handleTap = (chibi: ActiveChibi) => {
    const heroine = heroines.find((item) => item.id === chibi.heroineId);
    if (!heroine || jumpingId !== null) return;
    setJumpingId(chibi.id);
    window.setTimeout(() => setLocation(`/works/${heroine.slug}`), 190);
  };

  return (
    <div className="chibi-layer" aria-label="作品へ進むちびキャラクター">
      {activeChibis.map((chibi) => {
        const heroine = heroines.find((item) => item.id === chibi.heroineId);
        if (!heroine) return null;
        return (
          <button
            type="button"
            key={chibi.id}
            className={`chibi-floater ${jumpingId === chibi.id ? "is-jumping" : ""}`}
            style={{ [chibi.side]: `${chibi.offset}%`, [chibi.vertical]: `${chibi.verticalOffset}px`, ["--float-duration" as string]: `${chibi.duration}ms`, ["--chibi-size" as string]: `${chibiVisualSizes[heroine.slug]}px` }}
            onClick={() => handleTap(chibi)}
            aria-label={`${heroine.name}の作品ページへ`}
          >
            {heroine.chibiImage ? (
              <img src={heroine.chibiImage} alt="" className="chibi-floater__image" decoding="async" />
            ) : (
              <span className="chibi-floater__placeholder" style={{ backgroundColor: heroine.color }}>
                <span>ちび</span>
                <b>{String(heroine.id).padStart(2, "0")}</b>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
