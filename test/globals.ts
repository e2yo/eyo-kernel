import { Eyo, safeDictionary, notSafeDictionary } from '../src';
export const safeEyo = new Eyo();
export const notSafeEyo = new Eyo();

safeEyo.dictionary.set(safeDictionary);
notSafeEyo.dictionary.set(notSafeDictionary);
