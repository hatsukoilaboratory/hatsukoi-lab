import { readFile } from "node:fs/promises";
import path from "node:path";

type JsonRecord = Record<string, unknown>;
const root = path.resolve(import.meta.dirname, "..");
const dataPath = (...parts: string[]) => path.join(root, "client", "public", "diagnosis", ...parts);
const errors: string[] = [];
const assert = (condition: unknown, message: string) => { if (!condition) errors.push(message); };
const object = (value: unknown): value is JsonRecord => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const readJson = async (file: string) => JSON.parse(await readFile(dataPath(file), "utf8")) as unknown;

const [questionsFile, charactersFile, knockoutFile, gameOverFile, reasonsFile] = await Promise.all([
  readJson("questions.json"), readJson("characters.json"), readJson("knockout_questions.json"), readJson("game_over_dialogue.json"), readJson("result_reason_templates.json"),
]);

const questions = object(questionsFile) && Array.isArray(questionsFile.questions) ? questionsFile.questions : [];
const characters = object(charactersFile) && Array.isArray(charactersFile.characters) ? charactersFile.characters : [];
const knockoutQuestions = object(knockoutFile) && Array.isArray(knockoutFile.questions) ? knockoutFile.questions : [];
const gameCases = object(gameOverFile) && Array.isArray(gameOverFile.cases) ? gameOverFile.cases : [];
const reasonCharacters = object(reasonsFile) && object(reasonsFile.characters) ? reasonsFile.characters : {};

assert(questions.length === 63, `通常質問は63件必要です（現在${questions.length}件）`);
assert(characters.length === 9, `診断対象ヒロインは9人必要です（現在${characters.length}人）`);
assert(knockoutQuestions.length === 5, `一撃質問は5件必要です（現在${knockoutQuestions.length}件）`);
assert(gameCases.length === 5, `GAME OVERケースは5件必要です（現在${gameCases.length}件）`);

const characterIds = new Set<string>();
for (const character of characters) {
  assert(object(character), "ヒロインデータの形式が不正です");
  if (!object(character)) continue;
  const id = character.id;
  const slug = character.slug;
  assert(typeof id === "string" && id.length > 0, "ヒロインidがありません");
  assert(typeof slug === "string" && slug === id, `ヒロインのidとslugが一致しません: ${String(id)}`);
  assert(!characterIds.has(String(id)), `ヒロインidが重複しています: ${String(id)}`);
  if (typeof id === "string") characterIds.add(id);
  assert(object(reasonCharacters[id as string]), `結果理由がありません: ${String(id)}`);
}

const questionIds = new Set<string>();
const scoredCharacterIds = new Set<string>();
for (const question of questions) {
  assert(object(question), "通常質問の形式が不正です");
  if (!object(question)) continue;
  const id = question.id;
  assert(typeof id === "string" && id.length > 0, "通常質問idがありません");
  assert(!questionIds.has(String(id)), `通常質問idが重複しています: ${String(id)}`);
  if (typeof id === "string") questionIds.add(id);
  assert(typeof question.prompt === "string" && question.prompt.length > 0, `質問文がありません: ${String(id)}`);
  assert(Array.isArray(question.options) && question.options.length >= 2, `選択肢が不足しています: ${String(id)}`);
  if (Array.isArray(question.options)) for (const option of question.options) {
    assert(object(option), `選択肢形式が不正です: ${String(id)}`);
    if (!object(option)) continue;
    assert(typeof option.label === "string" && option.label.length > 0, `選択肢文がありません: ${String(id)}`);
    assert(object(option.scores), `配点がありません: ${String(id)}`);
    if (object(option.scores)) Object.entries(option.scores).forEach(([slug, score]) => {
      assert(characterIds.has(slug), `存在しないヒロインへの配点です: ${String(id)} / ${slug}`);
      assert(typeof score === "number" && score > 0 && score <= 3, `配点は1〜3で指定してください: ${String(id)} / ${slug}`);
      if (typeof score === "number" && score > 0) scoredCharacterIds.add(slug);
    });
  }
}
characterIds.forEach((id) => assert(scoredCharacterIds.has(id), `通常質問の配点先に存在しないヒロインです: ${id}`));

const gameOverKeys = new Set<string>();
for (const gameCase of gameCases) {
  assert(object(gameCase), "GAME OVERケース形式が不正です");
  if (!object(gameCase)) continue;
  assert(typeof gameCase.key === "string" && gameCase.key.length > 0, "GAME OVERキーがありません");
  if (typeof gameCase.key === "string") gameOverKeys.add(gameCase.key);
  assert(Array.isArray(gameCase.panels) && gameCase.panels.length >= 5, `漫画コマが不足しています: ${String(gameCase.key)}`);
}
for (const question of knockoutQuestions) {
  assert(object(question), "一撃質問の形式が不正です");
  if (!object(question) || !Array.isArray(question.options)) continue;
  question.options.forEach((option) => {
    if (!object(option) || option.knockout !== true) return;
    assert(typeof option.gameOverKey === "string" && gameOverKeys.has(option.gameOverKey), `対応するGAME OVERケースがありません: ${String(option.gameOverKey)}`);
  });
}

if (errors.length) {
  console.error("\n[診断データ検査: NG]");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log(`[診断データ検査: OK] ${questions.length}通常質問 / ${knockoutQuestions.length}一撃質問 / ${characters.length}ヒロイン / ${gameCases.length}GAME OVER`);
