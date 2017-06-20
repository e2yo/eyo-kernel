'use strict';

const fs = require('fs');
const path = require('path');
const safeDict = path.resolve(__dirname, '../dict/safe.txt');
const notSafeDict = path.resolve(__dirname, '../dict/not_safe.txt');

module.exports = class Dictionary {
    constructor() {
        this._dict = {};
    }

    /**
     * Загружает словарь.
     *
     * @param {string} filename
     * @param {Function} callback
     */
    load(filename, callback) {
        fs.readFile(filename, 'utf8', (err, data) => {
            if (!err) {
                this.set(data);
            }

            callback(err, data);
        });
    }

    /**
     * Синхронно загружает словарь.
     *
     * @param {string} filename
     */
    loadSync(filename) {
        const text = fs.readFileSync(filename, 'utf8');
        this.set(text);
    }

    /**
     * Загружает безопасный встроенный словарь.
     *
     * @param {Function} callback
     */
    loadSafe(callback) {
        this.load(safeDict, callback);
    }

    /**
     * Синхронно загружает безопасный встроенный словарь.
     */
    loadSafeSync() {
        this.loadSync(safeDict);
    }

    /**
     * Загружает небезопасный встроенный словарь.
     *
     * @param {Function} callback
     */
    loadNotSafe(callback) {
        this.load(notSafeDict, callback);
    }

    /**
     * Синхронно загружает небезопасный встроенный словарь.
     */
    loadNotSafeSync() {
        this.loadSync(notSafeDict);
    }
    
    /**
     * Очищает словарь.
     */
    clear() {
        this._dict = {};
    }

    /**
     * Восстанавливает в слове букву «ё».
     *
     * @param {string} word
     *
     * @returns {string}
     */
    restoreWord(word) {
        return this._dict[this._replaceYo(word)] || word;
    }

    /**
     * Добавляет слово в словарь.
     *
     * @param {string} word
     */
    addWord(word) {
        const key = this._replaceYo(word);

        this._dict[key] = word;

        if (word.search(/^[А-ЯЁ]/) === -1) {
            this._dict[this._capitalize(key)] = this._capitalize(word);
        }
    }

    /**
     * Удаляет слово из словаря.
     *
     * @param {string} word
     */
    removeWord(word) {
        const wordE = this._replaceYo(word);

        delete this._dict[wordE];

        if (word.search(/^[А-ЯЁ]/) === -1) {
            delete this._dict[this._capitalize(wordE)];
        }
    }

    /**
     * Установить словарь.
     *
     * @param {string} dict
     */
    set(dict) {
        this.clear();

        if (!dict) {
            return;
        }

        const buf = dict.split(/\r?\n/);

        for (const word of buf) {
            this.addWord(word);
        }
    }
    
    /**
     * Получить словарь.
     *
     * @returns {Object}
     */
    get() {
        return this._dict;
    }

    _capitalize(text) {
        return text.substr(0, 1).toUpperCase() + text.substr(1);
    }

    _replaceYo(word) {
        return word.replace(/Ё/g, 'Е').replace(/ё/g, 'е');
    }
};
