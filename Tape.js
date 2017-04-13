'use strict';

const gpio = require('rpi-gpio');

class Tape {

    init() {
        return new Promise(function(resolve) {
            var pin = 36;
                        
            gpio.setup(pin, gpio.DIR_OUT, on);

            function on() {
                gpio.write(pin, true);
            }
            
            setTimeout(resolve, 5000)
        });
    }
    
    record(delay) {
        setTimeout(function() {
            gpio.destroy(function() {
                console.log('Closed pins, now exit');
            });
        }, delay);
    }
}

module.exports = new Tape();