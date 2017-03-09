'use strict';

const urlConstants 	= require('./apiEndpoints');
const hostUrl 		= process.env.APP_URL;
const axios			= require('axios');


class Job {
    constructor(job) {
        this.job = job;
        this.status = job.status;
    }
    
    put(){
        return {
            status: (jobStatus) => {
                var data 		= {queuedTrackId: this.job.id, status: jobStatus};
                var url  		= hostUrl + urlConstants.queuedTrack.UPDATE_STATUS.url + this.job.id;

                var method		= urlConstants.queuedTrack.UPDATE_STATUS.method;
                this.status = jobStatus;

                return axios({url: url, method: method, data: data})
                    .then((response) => {
                        console.log('Status updated: ' + response.data.status);
                       
                    })
                    .catch(function (error) {
                        console.log('Could not putStatus');
                        console.log(error);
                    });
            }
        }
    }
    


    
}

module.exports = Job;
