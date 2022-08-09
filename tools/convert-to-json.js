'use strict';

const fs = require('fs');
const path = require('path');

fs.mkdirSync(path.resolve(__dirname, '../dict_json/'), {recursive: true});

['safe', 'not_safe'].forEach(function (dictName) {
  const dict = fs.readFileSync(path.resolve(__dirname, '../dict_src/' + dictName + '.txt'), 'utf8');
  const buf = dict.trim().split('\n');

  const words = [];

  for (let word of buf) {
    word = word.trim();

    if (!word) {
      return;
    }

    words.push(word);
  }

  fs.writeFileSync(path.resolve(__dirname, '../dict_json/' + dictName + '.json'), JSON.stringify(words));
});
