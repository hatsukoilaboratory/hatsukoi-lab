/**
 * ふわり恋色ノートに、探偵漫画のコマ割りと赤い証拠印を重ねた診断ページ。
 * 質問・配点・GAME OVER台詞は /public/diagnosis のJSONを読み、UIにはベタ書きしない。
 */
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, Check, Copy, RotateCcw, Search, Share2 } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { addScores, buildQuestionQueue, emptyScores, loadDiagnosisData, rankCharacters, type DiagnosisData, type DiagnosisSlug, type KnockoutQuestion, type NormalQuestion } from "@/data/diagnosis";
import { heroines } from "@/data/heroines";
import { buildDiagnosisResultShareText, buildGameOverShareText, buildXIntentUrl } from "@/lib/share";

type Phase = "loading" | "intro" | "question" | "deducing" | "revealing" | "result" | "game-over" | "error";
type Question = NormalQuestion | KnockoutQuestion;
type Snapshot = { queueIds: string[]; cursor: number; scores: Record<DiagnosisSlug, number>; answerLabels: string[] };
type PendingAnswer = { label: string; scores?: Partial<Record<DiagnosisSlug, number>>; knockout?: boolean; gameOverKey?: string };
const STORAGE_KEY = "hatsukoi-detective-progress-v1";
const headshots = {
  michiba: "/assets/michiba-top-headshot_fab31699.webp",
  narumi: "/assets/narumi-top-headshot_f6117d14.webp",
};
const heartStampUrl = "/assets/hatsukoi-lab-heart-stamp_89259afa.webp";
const chibis = {
  michiba: {
    neutral: "/assets/michiba_neutral_da8d690e.webp",
    speaking: "/assets/michiba_speaking_c6eed801.webp",
    thinking: "/assets/michiba_thinking_594a080a.webp",
    solve: "/assets/michiba_solve_1cc47326.webp",
    result: "/assets/michiba_result_86d25654.webp",
    shock: "/assets/michiba_shock_b310f358.webp",
  },
  narumi: {
    neutral: "/assets/narumi_neutral_e526a618.webp",
    guide: "/assets/narumi_guide_c5705590.webp",
    reaction: "/assets/narumi_reaction_8324af86.webp",
    cheer: "/assets/narumi_cheer_1035aac7.webp",
    surprise: "/assets/narumi_surprise_4e1f8acc.webp",
    sympathy: "/assets/narumi_sympathy_1010cb38.webp",
  },
} as const;

function DetectiveCast({ michibaPose, narumiPose, label }: { michibaPose: keyof typeof chibis.michiba; narumiPose?: keyof typeof chibis.narumi; label: string }) {
  return <div className="diagnosis-cast" aria-label={label}>
    <figure className="diagnosis-cast__member diagnosis-cast__member--michiba"><img src={chibis.michiba[michibaPose]} alt="道庭" loading="lazy" decoding="async" /><figcaption>道庭</figcaption></figure>
    {narumiPose && <figure className="diagnosis-cast__member diagnosis-cast__member--narumi"><img src={chibis.narumi[narumiPose]} alt="鳴海" loading="lazy" decoding="async" /><figcaption>鳴海</figcaption></figure>}
  </div>;
}

