Восстановление буквы «ё» в русских текстах
===
[![NPM version](https://img.shields.io/npm/v/eyo-kernel.svg?style=flat)](https://www.npmjs.com/package/eyo-kernel)
[![NPM downloads](https://img.shields.io/npm/dm/eyo-kernel.svg?style=flat)](https://www.npmjs.com/package/eyo-kernel)
[![Build Status](https://img.shields.io/travis/hcodes/eyo-kernel.svg?style=flat)](https://travis-ci.org/hcodes/eyo-kernel)
[![Build Status](https://img.shields.io/appveyor/ci/hcodes/eyo-kernel/master.svg?style=flat)](https://ci.appveyor.com/project/hcodes/eyo-kernel)
[![Coverage Status](https://img.shields.io/coveralls/hcodes/eyo-kernel.svg?style=flat)](https://coveralls.io/r/hcodes/eyo-kernel)
[![Dependency Status](https://img.shields.io/david/hcodes/eyo-kernel.svg?style=flat)](https://david-dm.org/hcodes/eyo-kernel)

Частичное портирование [php-yoficator](https://code.google.com/p/php-yoficator/).

## Особенности
+ проверка и восстановление буквы «ё» в русских текстах, вместо написанной «е»;
+ замена «е» на «ё» только в бесспорных случаях;
+ исправление в словах нескольких букв «е», «ё»;
+ корректная обработка сокращений («мед. училище», но не «мёд. училище»);
+ аббревиатуры не обрабатываются.

## Установка
`npm install eyo-kernel`

## Зависимости
Отсутствуют.

## Использование
```js
const Eyo = require('eyo-kernel');
const text = 'Мой текст...';

// Работа с безопасным встроенным словарём.
const safeEyo = new Eyo();
safeEyo.loadSafeSync(); // ./dict/safe.txt
console.log(safeEyo.restore(text));
console.log(safeEyo.lint(text));

// Работа с небезопасным встроенным словарём.
const notSafeEyo = new Eyo();
notSafeEyo.loadNotSafeSync(); // ./dict/not_safe.txt
console.log(notSafeEyo.restore(text));
console.log(notSafeEyo.lint(text));

// Загрузка собственного словаря.
const eyo = new Eyo();
eyo.loadSync('./my_eyo_dict.txt');
console.log(eyo.restore(text));
console.log(eyo.lint(text));

// Создание собственного словаря.
const eyo = new Eyo();
// Добавить слово в свой словарь.
eyo.dictionary.addWord('словоСБуквойЁ');
// Удалить слово из словаря.
eyo.dictionary.removeWord('словоСБуквойЁ');
// Очистить словарь.
eyo.dictionary.clear();
```

## Словарь
Это текстовый файл с кодировкой UTF-8, каждое слово на отдельной строке.  
Слова в словаре чувствительны к регистру букв. Слова, начинающиеся со строчной буквы, заменят в тексте слова со строчной и заглавной букв (Еж → Ёж и еж → ёж).  
А слова, начинающиеся с заглавной буквы, заменят в тексте слова только с заглавной буквы (Еж → Ёж).


## [Консольная утилита](https://github.com/hcodes/eyo)

## Eyo в Yaspeller
В [yaspeller](https://github.com/hcodes/yaspeller/) добавлена поддержка eyo.<br/>Используйте опцию [`--check-yo`](https://github.com/hcodes/yaspeller/#--check-yo) в командной строке `yaspeller -l ru --check-yo my_file.txt` или параметр [`checkYo: true`](https://github.com/hcodes/yaspeller/#configuration) в конфигурационном файле. 

## Ссылки
+ [http://ru.wikipedia.org/wiki/Ёфикатор](https://ru.wikipedia.org/wiki/%D0%81%D1%84%D0%B8%D0%BA%D0%B0%D1%82%D0%BE%D1%80)
+ [Про букву ё](http://www.gramota.ru/class/istiny/istiny_7_jo/)
+ [Поиск опечаток в тексте](https://github.com/hcodes/yaspeller)

## [Лицензия](./LICENSE)
MIT License
