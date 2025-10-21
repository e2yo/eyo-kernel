import { Dictionary } from './dictionary';

const PUNCTUATION = '[{}()[\\]|<>=\\_"\'«»„“#$^%&*+-:;.,?!]';
const REG_EXP = new RegExp('([А-ЯЁа-яё])[а-яё]+(?![а-яё]|\\.[ \u00A0\t]+([а-яё]|[А-ЯЁ]{2}|' +
    PUNCTUATION + ')|\\.' +
    PUNCTUATION + ')', 'g');

type Position = {
    line: number;
    column: number;
    index: number;
};

type Replacement = {
    before: string;
    after: string;
    position: Position[];
};

export class Eyo {
    public dictionary = new Dictionary();

    /**
     * Ищет варианты замены буквы «е» на «ё».
     */
    public lint(text: string, groupByWords = false) {
        let replacement: Replacement[] = [];

        if (!text || !this.hasEYo(text)) {
            return [];
        }

        text.replace(REG_EXP, (wordE, _0, _1, pos: number) => {
            const wordYo = this.dictionary.restoreWord(wordE);

            if (wordYo !== wordE) {
                replacement.push({
                    before: wordE,
                    after: wordYo,
                    position: [this.getPosition(text, pos)],
                });

                return wordYo;
            }

            return wordE;
        });

        if (groupByWords) {
            replacement.sort(this.sort);
            replacement = this.delDuplicates(replacement);
        }

        return replacement;
    }

    /**
     * Восстанавливает букву «ё» в тексте.
     */
    public restore(text: string) {
        if (!text || !this.hasEYo(text)) {
            return text || '';
        }

        text = text.replace(REG_EXP, (wordE) => {
            const wordYo = this.dictionary.restoreWord(wordE);

            return wordYo === wordE ? wordE : wordYo;
        });

        return text;
    }

    private hasEYo(text: string) {
        return text.search(/[ЕЁеё]/) > -1;
    }

    private getPosition(text: string, index: number) {
        const buf = text.substr(0, index).split(/\r?\n/);

        return {
            line: buf.length,
            column: buf[buf.length - 1].length + 1,
            index,
        };
    }

    private delDuplicates(replacements: Replacement[]) {
        const positions: Record<string, Position[]> = {};
        const result: Replacement[] = [];

        replacements.forEach(item => {
            const before = item.before;

            if (!positions[before]) {
                positions[before] = [];
            }

            item.position.forEach(position => {
                positions[before].push(position);
            });
        });

        const added: Record<string, boolean> = {};
        replacements.forEach(item => {
            const before = item.before;

            if (!added[before]) {
                result.push({
                    before: item.before,
                    after: item.after,
                    position: positions[before],
                });

                added[before] = true;
            }
        });

        return result;
    }

    private sort(a: Replacement, b: Replacement) {
        const aBefore = a.before;
        const bBefore = b.before;
        const aBeforeLower = aBefore.toLowerCase();
        const bBeforeLower = bBefore.toLowerCase();

        if (aBefore[0] !== bBefore[0] && aBeforeLower[0] === bBeforeLower[0]) {
            if (aBefore > bBefore) {
                return 1;
            } else {
                return -1;
            }
        } else {
            if (aBeforeLower > bBeforeLower) {
                return 1;
            } else if (aBeforeLower < bBeforeLower) {
                return -1;
            } else {
                return 0;
            }
        }
    }
};
