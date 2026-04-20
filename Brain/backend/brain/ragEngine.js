import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
// __dirname = Brain/backend/brain  →  ../../ = Brain/
const KB_PATH = join(__dirname, '../../knowledge/vedic-maths.md');

const CHUNKS = readFileSync(KB_PATH, 'utf-8')
  .split(/\n---\n/)
  .map(c => c.trim())
  .filter(Boolean);

function score(chunk, queryWords) {
  const lower = chunk.toLowerCase();
  const header = chunk.match(/^##[^\n]*/m)?.[0]?.toLowerCase() ?? '';
  return queryWords.reduce((acc, word) => {
    if (word.length < 3) return acc;
    return acc + (header.includes(word) ? 2 : 0) + (lower.includes(word) ? 1 : 0);
  }, 0);
}

export function retrieve(query, topK = 2) {
  const words = query.toLowerCase().split(/\W+/);
  return CHUNKS
    .map(chunk => ({ chunk, score: score(chunk, words) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(r => r.chunk)
    .join('\n\n---\n\n');
}
