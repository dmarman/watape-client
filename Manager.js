'use strict';

const queue = require('./Queue.js');
const Job   = require('./Job.js');
const Notification = require('./Notification.js');
const Record = require('./Record.js');

class Manager {
    constructor(pusher) {
        this.notification = new Notification(pusher);
        this.downloading  = false;
        this.recording    = false;
        this.uploading    = false;
    }

    downloader() {
        this.downloading = true;
        queue.first('waiting').then((response) => {
            if(response.data.data != null){

                let job = new Job(response.data.data);
                job.track.download() //TODO manage when one of the steps fails, script stops running, set status failed and go on working
                    .then(() => {
                        job.put().status('downloaded')
                            .then(() => {
                                this.notification.status(job.job, 'downloaded');
                                this.downloader();
                                if(this.recording == false){
                                    this.recorder();
                                }
                            });
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
            if(response.data.data != null) {

                let job = new Job(response.data.data);
                job.track.record()
                    .then((response) => {
                        //console.log(response.data);
                        if (response == 'success') {
                            console.log('recorded: ' + job.track.id); // TODO this should be inside record() method
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
            if(response.data.data != null) {

                let job = new Job(response.data.data);
                let record = new Record(response.data.data);
                record.upload()
                    .then((response) => {
                        if (response.data.success == true) {
                            console.log('uploaded: ' + job.track.id); // TODO this should be inside record() method
                            job.put().status('uploaded')
                                .then(() => {
                                    this.notification.status(job.job, 'uploaded');
                                    record.delete();
                                    this.uploader();
                                });
                        }
                    });
            } else {
                this.uploading = false;
                console.log('No tracks waiting to be uploaded');
                if(this.downloading == false){
                    //this.downloader();
                }
            }
        });
    }

}

module.exports = Manager;
