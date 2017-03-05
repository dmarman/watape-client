'use strict';
console.log('init');
require('dotenv').config();
const Pusher 		= require('pusher');
const PusherClient 	= require('pusher-client');
const axios			= require('axios');
const fs			= require('fs');
const urlConstants 	= require('./apiEndpoints');
const QueuedTrack 	= require('./QueuedTrack.js');
const Watape		= require('./Watape.js');
const sleep 		= require('system-sleep');

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

watape.downloadTracks();
watape.processManager();


// watape.firstInQueue()
//   	.then((response) => {
// 		let queuedTrack = response.data.queuedTrack;
//		
// 		if(queuedTrack != 'empty'){
// 			watape.putStatus(queuedTrack, 'Starting');
//
// 			watape.download(queuedTrack.track)
// 				.then((response) => {
// 					fs.writeFileSync(process.env.LOCAL_TRACKS_DIR + queuedTrack.track.name, response.data);
// 					console.log('saved');
// 					watape.putStatus(queuedTrack, 'Downloaded');
// 					watape.firstInQueue().then((response) => {console.log(response.data)}); //TODO need more specification in firstIn, it needs to keep downloading tracks which are not processed
// 				});
// 		} else {
// 			console.log('empty');
// 		}
// 	});

// socket.bind('App\\Events\\newTrackQueued',
// 	function(data) {
// 		const queuedTrack = new QueuedTrack(data.queuedTrack, urlConstants, hostUrl, axios, pusher);
// 		queuedTrack.putStatus('startRecording');
// 	}
// );


//axios({url: 'http://127.0.0.1', method: 'GET'}).then((response) => {console.log(response)});
