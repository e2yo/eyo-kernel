'use strict';

const Dictionary = require('./dictionary');

const punctuation = '[{}()[\\]|<>=\\_"\'«»„“#$^%&*+-:;.,?!]';
const re = new RegExp('([А-ЯЁа-яё])[а-яё]+(?![а-яё]|\\.[ \u00A0\t]+([а-яё]|[А-ЯЁ]{2}|' +
    punctuation + ')|\\.' +
    punctuation + ')', 'g');

module.exports = class Eyo {
    constructor() {
        this.dictionary = new Dictionary();
    }

    /**
     * Ищет варианты замены буквы «е» на «ё».
     *
     * @param {string} text
     * @param {boolean} [groupByWords] - Группировать по словам.
     *
     * @returns {Array}
     */
    lint(text, groupByWords) {
        const that = this;
        let replacement = [];

        if (!text || !this._hasEYo(text)) {
            return [];
        }

        text.replace(re, function(wordE) {
            const pos = arguments[arguments.length - 2];
            const wordYo = that.dictionary.restoreWord(wordE);

            if (wordYo !== wordE) {
                replacement.push({
                    before: wordE,
                    after: wordYo,
                    position: that._getPosition(text, pos)
                });

                return wordYo;
            }

            return wordE;
        });

        if (groupByWords) {
            replacement.sort(this._sort);
            replacement = this._delDuplicates(replacement);
        }

        return replacement;
    }

    /**
     * Восстанавливает букву «ё» в тексте.
     *
     * @param {string} text
     *
     * @returns {string}
     */
    restore(text) {
        if (!text || !this._hasEYo(text)) {
            return text || '';
        }

        text = text.replace(re, (wordE) => {
            const wordYo = this.dictionary.restoreWord(wordE);

            return wordYo === wordE ? wordE : wordYo;
        });

        return text;
    }

    _hasEYo(text) {
        return text.search(/[ЕЁеё]/) > -1;
    }

    _getPosition(text, index) {
        const buf = text.substr(0, index).split(/\r?\n/);

        return {
            line: buf.length,
            column: buf[buf.length - 1].length + 1,
            index
        };
    }

    _delDuplicates(data) {
        const count = {};
        const position = {};
        const result = [];

        data.forEach((el) => {
            const before = el.before;

            if (count[before]) {
                count[before]++;
            } else {
                count[before] = 1;
            }

            if (!position[before]) {
                position[before] = [];
            }

            position[before].push(el.position);
        });

        const added = {};
        data.forEach((el) => {
            const before = el.before;

            if (!added[before]) {
                el.count = count[before];
                el.position = position[before];

                result.push(el);

                added[before] = true;
            }
        });

        return result;
    }

    _sort(a, b) {
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
