// jshint maxlen:1024
var utils = require('./utils'),
    dictSafe = [],
    dictNotSafe = [],
    punctuation = '[{}()[\\]|<>=\\_"\'«»„“#$^%&*+-:;.,?!]',
    re = new RegExp('([А-ЯЁа-яё])[а-яё]{2,}(?![а-яё]|\\.[ \u00A0\t]+([а-яё]|[А-ЯЁ]{2}|' + punctuation + ')|\\.' + punctuation + ')', 'g'),
    tableSafe = {},
    tableNotSafe = {},
    isInited = false;

function sortFunc(a, b) {
    var aBefore = a.before,
        bBefore = b.before,
        aBeforeLower = aBefore.toLowerCase(),
        bBeforeLower = bBefore.toLowerCase();

    if(aBefore[0] !== bBefore[0] && aBeforeLower[0] === bBeforeLower[0]) {
        if(aBefore > bBefore) {
            return 1;
        } else if(aBefore < bBefore) {
            return -1;
        } else {
            return 0;
        }
    } else {
        if(aBeforeLower > bBeforeLower) {
            return 1;
        } else if(aBeforeLower < bBeforeLower) {
            return -1;
        } else {
            return 0;
        }
    }
}

function restore(text, sort) {
    var replacement = {safe: [], notSafe: []};
    if(!text) {
        return {text: '', replacement: replacement};
    }

    if(text.search(/[ЕЁеё]/) === -1) {
        return {text: text, replacement: replacement};
    }

    if(!isInited) {
        dictSafe = require('./eyo_safe.json');
        dictNotSafe = require('./eyo_not_safe.json');

        utils.prepareDictionary(dictSafe, tableSafe);
        utils.prepareDictionary(dictNotSafe, tableNotSafe);

        isInited = true;
    }

    text = text.replace(re, function($) {
        var e = $.replace(/Ё/g, 'Е').replace(/ё/g, 'е'),
            pos = arguments[arguments.length - 2];
        if(tableSafe[e] && tableSafe[e] !== $) {
            replacement.safe.push({
                before: $,
                after: tableSafe[e],
                count: 1,
                position: utils.getPosition(text, pos)
            });
            return tableSafe[e];
        }

        if(tableNotSafe[e] && tableNotSafe[e] !== $) {
            replacement.notSafe.push({
                before: $,
                after: tableNotSafe[e],
                count: 1,
                position: utils.getPosition(text, pos)
            });
        }

        return $;
    });

    if(sort) {
        replacement.safe.sort(sortFunc);
        replacement.notSafe.sort(sortFunc);
    }

    return {
        text: text,
        replacement: replacement
    };
}

module.exports = {
    /**
     * Поиск вариантов безопасной и небезопасной замены «ё».
     *
     * @param {string} text
     * @param {boolean} needSort
     *
     * @return {Object}
     */
    lint: function(text, needSort) {
        var rep = restore(text, needSort).replacement;
        rep.safe = utils.delDuplicates(rep.safe);
        rep.notSafe = utils.delDuplicates(rep.notSafe);

        return rep;
    },
    /**
     * Безопасное восстановление «ё» в тексте.
     *
     * @param {string} text
     *
     * @return {string}
     */
    restore: function(text) {
        return restore(text).text;
    }
};
