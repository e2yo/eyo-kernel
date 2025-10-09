import fs from 'node:fs';

const endings = [
    'а', 'ай', 'айте', 'ал', 'ала', 'али', 'ало', 'ам', 'ами',
    'ась', 'ать', 'аться', 'ах', 'аюсь', 'ают', 'аются', 'ая', 'аясь', 'аяся', 'аяся',
    'е', 'ев', 'его', 'егося', 'ее', 'ееся', 'ей', 'ейся', 'ем', 'емся', 'ему', 'емуся',
    'есь', 'ет', 'ете', 'ется', 'ешь', 'ешься', 'ею', 'еюся',
    'и', 'ие', 'ией', 'ием', 'иеся', 'ии', 'ий', 'ийся', 'им', 'ими', 'имися', 'имся',
    'ись', 'их', 'ихся', 'ию', 'ия', 'иям', 'иями', 'иях',
    'о', 'ов', 'ого', 'ое', 'ой', 'ом', 'ому', 'ось', 'ою',
    'ся', 'те', 'тесь',
    'у', 'уем', 'ует', 'уете', 'уешь', 'уй', 'уйте', 'ую', 'уюся', 'уют', 'уя',
    'ы', 'ые', 'ый', 'ым', 'ыми', 'ых',
    'ь', 'ью', 'ю', 'юю',
    'я', 'ям', 'ями', 'ях', 'яя',
    'ёй', 'ём', 'ёмся', 'ёт', 'ёте', 'ётесь', 'ётся', 'ёшь', 'ёшься', 'ёю'
].sort((a, b) => a.length === b.length ? 0 : a.length > b.length ? -1 : 1);

const reEndings = endings.map(e => new RegExp(e + '$'));

export class Packer {
    constructor(src, dest) {
        const words = fs.readFileSync(src, 'utf-8').trim().split(/\r?\n/).sort();
        const result = this.prepare(words);

        if (!this.check(words, result, dest)) {
            throw Error('Error dictionary compression.');
        }

        fs.writeFileSync(dest, result.join('\n'));
    }
    
    depack(words) {
        if (typeof words === 'string') {
            words = words.trim().split(/\r?\n/);
        }

        const result = [];
        
        for (const w of words) {
            if (w.search(/\(/) > -1) {
                const buf = w.split(/[(|)]/);
                for (let i = 1, len = buf.length - 1; i < len; i++) {
                    result.push(buf[0] + buf[i]);
                }
            } else {
                result.push(w);
            }
        }
        
        return result.sort();
    }

    check(words, result, dest) {
        const beforeText = words.join('\n');
        const afterText = this.depack(result).join('\n');
        
        if (beforeText !== afterText) {
            fs.writeFileSync(dest.replace(/$/, '.check'), afterText);
        }
        
        return beforeText === afterText;
    }

    prepare(words) {
        const buffer = {};

        for (const w of words) {
            const [partWord, ending] = this.getPart(w);
            if (!buffer[partWord]) {
                buffer[partWord] = [];
            }

            if (buffer[partWord].indexOf(ending) === -1) {
                buffer[partWord].push(ending);
            }
        }

        Object.keys(buffer).forEach(function(key) {
            if (buffer[key].length === 1 && buffer[key][0].length) {
                const k = key + buffer[key][0];
                if (buffer[k] && buffer[k].indexOf('') === -1) {
                    buffer[k].push('');
                    delete buffer[key];
                }
            }
        });

        const result = [];
        Object.keys(buffer).sort().forEach(function(key) {
            const endings = buffer[key];
            if (endings.length === 1) {
                result.push(key + endings[0]);
            } else {
                result.push(key + '(' + endings.sort().join('|') + ')');
            }
        });

        return result.sort((word1, word2) => {
            word1 = word1.replace(/^_/, '');
            word2 = word2.replace(/^_/, '');
            return word1 < word2 ? -1 : word1 > word2 ? 1 : 0;
        });
    }

    getPart(word) {
        for (let i = 0, len = endings.length; i < len; i++) {
            const e = endings[i];
            if (word.search(reEndings[i]) > -1) {
                return [word.substr(0, word.length - e.length), e];
            }
        }

        return [word, ''];
    }
}
