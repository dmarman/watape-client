'use strict';

const queue = require('./Queue.js');
const Job   = require('./Job.js');
const Notification = require('./Notification.js');
const Record = require('./Record.js');
const tape = require('./Tape.js');

class Manager {
    constructor(pusher, db) {
        this.notification = new Notification(pusher);
        this.downloading  = false;
        this.recording    = false;
        this.uploading    = false;
        this.db           = db;
    }

    downloader() {
        this.downloading = true;
        queue.first('waiting').then((task) => {
            if(task != null){
                let job = new Job(task);
                this.notification.status(job.job, 'downloading');
                job.track.download()
                    .then(() => {
                        this.notification.status(job.job, 'downloaded');
                        return job.put().status('downloaded'); //Update database status, only after should the db be queried again
                    })
                    .then(() => {
                        this.downloader(); //queries db for queued downloads
                        if(this.recording == false){
                            this.recorder();
                        }
                    });
            } else {
                this.downloading = false;
                console.log('No tracks waiting to be downloaded');
                if(this.recording == false){
                    this.recorder();
                }
            }
        });
    }

    recorder() {
        this.recording = true;
        queue.first('downloaded').then((task) => {
            if(task != null) {
                let job = new Job(task);
                this.notification.status(job.job, 'recording'); 
                tape.init()
                    .then(() => {
                        return job.track.record(task.configuration)
                    })
                    .then(() => {
                        tape.stop();
                        this.notification.status(job.job, 'recorded');
                        return job.put().status('recorded')
                    })
                    .then(() => {
                        job.track.delete();
                        this.recorder();
                        if(this.uploading == false){
                            this.uploader();
                        }
                    });
            } else {
                this.recording = false;
                console.log('No tracks waiting to be recorded');
                if(this.uploading == false){
                    this.uploader();
                }
            }
        });
    }

    uploader() {
        this.uploading = true;
        queue.first('recorded').then((task) => {
            if(task != null) {
                let job = new Job(task);
                this.notification.status(job.job, 'uploading');
                let record = new Record(task);
                record.upload()
                    .then((response) => {
                        this.notification.status(job.job, 'uploaded', response.data.record);
                        return job.put().status('uploaded')
                    })
                    .then(() => {
                        record.delete();
                        this.uploader();
                    });
            } else {
                this.uploading = false;
                console.log('No tracks waiting to be uploaded');
            }
        });
    }

}

module.exports = Manager;
