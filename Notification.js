'use strict';

class Notification {
    constructor(pusher){
        this.pusher = pusher;
    }
    
    status(job, jobStatus, record = null){
        var userChannel = 'private-App.User.' + job.user.id;
        console.log(userChannel);
        this.pusher.trigger(userChannel, 'App\\Events\\trackStatus', {
            trackQueued: job,
            status: jobStatus,
            record: record
        });
    }
    
}

module.exports = Notification;