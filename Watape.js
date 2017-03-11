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
    
	uploadManager(){
        console.log('Getting queued upload list');
        queue.get('recorded').then((response) => {
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

	
	    
}

module.exports = Watape;