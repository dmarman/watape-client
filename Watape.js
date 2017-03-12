'use strict';

const Track         = require('./Track.js');
const Notification  = require('./Notification');
const Manager       = require('./Manager.js');

class Watape {
    
	constructor(pusher) {
		this.pusher	= pusher;
        this.notification = new Notification(pusher);
		this.manager = new Manager(pusher);
	}

}

module.exports = Watape;