'use strict';

const urlConstants 	= require('./apiEndpoints');
const hostUrl 		= process.env.APP_URL;
const axios			= require('axios');
const fs			= require('fs');

class Track {
    constructor(track){
        this.track = track;
        this.id = track.id;
    }
    
    upload() {
        console.log('uploading: ' + this.track.id);
        return new Promise (function(resolve, reject){
            setTimeout(function(){
                resolve('success');
            }, 2000);
        })
    }

    record() {
        console.log('recording: ' + this.track.id);
        return new Promise (function(resolve, reject){
            setTimeout(function(){
                resolve('success');
            }, 2000);
        })
    }
    
    download(){
        var url  	= hostUrl + urlConstants.track.DOWNLOAD.url + this.track.id;
        var method	= urlConstants.track.DOWNLOAD.method;

        return axios({url: url, method: method, responseType: 'arraybuffer'})
            .then((download) => {
                console.log('Downloaded: ' + this.track.id);
                this.store(this.track.name, download.data);
            })
            .catch(function (error) {
                console.log('Could not download track');
                console.log(error);
            });
    }
    
    store(fileName, file){
        fs.writeFileSync(process.env.LOCAL_TRACKS_DIR + fileName, file);
        console.log('Stored: ' + fileName);
    }
    
    
}

module.exports = Track;