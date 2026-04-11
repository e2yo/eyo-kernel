import { Eyo } from '../eyo';
import { notSafeDictionary } from '../notSafeDictionary';

declare global {
    interface Window {
        notSafeEyo: Eyo;
    }
}

const notSafeEyo = new Eyo();
notSafeEyo.dictionary.set(notSafeDictionary);

export default notSafeEyo;
