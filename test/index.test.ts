import { Eyo } from '../src';
import { notSafeDictionary, notSafeEyo, safeDictionary, safeEyo } from './globals';
import { tests } from './tests';

const testDict = 'ёж\nёлка\nЕё';

describe('restore', () => {
    tests.forEach(test => {
        const before = test[0];
        const after = test[1];

        it(String(before), () => {
            expect(safeEyo.restore(before)).toEqual(after);
        });
    });
});

describe('lint', () => {
    it('should return replacements', () => {
        const text = '«Лед тронулся, господа присяжные заседатели!»';
        const safeReplacements = safeEyo.lint(text);
        const notSafeReplacements = notSafeEyo.lint(text);

        expect(safeReplacements.length).toEqual(1);
        expect(notSafeReplacements.length).toEqual(0);
    });

    it('should return replacements, complex cases', () => {
        [
            {
                text: 'Город Киев. Бильярдных киев. Различен.',
                safeReplacements: 1,
                notSafeReplacements: 2
            },
            {
                text: 'Душистый левкой. Лесной левкой. Махровый левкой. Белый левкой.',
                safeReplacements: 0,
                notSafeReplacements: 4
            },
            {
                text: 'Петр. Пётр.',
                safeReplacements: 0,
                notSafeReplacements: 1
            },
            {
                text: 'Ручными стежками',
                safeReplacements: 0,
                notSafeReplacements: 1
            },
            {
                text: 'Лешек Чёрный',
                safeReplacements: 0,
                notSafeReplacements: 1
            },
            {
                text: 'Василий Фёдорович Зуев. У зуев.',
                safeReplacements: 1,
                notSafeReplacements: 1
            }
        ].forEach((item) => {
            const notSafeReplacements = notSafeEyo.lint(item.text);
            const safeReplacements = safeEyo.lint(item.text);

            expect(notSafeReplacements.length).toEqual(item.notSafeReplacements);
            expect(safeReplacements.length).toEqual(item.safeReplacements);
        });
    });

    it('should return sorted results', () => {
        const text = 'елка, Елка, елки, Елка, Береза, Ежик, ежики';
        const safeReplacements = safeEyo.lint(text, true);
        const notSafeReplacements = notSafeEyo.lint(text, true);

        expect(safeReplacements.length).toEqual(6);
        expect(notSafeReplacements.length).toEqual(0);

        ['Береза', 'Ежик', 'Елка', 'ежики', 'елка', 'елки'].forEach((word, i) => {
            expect(safeReplacements[i].before).toEqual(word);
        });
    });

    it('should return correct positions', () => {
        const replacements = safeEyo.lint('В лесу родилась елочка.', true);

        expect(replacements.length).toEqual(1);

        const pos0 = replacements[0].position[0];
        expect(pos0.index).toEqual(16);
        expect(pos0.line).toEqual(1);
        expect(pos0.column).toEqual(17);
    });

    it('should return correct positions with new lines', () => {
        const replacements = safeEyo.lint('В лесу родилась елочка.\nВ лесу родилась елочка.\n', true);

        expect(replacements.length).toEqual(1);

        const rep0 = replacements[0];
        const pos0 = rep0.position[0];
        expect(pos0.index).toEqual(16);
        expect(pos0.line).toEqual(1);
        expect(pos0.column).toEqual(17);

        const pos1 = rep0.position[1];
        expect(pos1.index).toEqual(40);
        expect(pos1.line).toEqual(2);
        expect(pos1.column).toEqual(17);
    });

    it('should return empty result', () => {
        const replacements = safeEyo.lint("", true);

        expect(replacements.length).toEqual(0);
    });

    describe('dictionary', () => {
        it('should not restore text in empty dictionary', () => {
            const eyo = new Eyo();
            const text = 'Елка';

            expect(eyo.restore(text)).toEqual(text);
        });

        it('should not restore text after deletion of word', () => {
            const eyo = new Eyo();
            const text = 'Елка, елка';

            eyo.dictionary.addWord('ёлка');
            expect(eyo.restore(text)).toEqual('Ёлка, ёлка');

            eyo.dictionary.removeWord('ёлка');
            expect(eyo.restore(text)).toEqual(text);
        });

        it('should remove word from dictionary', () => {
            const eyo = new Eyo();
            eyo.dictionary.set(testDict);
            eyo.dictionary.removeWord('ёж');
            expect(eyo.restore('еж')).toEqual('еж');
            expect(Object.keys(eyo.dictionary.get()).length).toEqual(3);
        });

        it('should remove uppercase word from dictionary', () => {
            const eyo = new Eyo();
            eyo.dictionary.set(testDict);
            eyo.dictionary.removeWord('Её');
            expect(eyo.restore('Ее')).toEqual('Ее');
            expect(Object.keys(eyo.dictionary.get()).length).toEqual(4);
        });

        it('should clear dictionary', () => {
            const eyo = new Eyo();
            eyo.dictionary.set(testDict);
            eyo.dictionary.clear();
            expect(Object.keys(eyo.dictionary.get()).length).toEqual(0);
        });

        it('should load asynchronously safe dictionary', () => {
            const eyo = new Eyo();
            eyo.dictionary.set(safeDictionary);
            expect(eyo.restore('еж')).toEqual('ёж');
        });

        it('should load asynchronously not safe dictionary', () => {
            const eyo = new Eyo();
            eyo.dictionary.set(notSafeDictionary);
            expect(eyo.restore('все')).toEqual('всё');
        });

        it('should set dictionary from string', () => {
            const eyo = new Eyo();
            eyo.dictionary.set('Ёж\nЕщё');

            expect(Object.keys(eyo.dictionary.get()).length).toEqual(2);
        });

        it('should set dictionary from array of strings', () => {
            const eyo = new Eyo();
            eyo.dictionary.set(['Ёж', 'Ещё']);

            expect(Object.keys(eyo.dictionary.get()).length).toEqual(2);
        });

        it('should set dictionary from packed string', () => {
            const eyo = new Eyo();
            eyo.dictionary.set(['аистёнк(а|е|ом|у)']);

            expect(Object.keys(eyo.dictionary.get()).length).toEqual(8);
        });
    });
});
