'use strict';

const axios			= require('axios');
const fs			= require('fs');
const sleep 		= require('system-sleep');
const queue			= require('./Queue.js');
const Track         = require('./Track.js');
const Job           = require('./Job.js');
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