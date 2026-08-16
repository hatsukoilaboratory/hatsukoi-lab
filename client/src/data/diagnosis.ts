/**
 * 童貞探偵の恋愛嗜好捜査のデータ境界。診断文・配点は client/public/diagnosis のJSONだけを差し替えて更新する。
 */
import { heroines } from "@/data/heroines";
import { works } from "@/data/works";

export type DiagnosisSlug = (typeof heroines)[number]["slug"];
export type ScoreMap = Partial<Record<DiagnosisSlug, number>>;

export type NormalAnswer = { id: string; label: string; scores: ScoreMap; reasonTags?: string[] };
export type NormalQuestion = { id: string; category: string; prompt: string; enabled?: boolean; options: NormalAnswer[] };
export type KnockoutAnswer = { label: string; knockout: boolean; gameOverKey?: string };
export type GameOverButton = { id: string; label: string; action?: string; href?: string | null };
export type KnockoutQuestion = { id: string; prompt: string; options: KnockoutAnswer[] };
export type DiagnosisCharacter = {
  id: DiagnosisSlug; name: string; shortName: string; slug: DiagnosisSlug; image: string | null;
  workTitle: string | null; workUrl: string | null; resultTags: string[]; resultBase: string; ctaLabel: string;
};
export type GameOverCase = { key: string; triggerLabel: string; panels: { speaker: string; text: string }[] };
export type ReasonTemplate = { base: string; details: string[] };
export type DiagnosisData = {
  questionsPerPlay: number;
  normalQuestions: NormalQuestion[];
  knockoutQuestions: KnockoutQuestion[];
  characters: DiagnosisCharacter[];
  gameOver: { title: string; subtitle: string; buttons: GameOverButton[]; cases: GameOverCase[] };
  reasons: { headline: string; lead: string; secondaryLead: string; lowConfidence: string; characters: Record<string, ReasonTemplate> };
};

type QuestionPayload = { selection?: { questionsPerPlay?: number }; questions: NormalQuestion[] };
type CharacterPayload = { characters: DiagnosisCharacter[] };
type KnockoutPayload = { questions: KnockoutQuestion[] };
type GameOverPayload = { common: { title: string; subtitle: string; buttons: GameOverButton[] }; cases: GameOverCase[] };
type ReasonPayload = { common: Omit<DiagnosisData["reasons"], "characters">; characters: Record<string, ReasonTemplate> };

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`診断データを読み込めませんでした（${response.status}）`);
  return response.json() as Promise<T>;
}

export async function loadDiagnosisData(): Promise<DiagnosisData> {
  const [questionPayload, characterPayload, knockoutPayload, gameOverPayload, reasonPayload] = await Promise.all([
    getJson<QuestionPayload>("/diagnosis/questions.json"),
    getJson<CharacterPayload>("/diagnosis/characters.json"),
    getJson<KnockoutPayload>("/diagnosis/knockout_questions.json"),
    getJson<GameOverPayload>("/diagnosis/game_over_dialogue.json"),
    getJson<ReasonPayload>("/diagnosis/result_reason_templates.json"),
  ]);

  const characters = characterPayload.characters.map((character) => {
    const heroine = heroines.find((item) => item.slug === character.slug);
    const work = works.find((item) => item.slug === character.slug);
    return {
      ...character,
      name: heroine?.name ?? character.name,
      image: character.image ?? heroine?.bustImage ?? heroine?.standingImage ?? null,
      workTitle: character.workTitle ?? work?.title ?? "新作準備中",
      workUrl: character.workUrl ?? `/works/${character.slug}`,
    };
  });

  return {
    questionsPerPlay: questionPayload.selection?.questionsPerPlay ?? 8,
    normalQuestions: questionPayload.questions.filter((question) => question.enabled !== false),
    knockoutQuestions: knockoutPayload.questions,
    characters,
    gameOver: { title: gameOverPayload.common.title, subtitle: gameOverPayload.common.subtitle, buttons: gameOverPayload.common.buttons, cases: gameOverPayload.cases },
    reasons: { ...reasonPayload.common, characters: reasonPayload.characters },
  };
}

function shuffle<T>(items: T[]) { return [...items].sort(() => Math.random() - 0.5); }

export function buildQuestionQueue(data: DiagnosisData) {
  const selectedNormal: NormalQuestion[] = [];
  const categories = new Set<string>();
  for (const question of shuffle(data.normalQuestions)) {
    if (selectedNormal.length >= data.questionsPerPlay) break;
    if (categories.has(question.category) && selectedNormal.length < data.questionsPerPlay - 2) continue;
    selectedNormal.push(question);
    categories.add(question.category);
  }
  const fallback = shuffle(data.normalQuestions.filter((question) => !selectedNormal.some((selected) => selected.id === question.id)));
  selectedNormal.push(...fallback.slice(0, Math.max(0, data.questionsPerPlay - selectedNormal.length)));
  const knockout = Math.random() < 0.7 ? shuffle(data.knockoutQuestions)[0] : undefined;
  return knockout ? [knockout, ...selectedNormal] : selectedNormal;
}

export function emptyScores(data: DiagnosisData): Record<DiagnosisSlug, number> {
  return Object.fromEntries(data.characters.map((character) => [character.slug, 0])) as Record<DiagnosisSlug, number>;
}

export function addScores(previous: Record<DiagnosisSlug, number>, scoreMap: ScoreMap) {
  const next = { ...previous };
  Object.entries(scoreMap).forEach(([slug, value]) => { next[slug as DiagnosisSlug] = (next[slug as DiagnosisSlug] ?? 0) + (value ?? 0); });
  return next;
}

export function rankCharacters(data: DiagnosisData, scores: Record<DiagnosisSlug, number>) {
  return data.characters.map((character) => ({ character, score: scores[character.slug] ?? 0 })).sort((left, right) => right.score - left.score || left.character.id.localeCompare(right.character.id));
}
