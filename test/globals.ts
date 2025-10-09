import { loadNotSafeDictionary, loadSafeDictionary } from '../src/loadDictionary';
import { Eyo } from '../src';

export const safeEyo = new Eyo();
export const notSafeEyo = new Eyo();

export const safeDictionary = await loadSafeDictionary();
safeEyo.dictionary.set(safeDictionary);

export const notSafeDictionary = await loadNotSafeDictionary();
notSafeEyo.dictionary.set(notSafeDictionary);
