'use strict';

require('dotenv').config();
const Pusher 		= require('pusher');
const Watape		= require('./Watape.js');

const pusher = new Pusher({
	appId: 		process.env.PUSHER_APP_ID,
	key: 		process.env.PUSHER_APP_KEY,
	secret: 	process.env.PUSHER_APP_SECRET,
	encrypted: 	true
});

const watape = new Watape(pusher);

watape.init();

setInterval(function(){
	if(watape.manager.downloading == false){
            watape.manager.downloading = true;
            watape.manager.downloader();
        }
}, 10000);
