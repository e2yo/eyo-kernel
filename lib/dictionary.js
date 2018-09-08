'use strict';

const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

const pathSafeDict = '../dict/safe.txt.gz';
const pathNotSafeDict = '../dict/not_safe.txt.gz';

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
        fs.readFile(filename, (err, buffer) => {
            if (err) {
                callback(err, buffer);
            } else {
                this._unzip(filename, buffer, (err, data) => {
                    let dict = data;
                    if (!err) { 
                        dict = data.toString('utf8');
                        this.set(dict);
                    }

                    callback(err, dict);
                });
            }
        });
    }

    _isGZ(filename) {
        return filename.search(/\.gz$/i) > -1;
    }

    _unzip(filename, buffer, callback) {
        if (this._isGZ(filename)) {
            zlib.gunzip(buffer, (err, data) => {
                callback(err, data);
            });     
        } else {
            callback(null, buffer);
        }
    }

    /**
     * Синхронно загружает словарь.
     *
     * @param {string} filename
     */
    loadSync(filename) {
        let buffer = fs.readFileSync(filename);
        buffer = this._unzipSync(filename, buffer);

        this.set(buffer.toString('utf8'));
    }

    _unzipSync(filename, buffer) {
        return this._isGZ(filename) ? zlib.gunzipSync(buffer) : buffer;
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
     * @param {string} rawWord
     */
    addWord(rawWord) {
        let word = rawWord;
        if (rawWord.search('#') > -1) {
            word = word.split('#')[0].trim();
        }
        
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
        // Слово может использоваться только со строчной буквы.
        // Пример: _киёв. Киев и только киёв.
        const hasUnderscore = word.search('_') === 0;
        word = word.replace(/^_/, '');

        const key = this._replaceYo(word);

        this._dict[key] = word;

        if (word.search(/^[А-ЯЁ]/) === -1 && !hasUnderscore) {
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
