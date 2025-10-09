import Packer from './packer.mjs';

new Packer('safe.txt', 'safe.min.txt');
new Packer('not_safe.txt', 'not_safe.min.txt');
