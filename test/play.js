'use strict';

const cmd = require('node-cmd');
const stimulus = process.argv[2] + '.wav';

console.log('playing: ' + stimulus);

cmd.get('aplay -v -D plughw:UA25 ./test/audio/' + stimulus + '',() => {
    console.log('ended playing');
});