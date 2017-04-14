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
        queue.first('waiting').then((response) => {
            if(response != null){
                let job = new Job(response);
                job.track.download()
                    .then(() => {
                        return job.put().status('downloaded');
                    })
                    .then(() => {
                        this.notification.status(job.job, 'downloaded');
                        this.downloader();
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
        queue.first('downloaded').then((response) => {
            if(response != null) {
                let job = new Job(response);
                tape.init().then(() => {
                    job.track.record()
                        .then((response) => {
                            if (response == 'success') {
                                tape.stop();
                                job.put().status('recorded')
                                    .then(() => {
                                        this.notification.status(job.job, 'recorded');
                                        job.track.delete();
                                        this.recorder();
                                        if(this.uploading == false){
                                            this.uploader();
                                        }
                                    });
                            }
                        });
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
        queue.first('recorded').then((response) => {
            if(response != null) {
                let job = new Job(response);
                let record = new Record(response);
                record.upload()
                    .then((response) => {
                        job.put().status('uploaded')
                            .then(() => {
                                this.notification.status(job.job, 'uploaded', response.data.record);
                                record.delete();
                                this.uploader();
                            });
                    });
            } else {
                this.uploading = false;
                console.log('No tracks waiting to be uploaded');
            }
        });
    }

}

module.exports = Manager;
