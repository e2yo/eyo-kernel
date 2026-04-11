import { Eyo } from '../eyo';
import { safeDictionary } from '../safeDictionary';

declare global {
    interface Window {
        safeEyo: Eyo;
    }
}

const safeEyo = new Eyo();
safeEyo.dictionary.set(safeDictionary);

export default safeEyo;
