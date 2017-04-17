'use strict';

const urlConstants 	= require('./apiEndpoints');
const hostUrl 		= process.env.APP_URL;
const axios			= require('axios');
const Track         = require('./Track.js');

class Job {
    constructor(job) {
        this.job = job;
        this.status = job.status;
        this.id = job.id;
        this.user = job.user;
        this.track = new Track(job.track);
    }
    
    put(){
        return {
            status: (jobStatus) => {
                var data = {queuedTrackId: this.id, status: jobStatus};
                var url = hostUrl + urlConstants.queuedTrack.UPDATE_STATUS.url + this.id;

                var method = urlConstants.queuedTrack.UPDATE_STATUS.method;
                this.status = jobStatus;
                
                return axios({url: url, method: method, data: data, headers: {'api-token': process.env.WATAPE_KEY}})
                    .then((response) => {
                        console.log('Status: ' + response.data.status);
                    })
                    .catch(function (error) {
                        console.log('Could not put().status of job');
                        console.log(error);
                    });
            }
        }
    }
    
}

module.exports = Job;
