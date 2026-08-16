export function buildXIntentUrl(text: string) {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
}

export function buildWorkShareText(input: { quote: string; heroineName: string; workTitle: string; slug: string }) {
  return `${input.quote}\n\n${input.heroineName} ／ ${input.workTitle}\nhttps://hatsukoi-lab.com/works/${input.slug}\n#初恋ラボ`;
}

export function buildDiagnosisResultShareText(input: { heroineName: string; quote: string; slug: string }) {
  return `童貞探偵の推理の結果、わたしの推しは「${input.heroineName}」でした。\n\n${input.quote}\n\nhttps://hatsukoi-lab.com/diagnosis/result/${input.slug}\n#初恋ラボ #童貞探偵`;
}

export function buildGameOverShareText(lines: string[], gameOverKey?: string) {
  const dialogue = lines.map((line) => `「${line}」`).join("\n");
  const path = gameOverKey ? `/diagnosis/gameover?case=${encodeURIComponent(gameOverKey)}` : "/diagnosis/gameover";
  return `童貞探偵の捜査は打ち切られた。\n\n${dialogue}\n\nhttps://hatsukoi-lab.com${path}\n#初恋ラボ #童貞探偵`;
}
