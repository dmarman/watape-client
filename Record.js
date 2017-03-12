'use strict';

const Track = require('./Track.js');
const hostUrl 		= process.env.APP_URL;
const urlConstants 	= require('./apiEndpoints');
const axios			= require('axios');
const fs			= require('fs');
const FormData      = require('form-data');

class Record extends Track {
    
    constructor(job){
        super(job.track);
        this.jobId = job.id;
    }
    
    upload() {
        console.log('uploading: ' + this.track.id);

        var url  	= hostUrl + urlConstants.record.UPLOAD.url;
        var method	= urlConstants.record.UPLOAD.method;

        const data = new FormData();
        
        data.append('trackId', this.id);
        data.append('queuedTrackId', this.jobId);
        
        data.append('file', fs.createReadStream('./records/' + this.name));

        return axios.post(url, data, {headers: data.getHeaders()})
            .then()
            .catch((error) => {
                console.log(error);
            });
    }

    delete() {
        fs.unlink('./records/' + this.name, (err) => {
            if(err) throw err;
        });
    }

}

module.exports = Record;