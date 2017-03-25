'use strict';

const Track         = require('./Track.js');
const Notification  = require('./Notification');
const Manager       = require('./Manager.js');
const tape = require('./Tape.js');


class Watape {
    
	constructor(pusher) {
		this.pusher	= pusher;
		this.manager = new Manager(pusher);
	}

	init(){
		this.manager.downloader();
		this.manager.recorder();
		this.manager.uploader();
	}

}

module.exports = Watape;
