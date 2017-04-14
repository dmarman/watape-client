'use strict';

var rpio = require('rpio');

class Tape {

    init() {
        return new Promise(function(resolve) {
            rpio.open(36, rpio.OUTPUT, rpio.HIGH);
            rpio.pud(36, rpio.PULL_OFF);
            
            setTimeout(resolve, 5000)
        });
    }
    
    stopDelay(delay) {
        setTimeout(function() {
            rpio.close(36);
        }, delay);
    }
    
    stop() {
        rpio.close(36);
    }
}

module.exports = new Tape();