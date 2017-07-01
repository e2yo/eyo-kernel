'use strict';

const Packer = require('./packer');

new Packer('safe.txt', 'safe.min.txt');
new Packer('not_safe.txt', 'not_safe.min.txt');
