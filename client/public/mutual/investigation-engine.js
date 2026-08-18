const engineCache = new Map();

export function generateCodes(size, symbolCount = 9) {
  const codes = [];
  const build = (prefix) => {
    if (prefix.length === size) {
      codes.push(Uint8Array.from(prefix));
      return;
    }
    for (let symbol = 0; symbol < symbolCount; symbol += 1) {
      if (!prefix.includes(symbol)) build([...prefix, symbol]);
    }
  };
  build([]);
  return codes;
}

export function evaluateCode(answer, guess) {
  let hit = 0;
  let common = 0;
  for (let index = 0; index < answer.length; index += 1) {
    if (answer[index] === guess[index]) hit += 1;
    for (let other = 0; other < answer.length; other += 1) {
      if (answer[index] === guess[other]) {
        common += 1;
        break;
      }
    }
  }
  return hit * 5 + (common - hit);
}

export function decodeOutcome(outcome) {
  return { hit: Math.floor(outcome / 5), blow: outcome % 5 };
}

function keyFor(code) {
  return Array.from(code).join("|");
}

function betterScore(next, current) {
  if (!current) return true;
  if (next.worstCase !== current.worstCase) return next.worstCase < current.worstCase;
  if (next.sumSquares !== current.sumSquares) return next.sumSquares < current.sumSquares;
  if (next.isCandidate !== current.isCandidate) return next.isCandidate;
  return next.guessIndex < current.guessIndex;
}

export function createInvestigationEngine(size, symbolCount = 9) {
  const codes = generateCodes(size, symbolCount);
  const total = codes.length;
  const codeIndex = new Map(codes.map((code, index) => [keyFor(code), index]));
  const outcomes = new Uint8Array(total * total);

  for (let answerIndex = 0; answerIndex < total; answerIndex += 1) {
    const offset = answerIndex * total;
    for (let guessIndex = 0; guessIndex < total; guessIndex += 1) {
      outcomes[offset + guessIndex] = evaluateCode(codes[answerIndex], codes[guessIndex]);
    }
  }

  const allIndices = Array.from({ length: total }, (_, index) => index);
  const hasCandidate = (candidates, value) => candidates.includes(value);

  function filterCandidates(candidates, guessIndex, outcome) {
    return candidates.filter((answerIndex) => outcomes[answerIndex * total + guessIndex] === outcome);
  }

  function scoreGuess(candidates, guessIndex) {
    const buckets = new Uint16Array((size + 1) * 5);
    for (const answerIndex of candidates) buckets[outcomes[answerIndex * total + guessIndex]] += 1;
    let worstCase = 0;
    let sumSquares = 0;
    let bucketCount = 0;
    const distribution = [];
    for (let outcome = 0; outcome < buckets.length; outcome += 1) {
      const count = buckets[outcome];
      if (!count) continue;
      worstCase = Math.max(worstCase, count);
      sumSquares += count * count;
      bucketCount += 1;
      distribution.push({ outcome, count });
    }
    return {
      guessIndex,
      worstCase,
      sumSquares,
      expectedRemaining: sumSquares / candidates.length,
      bucketCount,
      isCandidate: hasCandidate(candidates, guessIndex),
      distribution,
    };
  }

  function findBestMove(candidates) {
    let best = null;
    for (let guessIndex = 0; guessIndex < total; guessIndex += 1) {
      const score = scoreGuess(candidates, guessIndex);
      if (betterScore(score, best)) best = score;
    }
    return best;
  }

  function analyzeTurn(candidatesBefore, guessIndex, outcome) {
    const playerMove = scoreGuess(candidatesBefore, guessIndex);
    const bestMove = findBestMove(candidatesBefore);
    const candidatesAfter = filterCandidates(candidatesBefore, guessIndex, outcome);
    const result = decodeOutcome(outcome);
    const ratio = bestMove.worstCase / Math.max(1, playerMove.worstCase);
    const perfect = result.hit === size || playerMove.worstCase === 1;
    const grade = perfect ? "★" : ratio >= 0.9 ? "◎" : ratio >= 0.75 ? "○" : ratio >= 0.55 ? "△" : "×";
    return {
      result,
      candidatesBeforeIndices: [...candidatesBefore],
      candidatesBefore: candidatesBefore.length,
      candidatesAfter: candidatesAfter.length,
      playerMove,
      bestMove,
      efficiencyScore: ratio,
      grade,
      candidatesAfterIndices: candidatesAfter,
    };
  }

  return {
    size,
    codes,
    total,
    allIndices,
    outcomeFor: (answerIndex, guessIndex) => outcomes[answerIndex * total + guessIndex],
    indexOf: (code) => codeIndex.get(keyFor(code)),
    codeAt: (index) => Array.from(codes[index]),
    filterCandidates,
    scoreGuess,
    findBestMove,
    analyzeTurn,
  };
}

export function getInvestigationEngine(size, symbolCount = 9) {
  const cacheKey = `${size}:${symbolCount}`;
  if (!engineCache.has(cacheKey)) engineCache.set(cacheKey, createInvestigationEngine(size, symbolCount));
  return engineCache.get(cacheKey);
}
