'use strict';

const axios			= require('axios');
const urlConstants 	= require('./apiEndpoints');
const hostUrl 		= process.env.APP_URL;
const fs			= require('fs');
const EventEmitter = require('events');

class Watape {
	constructor(pusher) {
		this.pusher	= pusher;
	}

	firstInQueue(){
		var url  		= hostUrl + urlConstants.queuedTrack.GET_FIRST_IN.url;
		var method		= urlConstants.queuedTrack.GET_FIRST_IN.method;

		return axios({url: url, method: method})
					.catch(function (error) {
						console.log('Could not get firstInQueue');
    					console.log(error);
					});
	}
	
	queuedFiles() {
		var url		= hostUrl + urlConstants.queue.GET_QUEUED_FILES.url;
		var method	= urlConstants.queue.GET_QUEUED_FILES.method;
		
		return axios({url: url, method: method})
			.catch(function (error) {
				console.log('Could not get queuedFiles');
				console.log(error);
			});
	}
	
	queuedTracks(){
		var url		= hostUrl + urlConstants.queue.GET_QUEUED_TRACKS.url;
		var method	= urlConstants.queue.GET_QUEUED_TRACKS.method;

		return axios({url: url, method: method})
			.catch(function (error) {
				console.log('Could not get queuedTracks');
				console.log(error);
			});
	}

	downloadTracks(){
		this.queuedFiles().then((response)=> {
			let queuedTracks = response.data.data;
			this.storeQueuedTracks(queuedTracks);
		});
	}

	storeQueuedTracks(queuedTracks){
		Object.keys(queuedTracks).forEach(key => {
			this.download(queuedTracks[key].track)
				.then((download) => {
					this.storeTrack(queuedTracks[key].track.name, download.data)
						.then(() => {
							return new Promise(function(resolve, reject){
								//TODO meter el storeTrack directamente en download?
							});
						});
				});
		});
	}

	storeTrack(fileName, file){
		fs.writeFileSync(process.env.LOCAL_TRACKS_DIR + fileName, file);
		return new Promise(function(resolve, reject){
			resolve('yes');
		});
	}



	download(track){

		var url  	= hostUrl + urlConstants.track.DOWNLOAD.url + track.id;
		var method	= urlConstants.track.DOWNLOAD.method;
		
		return axios({url: url, method: method, responseType: 'arraybuffer'})
			.catch(function (error) {
				console.log('Could not download track');
				console.log(error);
			});
	}

	putStatus(queuedTrack, status){
		var data 		= {queuedTrackId: queuedTrack.id, status: status};
		var url  		= hostUrl + urlConstants.queuedTrack.UPDATE_STATUS.url + queuedTrack.id;
		var userChannel = 'private-App.User.' + queuedTrack.track.user_id;
		var method		= urlConstants.queuedTrack.UPDATE_STATUS.method;

		axios({url: url, method: method, data: data})
			.then((response) => {
				console.log(response.data.status)})
			.catch(function (error) {
				console.log('Could not putStatus');
				console.log(error);
			});

		this.pusher.trigger(userChannel, 'App\\Events\\trackStatus', {
			trackQueued: queuedTrack,
			status: status
		});
	}
}

module.exports = Watape;