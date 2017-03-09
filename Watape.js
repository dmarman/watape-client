'use strict';

const axios			= require('axios');
const fs			= require('fs');
const sleep 		= require('system-sleep');
const queue			= require('./Queue.js');
const Track         = require('./Track.js');
const Job           = require('./Job.js');
const Notification  = require('./Notification');

class Watape {
    
	constructor(pusher) {
		this.pusher	= pusher;
        this.notification = new Notification(pusher);
	}
    
	uploadManager(){
        console.log('Getting queued upload list');
        queue.get('uploads').then((response) => {
            this.uploadTracks(response.data.data);
        })
    }

    uploadTracks(queuedTracks){
        if(queuedTracks.length != 0 && queuedTracks[0].status == 'recorded'){
            console.log('Start uploading: ', queuedTracks[0].track.id); //TODO implement upload
            sleep(1000);
            console.log('Uploaded', queuedTracks[0].track.id);
            var job = new Job(queuedTracks[0]);
            job.put().status('uploaded')
                .then((response) => {
                    this.notification.status(queuedTracks[0], 'uploaded');
                    queuedTracks.splice(0, 1);
                    this.uploadTracks(queuedTracks);
                });

        } else {
            console.log('There is no more tracks to upload');
        }
    }

	processManager(){
		console.log('Getting queued track list');
		queue.get('tracks').then((response) => {
			this.processTracks(response.data.data);
		})
	}

	processTracks(queuedTracks){
		if(queuedTracks.length != 0){ //TODO check status

			console.log('Start recording: ', queuedTracks[0].track.id);
			sleep(1000);
			console.log('Recorded', queuedTracks[0].track.id);
            var job = new Job(queuedTracks[0]);
			job.put().status('recorded')
                .then((response) => {
                    this.notification.status(queuedTracks[0], 'recorded');
				    queuedTracks.splice(0, 1);
				    this.processTracks(queuedTracks);
			    });
		} else {
			console.log('There is no more tracks to process');

		}
	}

	downloadTracks(){
		console.log('get file list');
		queue.get('files').then((response)=> {
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
        var track = new Track(queuedTracks[0].track);
		track.download()
			.then(() => {
                var job = new Job(queuedTracks[0]);
                job.put().status('downloaded')
                    .then(() => {
                        this.notification.status(queuedTracks[0], 'downloaded');
                        if(queuedTracks.length > 1){ //TODO check this condition, should be earlier. Check status
                            queuedTracks.splice(0, 1); //TODO check that status is waiting before downloading
                            this.storeQueuedTracksSync(queuedTracks)
					    } else {
                            //
                        }
				});
			});
	}
    
}

module.exports = Watape;