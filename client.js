'use strict';

require('dotenv').config();
const Pusher 		= require('pusher');
const PusherClient 	= require('pusher-client');
const fs			= require('fs');
const Watape		= require('./Watape.js');

const socket = new PusherClient(process.env.PUSHER_APP_KEY, {
	encrypted: 	true,
	secret: 	process.env.PUSHER_APP_SECRET
});

const pusher = new Pusher({
	appId: 		process.env.PUSHER_APP_ID,
	key: 		process.env.PUSHER_APP_KEY,
	secret: 	process.env.PUSHER_APP_SECRET,
	encrypted: 	true
});

const my_channel = socket.subscribe('private-Tape.Client');

const watape = new Watape(pusher);

watape.manager.downloader();
watape.manager.recorder();
watape.manager.uploader();

socket.bind('App\\Events\\newTrackQueued',
	function(data) {
        if(watape.manager.downloading == false){
            watape.manager.downloading = true;
            watape.manager.downloader();
        }
	}
);
