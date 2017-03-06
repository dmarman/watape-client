'use strict';

const axios			= require('axios');
const urlConstants 	= require('./apiEndpoints');
const hostUrl 		= process.env.APP_URL;
const fs			= require('fs');
const sleep 		= require('system-sleep');

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

    queuedUploads(){
        var url		= hostUrl + urlConstants.queue.GET_QUEUED_UPLOADS.url;
        var method	= urlConstants.queue.GET_QUEUED_UPLOADS.method;

        return axios({url: url, method: method})
            .catch(function (error) {
                console.log('Could not get queuedTracks');
                console.log(error);
            });
    }

	uploadManager(){
        console.log('Getting queued upload list');
        this.queuedUploads().then((response) => {
            this.uploadTracks(response.data.data);
        })
    }

    uploadTracks(queuedTracks){
        if(queuedTracks.length != 0 && queuedTracks[0].status == 'recorded'){
            console.log('Start uploading: ', queuedTracks[0].track.id); //TODO implement upload
            sleep(1000);
            console.log('Uploaded', queuedTracks[0].track.id);
            queuedTracks.splice(0, 1);
            this.uploadTracks(queuedTracks);
        } else {
            console.log('There is no more tracks to upload');
        }
    }

	processManager(){
		console.log('Getting queued track list');
		this.queuedTracks().then((response) => {
			this.processTracks(response.data.data);
		})
	}

	processTracks(queuedTracks){
		if(queuedTracks.length != 0){ //TODO check status

			console.log('Start recording: ', queuedTracks[0].track.id);
			sleep(1000);
			console.log('Recorded', queuedTracks[0].track.id);

			this.putStatus(queuedTracks[0], 'recorded').then((response) => {
				queuedTracks.splice(0, 1);
				this.processTracks(queuedTracks);
			});
		} else {
			console.log('There is no more tracks to process');
		}
	}

	downloadTracks(){
		console.log('get file list');
		this.queuedFiles().then((response)=> {
			if(response.data.data.length != 0){
				let queuedTracks = response.data.data;
				this.storeQueuedTracksSync(queuedTracks);
			} else {
				console.log('No files to download');
			}
		});
	}

	storeQueuedTracksSync(queuedTracks){
		console.log('Downloading: ' + queuedTracks[0].track.id);
		this.download(queuedTracks[0].track)
			.then((download) => {
				console.log('Downloaded: ' + queuedTracks[0].track.id); //TODO check that status is waiting before downloading
				this.storeTrack(queuedTracks[0].track.name, download.data);
				this.putStatus(queuedTracks[0], 'downloaded').then(() => {
					if(queuedTracks.length > 1){ //TODO check this condition, should be earlier. Check status
						queuedTracks.splice(0, 1);
						this.storeQueuedTracksSync(queuedTracks)
					}
				});
			});
	}



	storeTrack(fileName, file){
		fs.writeFileSync(process.env.LOCAL_TRACKS_DIR + fileName, file);
		console.log('Stored: ' + fileName);
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

		return axios({url: url, method: method, data: data})
			.then((response) => {
				console.log('Status updated: ' + response.data.status);
				this.pusher.trigger(userChannel, 'App\\Events\\trackStatus', {
					trackQueued: queuedTrack,
					status: status
				});
			})
			.catch(function (error) {
				console.log('Could not putStatus');
				console.log(error);
			});

		
	}
}

module.exports = Watape;