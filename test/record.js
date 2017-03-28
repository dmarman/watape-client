'use strict';

const cmd = require('node-cmd');
const stimulus = process.argv[2] + '.wav';

console.log('recording: ' + stimulus);

cmd.get('aplay -v -D plughw:UA25 ./test/audio/' + stimulus + '',() => {
    console.log('ended playing');
});

cmd.get('arecord -f dat -D plughw:UA25 -d 11 test/audio/test.wav', function(){
    console.log('stopped recording, playing playback...');

    function replay() {
        cmd.get('aplay -v -D plughw:UA25 test/audio/test.wav',() => {
            replay();
        });
    }
    replay();
});

// cmd.get('sox -b 24 -e unsigned-integer -r 44.1k -c 2 -d --clobber --buffer $((44100*2*10)) test/audio/soxrecording.wav trim 0 10', function(){
//
//     console.log('stopped recording, playing playback...');
//     cmd.get('aplay -v -D plughw:UA25 test/audio/soxrecording.wav',() => {
//         console.log('ended playing');
//     });
//
// });