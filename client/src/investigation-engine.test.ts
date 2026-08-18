import { describe, expect, it } from "vitest";
import {
  createInvestigationEngine,
  decodeOutcome,
  evaluateCode,
  generateCodes,
} from "../public/mutual/investigation-engine.js";

describe("捜査振り返り用の厳密探索エンジン", () => {
  it("3人・4人の重複なし候補を正しく全列挙する", () => {
    expect(generateCodes(3)).toHaveLength(504);
    expect(generateCodes(4)).toHaveLength(3024);
  });

  it("HIT/BLOWを重複なしコードとして正しく算出する", () => {
    expect(decodeOutcome(evaluateCode([0, 1, 2, 3], [0, 1, 2, 3]))).toEqual({ hit: 4, blow: 0 });
    expect(decodeOutcome(evaluateCode([0, 1, 2, 3], [3, 2, 1, 0]))).toEqual({ hit: 0, blow: 4 });
    expect(decodeOutcome(evaluateCode([0, 1, 2, 3], [4, 5, 6, 7]))).toEqual({ hit: 0, blow: 0 });
  });

  it("履歴で絞っても本当の正解を候補集合から落とさず、4HITなら1件へ絞る", () => {
    const engine = createInvestigationEngine(4);
    const answer = [0, 1, 2, 3];
    const answerIndex = engine.indexOf(answer)!;
    const firstGuess = engine.indexOf([0, 4, 5, 6])!;
    const firstOutcome = engine.outcomeFor(answerIndex, firstGuess);
    const afterFirst = engine.filterCandidates(engine.allIndices, firstGuess, firstOutcome);
    const finalOutcome = engine.outcomeFor(answerIndex, answerIndex);
    const afterFinal = engine.filterCandidates(afterFirst, answerIndex, finalOutcome);

    expect(afterFirst).toContain(answerIndex);
    expect(afterFinal).toEqual([answerIndex]);
  });

  it("最善手は全手探索した最悪ケース最小値と一致する", () => {
    const engine = createInvestigationEngine(3);
    const initialCandidates = engine.allIndices;
    const best = engine.findBestMove(initialCandidates);
    const exhaustiveMinimum = Math.min(...engine.allIndices.map((guessIndex) => engine.scoreGuess(initialCandidates, guessIndex).worstCase));

    expect(best.worstCase).toBe(exhaustiveMinimum);
  });

  it("4人モードの全3,024候補を初期状態から実用的な時間で分析できる", () => {
    const startedAt = performance.now();
    const engine = createInvestigationEngine(4);
    const analysis = engine.analyzeTurn(engine.allIndices, 0, engine.outcomeFor(0, 0));
    const elapsed = performance.now() - startedAt;

    expect(engine.total).toBe(3024);
    expect(analysis.bestMove.worstCase).toBeGreaterThan(0);
    expect(elapsed).toBeLessThan(2_000);
  });
});
