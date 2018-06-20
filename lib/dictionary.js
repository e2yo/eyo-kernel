'use strict';

const fs = require('fs');
const path = require('path');
const pathSafeDict = '../dict/safe.txt';
const pathNotSafeDict = path.resolve(__dirname, '../dict/not_safe.txt');

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
        const preparedPath = path.resolve(__dirname, pathSafeDict);
        this.load(preparedPath, callback);
    }

    /**
     * Синхронно загружает безопасный встроенный словарь.
     */
    loadSafeSync() {
        const preparedPath = path.resolve(__dirname, pathSafeDict);
        this.loadSync(preparedPath);
    }

    /**
     * Загружает небезопасный встроенный словарь.
     *
     * @param {Function} callback
     */
    loadNotSafe(callback) {
        const preparedPath = path.resolve(__dirname, pathNotSafeDict);
        this.load(preparedPath, callback);
    }

    /**
     * Синхронно загружает небезопасный встроенный словарь.
     */
    loadNotSafeSync() {
        const preparedPath = path.resolve(__dirname, pathNotSafeDict);
        this.loadSync(preparedPath);
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
        if (word.search(/\(/) > -1) {
            const parts = word.split(/[(|)]/);
            for (let i = 1, len = parts.length - 1; i < len; i++) {
                this._addWord(parts[0] + parts[i]);
            }
        } else {
            this._addWord(word);
        }
    }
    
    _addWord(word) {
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
     * @param {string|string[]} dict
     */
    set(dict) {
        this.clear();

        if (!dict) {
            return;
        }

        const buffer = Array.isArray(dict) ? dict : dict.trim().split(/\r?\n/);

        for (const word of buffer) {
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
