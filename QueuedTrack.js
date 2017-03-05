'use strict';

const axios			= require('axios');
const urlConstants 	= require('./apiEndpoints');
const hostUrl 		= process.env.APP_URL;
const fs			= require('fs');

class QueuedTrack {
	constructor(queuedTrack, pusher) {
		this.data 		= queuedTrack;
		this.pusher 	= pusher;
	}

	putStatus(status){
		var data 		= {queuedTrackId: this.data.id, status: status};
		var url  		= hostUrl + urlConstants.queuedTrack.UPDATE_STATUS.url + this.data.id;
		var userChannel = 'private-App.User.' + this.data.track.user_id;
		var method		= urlConstants.queuedTrack.UPDATE_STATUS.method;
				
		axios({url: url, method: method, data: data})
				.then((response) => {console.log(response.data.status)});
			
		this.pusher.trigger(userChannel, 'App\\Events\\trackStatus', {
			trackQueued: this.data,
			status: status 
		});
	}

	download(){
		var url  	= hostUrl + urlConstants.track.DOWNLOAD.url + this.data.track.id;
		var method	= urlConstants.track.DOWNLOAD.method;
			
		return axios({url: url, method: method, responseType: 'arraybuffer'})
			.catch(function (error) {
				console.log('Could not download track');
    			console.log(error);
			});
	}
}

module.exports = QueuedTrack;