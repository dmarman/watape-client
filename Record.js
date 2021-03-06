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

        var headers;
        var url  	= hostUrl + urlConstants.record.UPLOAD.url;
        var method	= urlConstants.record.UPLOAD.method;

        const data = new FormData();
        
        data.append('trackId', this.id);
        data.append('queuedTrackId', this.jobId);
        
        data.append('file', fs.createReadStream('./records/' + this.name));

        headers = data.getHeaders();
        headers['api-token'] = process.env.WATAPE_KEY;

        //Bug solution: https://www.bountysource.com/issues/40477305-file-upload-in-node-js-is-broken

        return axios.post(url, data, {headers: headers, maxRedirects: 0})
            .then((response) => {
                if (response.data.success == true) {
                    console.log('uploaded: ' + response.data.record.id);
                    return response
                }
            })
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