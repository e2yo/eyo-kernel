'use strict';

const zlib = require('zlib');
const fs = require('fs');

const safeGzip = zlib.createGzip();
const safeInput = fs.createReadStream('./dict_src/safe.txt');
const safeOut = fs.createWriteStream('./dict/safe.txt.gz');

const notSafeGzip = zlib.createGzip();
const notSafeInput = fs.createReadStream('./dict_src/not_safe.txt');
const notSafeOut = fs.createWriteStream('./dict/not_safe.txt.gz');

safeInput.pipe(safeGzip).pipe(safeOut);
notSafeInput.pipe(notSafeGzip).pipe(notSafeOut);

