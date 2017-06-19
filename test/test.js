const assert = require('chai').assert;
const Eyo = require('../lib/eyo');
const safeEyo = new Eyo();
safeEyo.dictionary.loadSafeSync();

const notSafeEyo = new Eyo();
notSafeEyo.dictionary.loadNotSafeSync();

const testDict = './test/dict.txt';
const tests = require('./pairs.json');

describe('restore', function() {
    this.timeout(5000);

    tests.forEach(test => {
		const before = test[0];
        const after = test[1];

        it(String(before), () => {
            assert.equal(safeEyo.restore(before), after);
        });
    });
});

describe('lint', function() {
    this.timeout(5000);

    it('should return replacement', () => {
		const text = '«Лед тронулся, господа присяжные заседатели!»';
        const safeReplacements = safeEyo.lint(text);
        const notSafeReplacements = notSafeEyo.lint(text);

        assert.equal(safeReplacements.length, 1);
        assert.equal(notSafeReplacements.length, 0);
    });

    it('should return sorted results', function() {
		const text = 'елка, Елка, елки, Елка, Береза, Ежик, ежики';
        const safeReplacements = safeEyo.lint(text, true);
        const notSafeReplacements = notSafeEyo.lint(text, true);

        assert.equal(safeReplacements.length, 6);
        assert.equal(notSafeReplacements.length, 0);

        ['Береза', 'Ежик', 'Елка', 'ежики', 'елка', 'елки'].forEach((word, i) => {
			assert.equal(safeReplacements[i].before, word);
		});
    });

    it('should return correct positions', function() {
        const replacements = safeEyo.lint('В лесу родилась елочка.', true);

        assert.equal(replacements.length, 1);

        const pos0 = replacements[0].position[0];
        assert.equal(pos0.line, 1);
        assert.equal(pos0.column, 17);
    });

    it('should return correct positions with new lines', function() {
        const replacements = safeEyo.lint('В лесу родилась елочка.\nВ лесу родилась елочка.\n', true);

        assert.equal(replacements.length, 1);

        const rep0 = replacements[0];
        const pos0 = rep0.position[0];
        assert.equal(pos0.line, 1);
        assert.equal(pos0.column, 17);

        const pos1 = rep0.position[1];
        assert.equal(pos1.line, 2);
        assert.equal(pos1.column, 17);
    });

    it('should return empty result', function() {
        const replacements = safeEyo.lint(null, true);

        assert.equal(replacements.length, 0);
    });

    describe('dictionary', function() {
        it('should not restore text in empty dictionary', function() {
            const eyo = new Eyo();
            const text = 'Елка';

            assert.equal(eyo.restore(text), text);
        });

        it('should not restore text after deletion of word', function() {
            const eyo = new Eyo();
            const text = 'Елка, елка';

            eyo.dictionary.addWord('ёлка');
            assert.equal(eyo.restore(text), 'Ёлка, ёлка');

            eyo.dictionary.removeWord('ёлка');
            assert.equal(eyo.restore(text), text);
        });

        it('should load custom dictionary', function() {
            const eyo = new Eyo();
            eyo.dictionary.load(testDict, function(err, data) {
                assert.equal(eyo.restore('еж'), 'ёж');
            });
        });

        it('should remove word from dictionary', function() {
            const eyo = new Eyo();
            eyo.dictionary.loadSync(testDict);
            eyo.dictionary.removeWord('ёж');
            assert.equal(eyo.restore('еж'), 'еж');
            assert.equal(Object.keys(eyo.dictionary.get()).length, 3);
        });

        it('should remove uppercase word from dictionary', function() {
            const eyo = new Eyo();
            eyo.dictionary.loadSync(testDict);
            eyo.dictionary.removeWord('Её');
            assert.equal(eyo.restore('Ее'), 'Ее');
            assert.equal(Object.keys(eyo.dictionary.get()).length, 4);
        });

        it('should clear dictionary', function() {
            const eyo = new Eyo();
            eyo.dictionary.loadSync(testDict);
            eyo.dictionary.clear();
            assert.equal(Object.keys(eyo.dictionary.get()).length, 0);
        });

        it('should load asynchronously safe dictionary', function() {
            const eyo = new Eyo();
            eyo.dictionary.loadSafe(function(err, data) {
                assert.equal(eyo.restore('еж'), 'ёж');
            });
        });

        it('should load asynchronously not safe dictionary', function() {
            const eyo = new Eyo();
            eyo.dictionary.loadNotSafe(function(err, data) {
                assert.equal(eyo.restore('все'), 'всё');
            });
        });

        it('should not clear previous dictionary if dictionary did not load', function() {
            const eyo = new Eyo();
            eyo.dictionary.addWord('Ёж');

            eyo.dictionary.load('./unknown_dict.txt', function(err, data) {
                assert.ifErr(err);
                assert.equal(Object.keys(eyo.dictionary.get()).length, 1);
            });
        });
    });
});
