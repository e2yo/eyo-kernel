import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PATH_SAFE_DICTIONARY = '../dictionary/safe.txt';
const PATH_NOT_SAFE_DICTIONARY = '../dictionary/not_safe.txt';

export async function loadSafeDictionary() {
    const preparedPath = resolve(__dirname, PATH_SAFE_DICTIONARY);
    const result = await readFile(preparedPath);

    return result.toString('utf8');
}

export async function loadNotSafeDictionary() {
    const preparedPath = resolve(__dirname, PATH_NOT_SAFE_DICTIONARY);
    const result = await readFile(preparedPath);

    return result.toString('utf8');
}
