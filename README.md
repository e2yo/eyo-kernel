Восстановление буквы «ё» в русских текстах
===
[![NPM version](https://img.shields.io/npm/v/eyo-kernel.svg?style=flat)](https://www.npmjs.com/package/eyo-kernel)
[![NPM downloads](https://img.shields.io/npm/dm/eyo-kernel.svg?style=flat)](https://www.npmjs.com/package/eyo-kernel)

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
import { Eyo, safeDictionary, notSafeDictionary } from 'eyo-kernel';

const text = 'Ежик шел по лесу';

// Работа с безопасным встроенным словарём.
const safeEyo = new Eyo();
safeEyo.dictionary.set(safeDictionary);
console.log(safeEyo.restore(text));
console.log(safeEyo.lint(text));

// Работа с небезопасным встроенным словарём.
const notSafeEyo = new Eyo();
notSafeEyo.dictionary.set(notSafeDictionary);
console.log(notSafeEyo.restore(text));
console.log(notSafeEyo.lint(text));
```

## Словарь
Первоначально словарь взят из проекта [php-yoficator](https://github.com/rin-nas/php-yoficator/tree/master/Text). По доработкам словаря см. [CHANGELOG.md](./CHANGELOG.md).

## Формат словаря
Это текстовый файл с кодировкой UTF-8, каждое слово на отдельной строке.
Слова в словаре чувствительны к регистру букв. Слова, начинающиеся со строчной буквы, заменят в тексте слова со строчной и заглавной букв (Еж → Ёж и еж → ёж).
А слова, начинающиеся с заглавной буквы, заменят в тексте слова только с заглавной буквы (Еж → Ёж).
Для комментариев используйте символ `#`.


## [Консольная утилита](https://github.com/e2yo/eyo)

## Ссылки
+ [Типограф с поддержкой данного ёфикатора](https://typograf.github.io/)
+ [Веб-интерфейс для восстановления буквы «ё»](https://e2yo.github.io/eyo-browser/)
+ [Консольная утилита](https://github.com/e2yo/eyo)
+ [http://ru.wikipedia.org/wiki/Ёфикатор](https://ru.wikipedia.org/wiki/%D0%81%D1%84%D0%B8%D0%BA%D0%B0%D1%82%D0%BE%D1%80)
+ [Про букву ё](http://www.gramota.ru/class/istiny/istiny_7_jo/)
+ [Поиск опечаток в тексте](https://github.com/hcodes/yaspeller)

## [Лицензия](./LICENSE)
MIT License
