Восстановление буквы «ё» в русских текстах
===
[![NPM version](https://img.shields.io/npm/v/eyo-kernel.svg?style=flat)](https://www.npmjs.com/package/eyo-kernel)
[![NPM downloads](https://img.shields.io/npm/dm/eyo-kernel.svg?style=flat)](https://www.npmjs.com/package/eyo-kernel)
[![Build Status](https://img.shields.io/travis/hcodes/eyo-kernel.svg?style=flat)](https://travis-ci.org/hcodes/eyo-kernel)
[![Build Status](https://img.shields.io/appveyor/ci/hcodes/eyo-kernel/master.svg?style=flat)](https://ci.appveyor.com/project/hcodes/eyo-kernel)
[![Coverage Status](https://img.shields.io/coveralls/hcodes/eyo-kernel.svg?style=flat)](https://coveralls.io/r/hcodes/eyo-kernel)

[![Dependency Status](https://img.shields.io/david/hcodes/eyo-kernel.svg?style=flat)](https://david-dm.org/hcodes/eyo-kernel) [![devDependency Status](https://img.shields.io/david/dev/hcodes/eyo-kernel.svg?style=flat)](https://david-dm.org/hcodes/eyo#info=devDependencies)

Частичное портирование [php-yoficator](https://code.google.com/p/php-yoficator/).

## Особенности
+ проверка и восстановление буквы «ё» в русских текстах, вместо написанной «е»;
+ замена «е» на «ё» только в бесспорных случаях;
+ исправление в словах нескольких букв «е», «ё»;
+ корректная обработка сокращений («мед. училище», но не «мёд. училище»);
+ аббревиатуры не обрабатываются.

## Установка
`npm install eyo-kernel --save`

## Зависимости
Отсутствуют.

## Использование
```
var eyo = require('eyo-kernel');
```

## Методы
### .restore(text)
Безопасно восстанавливает букву «ё» в тексте.<br/>
`text {string}` – текст. Обязательный аргумент.<br/>
Возвращаемое значение: `{string}`.
```js
console.log(eyo.restore('Все лед')); // Все лёд.
```

### .lint(text, [needSort])
Поиск вариантов безопасной и небезопасной замены «ё».<br/>
`text {string}` – текст. Обязательный аргумент.<br/>
`needSort {boolean}` – Сортивать ли полученные варианты замены. Необязательный аргумент.<br/>
Возвращаемое значение: `{Object}`.
```js
console.log(eyo.lint('Все лед.'));
/* {
  safe: [
    {
      before: 'Лед',
      after: 'Лёд',
      count: 1,
      position: [
        {
          line: 1,
          column: 5
        }
      ]
    }
  ]
  notSafe: [
    {
      before: 'Все',
      after: 'Всё',
      count: 1,
      position: [
        {
          line: 1,
          column: 1
        }
      ]
    }
  ] 
} */
```

## [Консольная утилита](https://github.com/hcodes/eyo)

## Eyo в Yaspeller
В [yaspeller](https://github.com/hcodes/yaspeller/) добавлена поддержка eyo.<br/>Используйте опцию [`--check-yo`](https://github.com/hcodes/yaspeller/#--check-yo) в командной строке `yaspeller -l ru --check-yo my_file.txt` или параметр [`checkYo: true`](https://github.com/hcodes/yaspeller/#configuration) в конфигурационном файле. 

## Ссылки
+ [http://ru.wikipedia.org/wiki/Ёфикатор](https://ru.wikipedia.org/wiki/%D0%81%D1%84%D0%B8%D0%BA%D0%B0%D1%82%D0%BE%D1%80)
+ [Про букву ё](http://www.gramota.ru/class/istiny/istiny_7_jo/)
+ [Поиск опечаток в тексте](https://github.com/hcodes/yaspeller)

## [Лицензия](./LICENSE)
MIT License
