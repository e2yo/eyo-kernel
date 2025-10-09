export class Dictionary {
    private dict: Record<string, string> = {};
    constructor() {
        this.dict = {};
    }

    /**
     * Очищает словарь.
     */
    public clear() {
        this.dict = {};
    }

    /**
     * Восстанавливает в слове букву «ё».
     */
    public restoreWord(word: string) {
        return this.dict[this.replaceYo(word)] || word;
    }

    /**
     * Добавляет слово в словарь.
     */
    public addWord(rawWord: string) {
        let word = rawWord;
        if (rawWord.search('#') > -1) {
            word = word.split('#')[0].trim();
        }

        if (word.search(/\(/) > -1) {
            const parts = word.split(/[(|)]/);
            for (let i = 1, len = parts.length - 1; i < len; i++) {
                this.addWordInner(parts[0] + parts[i]);
            }
        } else {
            this.addWordInner(word);
        }
    }

    /**
     * Удаляет слово из словаря.
     */
    public removeWord(word: string) {
        const wordE = this.replaceYo(word);

        delete this.dict[wordE];

        if (word.search(/^[А-ЯЁ]/) === -1) {
            delete this.dict[this.capitalize(wordE)];
        }
    }

    /**
     * Установить словарь.
     */
    public set(dict: string|string[]) {
        this.clear();

        if (!dict) {
            return;
        }

        const buffer = Array.isArray(dict) ? dict : dict.trim().split(/\r?\n/);
        buffer.forEach(word => this.addWord(word));
    }

    /**
     * Получить словарь.
     */
    public get() {
        return this.dict;
    }

    private addWordInner(word: string) {
        // Слово может использоваться только со строчной буквы.
        // Пример: _киёв. Киев и только киёв.
        const hasUnderscore = word.search('_') === 0;
        word = word.replace(/^_/, '');

        const key = this.replaceYo(word);

        this.dict[key] = word;

        if (word.search(/^[А-ЯЁ]/) === -1 && !hasUnderscore) {
            this.dict[this.capitalize(key)] = this.capitalize(word);
        }
    }

    private capitalize(text: string) {
        return text.substr(0, 1).toUpperCase() + text.substr(1);
    }

    private replaceYo(word: string) {
        return word.replace(/Ё/g, 'Е').replace(/ё/g, 'е');
    }
};
