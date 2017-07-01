'use strict';

const fs = require('fs');

const dict = fs.readFileSync('Yoficator.dic.dat', 'utf8');
const buf = dict.split('\n');

const resSafe = [];
const resNotSafe = [];

const identify = {};

for (let word of buf) {
    word = word.trim();

    if (!word) {
        return;
    }

    if (word.search(/\*|#/) === -1) {
        if (word.search(/\?/) === -1) {
            resSafe.push(word);
        } else {
            resNotSafe.push(word.replace(/\?/g, ''));
        }
    } else {
        return;
    }

    if (identify[word]) {
        console.log(`duplicate: ${word}`);
        process.exit(1);
    }

    if (word.search(/[Ёё]/) === -1) {
        console.log(`Not found the letter "ё": ${word}`);
        process.exit(1);
    }

    identify[word] = true;
}

resSafe.sort();
resNotSafe.sort();

console.log('Yoficator.dic.dat, words: ' + buf.length);

console.log('result dict, safe words: ' + resSafe.length);
fs.writeFileSync('../dict/safe.txt', resSafe.join('\n'));

console.log('result dict, not safe words: ' + resNotSafe.length);
fs.writeFileSync('../dict/not_safe.txt', resNotSafe.join('\n'));
