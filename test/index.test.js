const Eyo = require('../lib/eyo');
const safeEyo = new Eyo();
safeEyo.dictionary.loadSafeSync();

const notSafeEyo = new Eyo();
notSafeEyo.dictionary.loadNotSafeSync();

const tests = require('./pairs.json');
const testDict = './test/dict.txt';
const testDictGz = './test/dict.txt.gz';

describe('restore', function() {
    tests.forEach(test => {
		const before = test[0];
        const after = test[1];

        it(String(before), () => {
            expect(safeEyo.restore(before)).toEqual(after);
        });
    });
});

describe('lint', function() {
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

    it('should return sorted results', function() {
		const text = 'елка, Елка, елки, Елка, Береза, Ежик, ежики';
        const safeReplacements = safeEyo.lint(text, true);
        const notSafeReplacements = notSafeEyo.lint(text, true);

        expect(safeReplacements.length).toEqual(6);
        expect(notSafeReplacements.length).toEqual(0);

        ['Береза', 'Ежик', 'Елка', 'ежики', 'елка', 'елки'].forEach((word, i) => {
			expect(safeReplacements[i].before).toEqual(word);
		});
    });

    it('should return correct positions', function() {
        const replacements = safeEyo.lint('В лесу родилась елочка.', true);

        expect(replacements.length).toEqual(1);

        const pos0 = replacements[0].position[0];
        expect(pos0.index).toEqual(16);
        expect(pos0.line).toEqual(1);
        expect(pos0.column).toEqual(17);
    });

    it('should return correct positions with new lines', function() {
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

    it('should return empty result', function() {
        const replacements = safeEyo.lint(null, true);

        expect(replacements.length).toEqual(0);
    });

    describe('dictionary', function() {
        it('should not restore text in empty dictionary', function() {
            const eyo = new Eyo();
            const text = 'Елка';

            expect(eyo.restore(text)).toEqual(text);
        });

        it('should not restore text after deletion of word', function() {
            const eyo = new Eyo();
            const text = 'Елка, елка';

            eyo.dictionary.addWord('ёлка');
            expect(eyo.restore(text)).toEqual('Ёлка, ёлка');

            eyo.dictionary.removeWord('ёлка');
            expect(eyo.restore(text)).toEqual(text);
        });

        it('should load custom dictionary', function(done) {
            const eyo = new Eyo();
            eyo.dictionary.load(testDict, function() {
                expect(eyo.restore('еж')).toEqual('ёж');
                done();
            });
        });

        it('should load custom gzip dictionary', function(done) {
            const eyo = new Eyo();
            eyo.dictionary.load(testDictGz, function() {
                expect(eyo.restore('еж')).toEqual('ёж');
                done();
            });
        });

        it('should sync load custom gzip dictionary', function() {
            const eyo = new Eyo();
            eyo.dictionary.loadSync(testDictGz);
            expect(eyo.restore('еж')).toEqual('ёж');
        });

        it('should remove word from dictionary', function() {
            const eyo = new Eyo();
            eyo.dictionary.loadSync(testDict);
            eyo.dictionary.removeWord('ёж');
            expect(eyo.restore('еж')).toEqual('еж');
            expect(Object.keys(eyo.dictionary.get()).length).toEqual(3);
        });

        it('should remove uppercase word from dictionary', function() {
            const eyo = new Eyo();
            eyo.dictionary.loadSync(testDict);
            eyo.dictionary.removeWord('Её');
            expect(eyo.restore('Ее')).toEqual('Ее');
            expect(Object.keys(eyo.dictionary.get()).length).toEqual(4);
        });

        it('should clear dictionary', function() {
            const eyo = new Eyo();
            eyo.dictionary.loadSync(testDict);
            eyo.dictionary.clear();
            expect(Object.keys(eyo.dictionary.get()).length).toEqual(0);
        });

        it('should load asynchronously safe dictionary', function(done) {
            const eyo = new Eyo();
            eyo.dictionary.loadSafe(function() {
                expect(eyo.restore('еж')).toEqual('ёж');
                done();
            });
        });

        it('should load asynchronously not safe dictionary', function(done) {
            const eyo = new Eyo();
            eyo.dictionary.loadNotSafe(function() {
                expect(eyo.restore('все')).toEqual('всё');
                done();
            });
        });

        it('should not clear previous dictionary if dictionary did not load', function(done) {
            const eyo = new Eyo();
            eyo.dictionary.addWord('Ёж');

            eyo.dictionary.load('./unknown_dict.txt', function(err) {
                expect(err).toBeDefined();
                expect(Object.keys(eyo.dictionary.get()).length).toEqual(1);
                done();
            });

        });

        it('should set dictionary from string', function() {
            const eyo = new Eyo();
            eyo.dictionary.set('Ёж\nЕщё');

            expect(Object.keys(eyo.dictionary.get()).length).toEqual(2);
        });

        it('should set dictionary from array of strings', function() {
            const eyo = new Eyo();
            eyo.dictionary.set(['Ёж', 'Ещё']);

            expect(Object.keys(eyo.dictionary.get()).length).toEqual(2);
        });

        it('should set dictionary from packed string', function() {
            const eyo = new Eyo();
            eyo.dictionary.set(['аистёнк(а|е|ом|у)']);

            expect(Object.keys(eyo.dictionary.get()).length).toEqual(8);
        });
    });
});
