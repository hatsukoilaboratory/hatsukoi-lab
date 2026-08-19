import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const gamePath = resolve(process.cwd(), "client/public/mutual/index.html");
const heroinesPath = resolve(process.cwd(), "client/src/data/heroines.ts");

describe("鳴海からの挑戦状", () => {
  it("単一HTML内に編集可能なキャラ・ヒント・接点データを保持する", async () => {
    const html = await readFile(gamePath, "utf8");

    expect(html).toContain("鳴海からの挑戦状");
    expect(html).toContain("先生の実力、見せるっス！");
    expect(html).toContain("const CHARACTER_MASTER");
    expect(html).toContain("const INTRO");
    expect((html.match(/id:'char\d+'/g) ?? []).length).toBe(9);
    expect((html.match(/facePosition:/g) ?? []).length).toBe(9);
    expect((html.match(/gift:null/g) ?? []).length).toBe(9);
    expect((html.match(/connection:'/g) ?? []).length).toBe(9);
    expect(html).toContain("gameName:'なっちゃん'");
    expect(html).toContain("icon:'/assets/ai_611005db.webp'");
    expect(html).toContain("icon:'/assets/haishinsha_97c8bdd3.webp'");
    expect(html).toContain("image-avatar");
    expect(html).toContain("michiba_speaking_c6eed801.webp");
    expect(html).toContain("narumi_guide_c5705590.webp");
    expect(html).toContain('name="robots" content="noindex,follow"');
    expect(html).toContain('rel="canonical" href="https://hatsukoi-lab.com/mutual"');
  });

  it("候補を指定順に表示し、配信者ちゃんとアイちゃんのちびキャラ対応を維持する", async () => {
    const [html, heroines] = await Promise.all([
      readFile(gamePath, "utf8"),
      readFile(heroinesPath, "utf8"),
    ]);

    const expectedOrder = [
      "銀髪ちゃん",
      "後輩ちゃん",
      "ボクっ娘",
      "同期ちゃん",
      "配信者ちゃん",
      "アイちゃん",
      "水城さん",
      "小糸ちゃん",
      "なっちゃん",
    ];
    const positions = expectedOrder.map((name) => html.indexOf(`gameName:'${name}'`));

    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    expect(heroines).toMatch(/slug: "haishinsha"[\s\S]*?chibiImage: "\/assets\/ai_611005db\.webp"/);
    expect(heroines).toMatch(/slug: "ai"[\s\S]*?chibiImage: "\/assets\/haishinsha_97c8bdd3\.webp"/);
  });

  it("3人・4人モード、HIT/BLOW、任意ヒント、履歴、コレクション、X共有を実装する", async () => {
    const html = await readFile(gamePath, "utf8");

    expect(html).toContain('data-start="three"');
    expect(html).toContain('data-start="four"');
    expect(html).toContain("function placeCharacter");
    expect(html).toContain("function clearSlots()");
    expect(html).toContain("HIT ${verdict.hit}");
    expect(html).toContain("BLOW ${verdict.blow}");
    expect(html).toContain("鳴海の判定");
    expect(html).toContain("鳴海にヒントを聞く");
    expect(html).toContain("function showHint()");
    expect(html).toContain("state.hintCount>=3");
    expect(html).toContain("もう少し聞く");
    expect(html).toContain("もっと教えてもらう");
    expect(html).toContain("const FOUND_KEY");
    expect(html).toContain("function makeAnswer(size)");
    expect(html).toContain("function renderCollection()");
    expect(html).toContain("https://twitter.com/intent/tweet");
    expect(html).toContain("ノーヒント");
    expect(html).not.toContain("両想い");
    expect(html).not.toContain("すれ違い");
    expect(html).not.toContain("証言メモ");
    expect(html).not.toContain("trait:");
  });

  it("判定結果を操作直後に表示し、同じ回答の連続判定を拒否する", async () => {
    const html = await readFile(gamePath, "utf8");
    const actionIndex = html.indexOf('id="submit-button"');
    const verdictIndex = html.indexOf('id="narumi-response"');
    const characterIndex = html.indexOf('id="character-grid"');

    expect(actionIndex).toBeGreaterThan(-1);
    expect(verdictIndex).toBeGreaterThan(actionIndex);
    expect(characterIndex).toBeGreaterThan(verdictIndex);
    expect(html).toContain("lastSubmittedSignature");
    expect(html).toContain("function submissionSignature()");
    expect(html).toContain("state.lastSubmittedSignature===signature");
    expect(html).toContain("判定済み！");
    expect(html).toContain("response.scrollIntoView");
  });

  it("プレイ中のコレクション閲覧から推理状態を維持して戻れる", async () => {
    const html = await readFile(gamePath, "utf8");

    expect(html).toContain("道庭探偵事務所</span>");
    expect(html).not.toContain("道庭探偵事務所　留守番中");
    expect(html).toContain("function openCollection(origin='title')");
    expect(html).toContain("openCollection('game')");
    expect(html).toContain("推理に戻る");
    expect(html).toContain("function returnFromCollection()");
    expect(html).toContain("setScreen('game')");
  });

  it("ヒントを見逃さず、クリア結果からもコレクションへ往復できる", async () => {
    const html = await readFile(gamePath, "utf8");

    expect(html).toContain("bounds.top<0||bounds.bottom>window.innerHeight");
    expect(html).toContain("response.scrollIntoView({behavior:'smooth',block:'nearest'})");
    expect(html).toContain("openCollection('clear')");
    expect(html).toContain("結果に戻る");
    expect(html).toContain("setScreen('clear')");
    expect(html).toContain('/assets/narumi_guide_c5705590.webp');
    expect(html).not.toContain('narumi_thinking_242d2aa2.webp');
  });

  it("恋愛嗜好捜査と同じ共通ヘッダーと研究ノート基盤を使う", async () => {
    const html = await readFile(gamePath, "utf8");

    expect(html).toContain('tube_full_1bee8d1e.svg');
    expect(html).toContain('aria-label="メインナビゲーション"');
    expect(html).toContain('トップ</a>');
    expect(html).toContain('作品をえらぶ</a>');
    expect(html).toContain('おたのしみ</a>');
    expect(html).toContain('お仕事のご依頼</a>');
    expect(html).toContain('M+PLUS+Rounded+1c');
    expect(html).toContain('game-shell--detective');
    expect(html).toContain('background-size:21px 21px');
  });

  it("厳密探索に基づく捜査振り返りと開発用分析ログを実装する", async () => {
    const html = await readFile(gamePath, "utf8");

    expect(html).toContain("function createInvestigationEngine(size,symbolCount=9)");
    expect(html).toContain("function ensureEngine()");
    expect(html).toContain("engine.analyzeTurn");
    expect(html).toContain("analysisHistory");
    expect(html).toContain("鳴海の捜査振り返り");
    expect(html).toContain("今回いちばん惜しかったのは");
    expect(html).toContain("この時点のおすすめ手");
    expect(html).toContain("今日の捜査メモ");
    expect(html).toContain("bestMove.worstCase===1");
    expect(html).toContain("debug')!=='analysis'");
  });

  it("Cloudflareで探索モジュールの取得が不安定でも、開始イベントが別ファイルに依存しない", async () => {
    const html = await readFile(gamePath, "utf8");

    expect(html).toContain("function getInvestigationEngine(size,symbolCount=9)");
    expect(html).toContain("function beginIntro()");
    expect(html).toContain("byId('challenge-button').addEventListener('click',beginIntro)");
    expect(html).not.toContain("<script type=\"module\">");
    expect(html).not.toContain("from './investigation-engine.js'");
  });

  it("導入会話のスキップと途中推理の自動保存・再開を提供する", async () => {
    const html = await readFile(gamePath, "utf8");

    expect(html).toContain('id="skip-intro-button"');
    expect(html).toContain("会話をスキップして人数を選ぶ");
    expect(html).toContain('id="resume-button"');
    expect(html).toContain("const PROGRESS_KEY='hatsukoi-narumi-challenge-progress-v1'");
    expect(html).toContain("function saveProgress()");
    expect(html).toContain("function resumeProgress()");
    expect(html).toContain("function clearSavedProgress()");
    expect(html).toContain("byId('resume-button').addEventListener('click',resumeProgress)");
    expect(html).toContain("clearSavedProgress();window.setTimeout(renderClear,420)");
    expect(html).toContain("hintButton.disabled=state.hintCount>=3");
    expect(html).toContain("state.hintCount===1?'もう少し聞く'");
  });

  it("保存済みの推理がある時だけ再開ボタンを控えめに強調する", async () => {
    const html = await readFile(gamePath, "utf8");

    expect(html).toContain("has-saved-progress");
    expect(html).toContain("animation:resume-attention");
    expect(html).toContain("button.classList.toggle('has-saved-progress',hasSavedProgress)");
    expect(html).toContain("@media(prefers-reduced-motion:reduce)");
  });

  it("ご褒美CGを手数だけで重複なく解放し、ギャラリーで再閲覧できる", async () => {
    const html = await readFile(gamePath, "utf8");

    expect(html).toContain("const REWARD_KEY='hatsukoi-mutual-reward-unlocked-v1'");
    expect(html).toContain("const REWARD_COMPLETE_KEY='hatsukoi-mutual-reward-complete-v1'");
    expect(html).toContain("const REWARD_LIMIT={three:4,four:5}");
    expect(html).toContain("function getRewardResult(mode,clearTurns)");
    expect(html).toContain("clearTurns===1");
    expect(html).toContain("REWARD_CGS.filter(reward=>!unlocked.has(reward.id))");
    expect(html).toContain("if(resolution.result.reward==='UNLOCK_ALL')queue.push({type:'lucky'});else resolution.newlyUnlocked.forEach");
    expect((html.match(/\/mutual\/assets\/rewards\/reward_[a-z_]+\.webp/g) ?? []).length).toBe(10);
    expect(html).toContain('id="reward-gallery-screen"');
    expect(html).toContain("function openGallery(origin='title')");
    expect(html).toContain("function returnFromGallery()");
    expect(html).toContain("openGallery('game')");
    expect(html).toContain("openGallery('clear')");
    expect(html).toContain("object-fit:contain");
    expect(html).toContain('loading=\'lazy\'');
  });

  it("新規ご褒美CGの解放演出にだけ紙吹雪を表示し、モーション軽減設定を尊重する", async () => {
    const html = await readFile(gamePath, "utf8");

    expect(html).toContain('id="reward-confetti"');
    expect(html).toContain("function launchRewardConfetti()");
    expect(html).toContain("window.matchMedia('(prefers-reduced-motion: reduce)').matches");
    expect(html).toContain("['lucky','reward','complete'].includes(item.type)");
    expect(html).toContain("if(!viewOnly&&['lucky','reward','complete'].includes(item.type))launchRewardConfetti()");
    expect(html).toContain("@keyframes reward-confetti-fall");
  });

  it("同率を含む最善手を改善対象から除外し、全手最善なら専用総評を表示する", async () => {
    const html = await readFile(gamePath, "utf8");

    expect(html).toContain("function isOptimalMove(entry)");
    expect(html).toContain("entry.analysis.playerMove.worstCase===entry.analysis.bestMove.worstCase");
    expect(html).toContain("const improvable=state.analysisHistory.filter(entry=>!isOptimalMove(entry))");
    expect(html).toContain("今回の捜査、ほぼ完璧っス！");
    expect(html).toContain("この手は最善だったっス！");
    expect(html).toContain("この一手は直すところないっスよ。");
  });

  it("内容別の捜査メモを直近と重複させず、プレイ結果に応じて選ぶ", async () => {
    const html = await readFile(gamePath, "utf8");

    expect(html).toContain("const MEMO_HISTORY_KEY='hatsukoi-narumi-investigation-memo-history-v1'");
    expect(html).toContain("const INVESTIGATION_MEMOS=");
    expect(html).toContain("function chooseInvestigationMemo({allOptimal,focus})");
    expect(html).toContain("unique.filter(id=>id!==history.at(-1))");
    expect(html).toContain("HITだけじゃなくBLOWも大事っス");
    expect(html).toContain("ご褒美ライン突破っス！");
  });

  it("本編の親しみやすい呼称とご褒美CGの正式名称を分離する", async () => {
    const html = await readFile(gamePath, "utf8");

    expect(html).toContain("const REWARD_DISPLAY_NAMES=");
    expect(html).toContain("gameName:'なっちゃん'");
    expect(html).toContain("natsu:'三浦 夏'");
    expect(html).toContain("ginpatsu:'銀髪幼馴染ちゃん'");
    expect(html).toContain("mizuki:'水城 友結'");
    expect(html).toContain("koito:'佐瀬 小糸'");
    expect(html).toContain("reward.displayName");
    expect(html).toContain("char.gameName");
    expect(html).not.toContain("name:'三浦 夏'");
  });
});
