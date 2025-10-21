import { readFileSync, writeFileSync } from 'node:fs';

const safe = readFileSync('./dictionary/safe.txt', 'utf8');
const notSafe = readFileSync('./dictionary/not_safe.txt', 'utf8');

writeFileSync('./src/safeDictionary.ts', `export const safeDictionary = "${safe.split('\n').join('\\n')}";\n`);
writeFileSync('./src/notSafeDictionary.ts', `export const notSafeDictionary = "${notSafe.split('\n').join('\\n')}";\n`);