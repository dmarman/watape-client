'use strict';

const queue = require('./Queue.js');
const Job   = require('./Job.js');
const Notification = require('./Notification.js');

class Manager {
    constructor(pusher) {
        this.notification = new Notification(pusher);
    }

    downloader() {
        queue.first('waiting').then((response) => {
            if(response.data.data != null){
                let job = new Job(response.data.data);
                job.track.download() //TODO manage when one of the steps fails, script stops running, set status failed and go on working
                    .then(() => {
                        job.put().status('downloaded')
                            .then((response) => {
                                console.log(response);
                                this.notification.status(job.job, 'downloaded');
                                this.downloader();
                            });
                    });
            } else {
                console.log('No tracks waiting to be downloaded');
            }
        });
    }

    recorder() {
        queue.first('downloaded').then((response) => {
            if(response.data.data != null) {
                let job = new Job(response.data.data);
                job.track.record()
                    .then((response) => {
                        if (response == 'success') {
                            console.log('recorded: ' + job.track.id); // TODO this should be inside record() method
                            job.put().status('recorded')
                                .then(() => {
                                    this.notification.status(job.job, 'recorded');
                                    this.recorder();
                                });
                        }
                    });
            } else {
                console.log('No tracks waiting to be recorded');
            }
        });
    }

    uploader() {
        queue.first('recorded').then((response) => {
            if(response.data.data != null) {
                let job = new Job(response.data.data);
                job.track.upload()
                    .then((response) => {
                        if (response == 'success') {
                            console.log('uploaded: ' + job.track.id); // TODO this should be inside record() method
                            job.put().status('uploaded')
                                .then(() => {
                                    this.notification.status(job.job, 'uploaded');
                                    this.uploader();
                                });
                        }
                    });
            } else {
                console.log('No tracks waiting to be uploaded');
            }
        });
    }

}

module.exports = Manager;