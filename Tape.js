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
        
            var pin   = 36;
            var count = 0;
            var max   = 1;

            //gpio.setup(pin, gpio.DIR_OUT, on);

        on();
        
        function on() {
            if (count >= max) {
                gpio.destroy(function() {
                    console.log('Closed pins, now exit');
                });
                return;
            }

            setTimeout(function() {
                //gpio.write(pin, true, on);
                //on();
                //count += 1;
                gpio.destroy(function() {
                    console.log('Closed pins, now exit');
                });
            }, delay);
        }
       

    }
    
}

module.exports = new Tape();