export default function Diagnosis() {
  const [location] = useLocation();
  const [data, setData] = useState<DiagnosisData | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [queue, setQueue] = useState<Question[]>([]);
  const [cursor, setCursor] = useState(0);
  const [scores, setScores] = useState<Record<DiagnosisSlug, number> | null>(null);
  const [answerLabels, setAnswerLabels] = useState<string[]>([]);
  const [gameOverKey, setGameOverKey] = useState<string | null>(null);
  const [hasSavedProgress, setHasSavedProgress] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [pendingAnswer, setPendingAnswer] = useState<PendingAnswer | null>(null);

  useEffect(() => {
    loadDiagnosisData().then((loaded) => {
      setData(loaded);
      const normalizedPath = location.split("?")[0].replace(/\/+$/, "") || "/";
      const sharedResultSlug = normalizedPath.match(/^\/diagnosis\/result\/([^/]+)$/)?.[1];
      if (normalizedPath === "/diagnosis/gameover") {
        const sharedGameOverKey = new URLSearchParams(window.location.search).get("case");
        const gameOverCase = loaded.gameOver.cases.find((item) => item.key === sharedGameOverKey) ?? loaded.gameOver.cases[0];
        setGameOverKey(gameOverCase?.key ?? null);
        setPhase("game-over");
      } else if (sharedResultSlug) {
        const sharedCharacter = loaded.characters.find((character) => character.slug === sharedResultSlug);
        if (sharedCharacter) {
          const sharedScores = emptyScores(loaded);
          sharedScores[sharedCharacter.slug] = 100;
          setScores(sharedScores);
          setAnswerLabels(["共有結果"]);
          setPhase("result");
        } else {
          setPhase("intro");
        }
      } else {
        setPhase("intro");
      }
      setHasSavedProgress(Boolean(window.localStorage.getItem(STORAGE_KEY)));
    }).catch(() => setPhase("error"));
  }, [location]);

  useEffect(() => {
    if (phase !== "question" || !scores || !queue.length) return;
    const snapshot: Snapshot = { queueIds: queue.map((question) => question.id), cursor, scores, answerLabels };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  }, [answerLabels, cursor, phase, queue, scores]);

  useEffect(() => {
    if ((phase !== "deducing" && phase !== "revealing") || !data || !scores || !pendingAnswer) return;
    const timer = window.setTimeout(() => {
      if (phase === "deducing" && !pendingAnswer.knockout && cursor >= queue.length - 1) {
        setPhase("revealing");
        return;
      }
      if (pendingAnswer.knockout && pendingAnswer.gameOverKey) {
        setGameOverKey(pendingAnswer.gameOverKey);
        setPendingAnswer(null);
        window.localStorage.removeItem(STORAGE_KEY);
        setPhase("game-over");
        return;
      }
      const nextScores = addScores(scores, pendingAnswer.scores ?? {});
      const nextAnswers = [...answerLabels, pendingAnswer.label];
      setScores(nextScores);
      setAnswerLabels(nextAnswers);
      setPendingAnswer(null);
      if (cursor >= queue.length - 1) {
        window.localStorage.removeItem(STORAGE_KEY);
        setPhase("result");
        return;
      }
      setCursor((value) => value + 1);
      setPhase("question");
    }, phase === "deducing" ? 900 : 720);
    return () => window.clearTimeout(timer);
  }, [answerLabels, cursor, data, pendingAnswer, phase, queue.length, scores]);

  const rankings = useMemo(() => data && scores ? rankCharacters(data, scores) : [], [data, scores]);
  const currentQuestion = queue[cursor];
  const progress = queue.length ? Math.round((cursor / queue.length) * 100) : 0;

  const beginNewCase = () => {
    if (!data) return;
    const nextQueue = buildQuestionQueue(data);
    setQueue(nextQueue);
    setCursor(0);
    setScores(emptyScores(data));
    setAnswerLabels([]);
    setGameOverKey(null);
    setPendingAnswer(null);
    setHasSavedProgress(false);
    window.localStorage.removeItem(STORAGE_KEY);
    setPhase("question");
  };

  const resumeCase = () => {
    if (!data) return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return beginNewCase();
      const snapshot = JSON.parse(raw) as Snapshot;
      const allQuestions = [...data.knockoutQuestions, ...data.normalQuestions];
      const restoredQueue = snapshot.queueIds.map((id) => allQuestions.find((question) => question.id === id)).filter((question): question is Question => Boolean(question));
      if (!restoredQueue.length || snapshot.cursor >= restoredQueue.length) return beginNewCase();
      setQueue(restoredQueue);
      setCursor(snapshot.cursor);
      setScores(snapshot.scores);
      setAnswerLabels(snapshot.answerLabels ?? []);
      setPhase("question");
      setHasSavedProgress(false);
    } catch { beginNewCase(); }
  };

  const answerQuestion = (answer: PendingAnswer) => {
    if (!data || !scores || !currentQuestion) return;
    setPendingAnswer(answer);
    setPhase("deducing");
  };

  const restart = () => { window.localStorage.removeItem(STORAGE_KEY); setPendingAnswer(null); setPhase("intro"); setHasSavedProgress(false); };

  if (phase === "loading") return <div className="page-shell diagnosis-page"><SiteHeader /><main className="diagnosis-shell"><div className="diagnosis-loading">捜査資料を準備しています…</div></main></div>;
  if (phase === "error" || !data) return <div className="page-shell diagnosis-page"><SiteHeader /><main className="diagnosis-shell"><section className="detective-case detective-case--error"><Search aria-hidden="true" /><h1>捜査資料が見つかりません</h1><p>少し時間をおいて、もう一度開いてみてください。</p><Link href="/" className="button button--secondary">トップへもどる</Link></section></main><SiteFooter /></div>;

  const detectiveLine = cursor > 5 ? "……あと少しで、推理がまとまる。" : cursor > 2 ? "候補が絞れてきた。もう少しだけ教えてくれ。" : "なるほど。では、次の質問です。";
  const top = rankings[0];
  const runnerUps = rankings.slice(1, 3);
  const reason = top ? data.reasons.characters[top.character.slug] : undefined;
  const confidence = top ? Math.min(98, Math.max(64, Math.round(64 + (top.score / Math.max(1, answerLabels.length * 3)) * 34))) : 0;
  const canCopyShare = typeof navigator !== "undefined" && Boolean(navigator.clipboard);
  const resultHeroine = top ? heroines.find((heroine) => heroine.slug === top.character.slug) : undefined;
  const diagnosisShareUrl = top ? `https://hatsukoi-lab.com/diagnosis/result/${top.character.slug}` : "https://hatsukoi-lab.com/diagnosis";
  const diagnosisShareText = top ? buildDiagnosisResultShareText({ heroineName: top.character.name, quote: resultHeroine?.quote ?? "", slug: top.character.slug }) : "初恋ラボの恋愛嗜好診断を遊びました。";
  const diagnosisNativeText = top ? `童貞探偵の推理の結果、わたしの推しは「${top.character.name}」でした。\n\n${resultHeroine?.quote ?? ""}` : diagnosisShareText;
  const xShareUrl = buildXIntentUrl(diagnosisShareText);
  const shareResult = async () => {
    if (typeof navigator !== "undefined" && navigator.share && top) {
      try { await navigator.share({ title: "初恋ラボ｜童貞探偵の恋愛嗜好捜査", text: diagnosisNativeText, url: diagnosisShareUrl }); } catch { /* キャンセル時は何もしない */ }
      return;
    }
    window.open(xShareUrl, "_blank", "noopener,noreferrer");
  };
  const copyShareLink = async () => {
    if (!top || typeof navigator === "undefined" || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(`${diagnosisShareText}\n${diagnosisShareUrl}`);
      setShareCopied(true);
      window.setTimeout(() => setShareCopied(false), 2200);
    } catch {
      setShareCopied(false);
    }
  };
  const gameOver = data.gameOver.cases.find((item) => item.key === gameOverKey);
  const gameOverButtons = data.gameOver.buttons;
  const gameOverDialogue = gameOver ? gameOver.panels.map((panel) => panel.text) : [];
  const gameOverShareText = buildGameOverShareText(gameOverDialogue, gameOverKey ?? undefined);
  const gameOverXShareUrl = buildXIntentUrl(gameOverShareText);

  return <div className="page-shell diagnosis-page">
    <SiteHeader />
    <main className="diagnosis-shell">
      {phase === "intro" && <section className="detective-case detective-case--intro" aria-labelledby="diagnosis-title">
        <div className="case-file__pin" aria-hidden="true" />
        <img className="detective-lab-stamp" src={heartStampUrl} alt="" />
        <p className="detective-kicker">恋の研究メモ #01 / HATSUKOI LAB</p>
        <div className="detective-duo" aria-label="捜査担当：道庭と鳴海"><div className="detective-character" data-character="michiba"><small className="detective-character__role">童貞探偵</small><div className="detective-portrait detective-portrait--dotei"><img src={headshots.michiba} alt="道庭の顔写真" /></div><span className="detective-character__name">道庭</span></div><div className="detective-character" data-character="narumi"><small className="detective-character__role">助手</small><div className="detective-portrait detective-portrait--narumi"><img src={headshots.narumi} alt="鳴海の顔写真" /></div><span className="detective-character__name">鳴海</span></div></div>
        <p className="detective-speech">「あなたの恋愛嗜好、推理させてもらう。」</p>
        <h1 id="diagnosis-title">童貞探偵の<br />恋愛嗜好捜査</h1>
        <p className="detective-lead">道庭と鳴海が、あなたに合う初恋ラボのヒロインと作品を捜査します。</p>
        <dl className="detective-facts"><div><dt>捜査時間</dt><dd>約2分</dd></div><div><dt>質問数</dt><dd>8〜10問</dd></div><div><dt>注意事項</dt><dd>該当なしの場合あり</dd></div></dl>
        <div className="detective-actions"><button type="button" className="detective-primary" onClick={beginNewCase}>捜査をはじめる <ArrowRight aria-hidden="true" /></button>{hasSavedProgress && <button type="button" className="detective-secondary" onClick={resumeCase}>前回の捜査を再開する</button>}</div>
        <p className="detective-footnote">※一部の嗜好は、初恋ラボの管轄外と判定される場合があります。</p>
      </section>}

      {phase === "question" && currentQuestion && <section className="detective-case detective-case--question" aria-labelledby="question-title">
        <div className="detective-progress"><span>捜査進行 {cursor + 1} / {queue.length}</span><div><i style={{ width: `${Math.max(8, progress)}%` }} /></div></div>
        <DetectiveCast michibaPose="speaking" narumiPose="guide" label="道庭が質問し、鳴海が案内している" />
        <div className="detective-brief"><div className="detective-brief__badge">道庭</div><p>{detectiveLine}</p></div>
        <p className="detective-kicker">QUESTION {String(cursor + 1).padStart(2, "0")}</p>
        <h1 id="question-title">{currentQuestion.prompt}</h1>
        <div className="detective-options">
          {currentQuestion.options.map((option, index) => <button type="button" key={`${option.label}-${index}`} onClick={() => answerQuestion(option)}><span>{String.fromCharCode(65 + index)}</span>{option.label}<ArrowRight aria-hidden="true" /></button>)}
        </div>
        <p className="detective-side-note">鳴海「先生、ちょっとノってきてないっスか」</p>
      </section>}

      {phase === "deducing" && <section className="detective-case detective-case--interlude" aria-live="polite"><DetectiveCast michibaPose="thinking" narumiPose="neutral" label="道庭が推理中で、鳴海が待っている" /><p className="detective-kicker">DETECTIVE THINKING…</p><h1>かなり絞れてきた……</h1><p className="detective-lead">鳴海「少々お待ちください、先生が推理中っス」</p><span className="thinking-dots" aria-hidden="true"><i /><i /><i /></span></section>}

      {phase === "revealing" && <section className="detective-case detective-case--interlude detective-case--reveal" aria-live="polite"><DetectiveCast michibaPose="solve" narumiPose="reaction" label="道庭が答えを導き、鳴海が反応している" /><p className="detective-kicker">CASE SOLVED</p><h1>……答えは出ました。</h1><p className="detective-lead">道庭「どうやらあなたに合うのは――」</p></section>}

      {phase === "result" && top && <section className="detective-case detective-case--result" aria-labelledby="result-title">
        <DetectiveCast michibaPose="result" narumiPose="cheer" label="道庭が結果を発表し、鳴海が喜んでいる" /><p className="detective-kicker">CASE CLOSED / 捜査結果</p><p className="detective-speech">「……答えは出ました。」</p>
        <h1 id="result-title">あなたに合うのは<br /><strong>{top.character.name}</strong>です</h1>
        <div className="result-main-card">
          <div className="result-main-card__portrait">{top.character.image ? <img src={top.character.image} alt={`${top.character.name}の立ち絵`} /> : <span>{top.character.shortName}</span>}</div>
          <div><p>一致度 <strong>{confidence}%</strong></p><h2>{top.character.workTitle}</h2><ul>{top.character.resultTags.slice(0, 3).map((tag) => <li key={tag}>#{tag}</li>)}</ul></div>
        </div>
        <div className="detective-reason"><h2>推理メモ</h2><p>{reason?.base ?? top.character.resultBase}</p><ul>{(reason?.details ?? top.character.resultTags).slice(0, 2).map((detail) => <li key={detail}>{detail}</li>)}</ul></div>
        {runnerUps.length > 0 && <div className="result-sub-candidates"><p>{data.reasons.secondaryLead.replace("{secondaryCharacterName}", runnerUps[0].character.name)}</p><div>{runnerUps.map(({ character }) => <Link href={character.workUrl ?? `/works/${character.slug}`} key={character.slug}>{character.shortName}</Link>)}</div></div>}
        <div className="diagnosis-share" aria-label="診断結果を共有">
          <p>この結果を友だちにも共有する？</p>
          <div className="diagnosis-share__buttons">
            <a className="diagnosis-share__x" href={xShareUrl} target="_blank" rel="noreferrer" aria-label="Xで診断結果を共有"><span aria-hidden="true">𝕏</span> 結果をXで共有する</a>
            <button type="button" className="diagnosis-share__native" onClick={shareResult}><Share2 aria-hidden="true" />共有する</button>
            <button type="button" className="diagnosis-share__copy" onClick={copyShareLink} disabled={!canCopyShare}><>{shareCopied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}</>{shareCopied ? "コピーしました" : "リンクをコピー"}</button>
          </div>
        </div>
        <div className="detective-actions"><Link href={top.character.workUrl ?? `/works/${top.character.slug}`} className="detective-primary">{top.character.ctaLabel} <ArrowRight aria-hidden="true" /></Link><button type="button" className="detective-secondary" onClick={restart}><RotateCcw aria-hidden="true" />もう一度捜査する</button></div>
        <Link href="/heroines" className="detective-text-link">ヒロイン一覧を見る <ArrowRight aria-hidden="true" /></Link>
      </section>}

      {phase === "game-over" && gameOver && <section className="detective-case detective-case--gameover" aria-labelledby="gameover-title">
        <DetectiveCast michibaPose="shock" narumiPose="surprise" label="道庭と鳴海が驚いている" /><p className="gameover-stamp">GAME OVER</p><h1 id="gameover-title">{data.gameOver.subtitle}</h1>
        <div className="manga-panels">{gameOver.panels.map((panel, index) => <article key={`${panel.speaker}-${index}`} className={`manga-panel manga-panel--${index + 1}`}><span>{panel.speaker}</span><p>{panel.text}</p></article>)}</div>
        <p className="gameover-retry-line">鳴海「じゃあ別件、行ってみましょ 先生」</p>
        <div className="detective-actions">{gameOverButtons.map((button) => {
          if (button.action === "restart") return <button key={button.id} type="button" className="detective-primary" onClick={restart}><RotateCcw aria-hidden="true" />{button.label}</button>;
          if (button.href) return <a key={button.id} className="detective-secondary" href={button.href} target="_blank" rel="noreferrer">{button.label} <ArrowRight aria-hidden="true" /></a>;
          if (button.id === "works") return <Link key={button.id} href="/heroines" className="detective-secondary">{button.label}</Link>;
          return null;
        })}</div>
        <div className="diagnosis-share diagnosis-share--gameover" aria-label="GAME OVERの結末を共有"><p>この結末を記録に残す？</p><div className="diagnosis-share__buttons"><a className="diagnosis-share__x diagnosis-share__x--full" href={gameOverXShareUrl} target="_blank" rel="noreferrer"><span aria-hidden="true">𝕏</span> この結末をXで共有する</a></div></div>
      </section>}
    </main>
    <SiteFooter />
  </div>;
}
