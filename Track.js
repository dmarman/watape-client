'use strict';

const urlConstants 	= require('./apiEndpoints');
const hostUrl 		= process.env.APP_URL;
const axios			= require('axios');
const fs			= require('fs');
const FormData      = require('form-data');
const cmd           = require('node-cmd');

class Track {
    constructor(track){
        this.track = track;
        this.id = track.id;
        this.path = track.path;
        this.name = track.name;
        this.recordEndOffset = 1;
        this.duration = Number(track.duration) + this.recordEndOffset;
    }
    
    upload(jobId = null) {
        console.log('uploading: ' + this.track.id);
        
        var headers;
        var url  	= hostUrl + urlConstants.record.UPLOAD.url;
        var method	= urlConstants.record.UPLOAD.method;

        const data = new FormData();
        if(jobId != null){ //TODO this can be deleted
             data.append('trackId', this.id);
             data.append('queuedTrackId', jobId);
        }
        data.append('file', fs.createReadStream('./records/' + this.name));

        headers = data.getHeaders();
        headers['api-token'] = process.env.WATAPE_KEY;

        return axios.post(url, data, {headers: headers, maxRedirects: 0})
                    .then()
                    .catch((error) => {
                        console.log(error);
                    });
    }

    record() {

        console.log('recording: ' + this.id);
        cmd.get(
            'aplay -v -D plughw:UA25 '+ this.path +'',
            function(){
                console.log('ended playing');

            });

        return new Promise ((resolve, reject) => {
            //console.log('arecord -f dat -D plughw:UA25 -d '+ this.duration +' records/'+ this.name +'');
            cmd.get('arecord -f dat -D plughw:UA25 -d '+ this.duration + ' records/'+ this.name +'', function(){

                console.log('stopped recording');
                return resolve('success');
            })
        });

        }

    copy(destinationPath, sourcePath){
        fs.readFile(sourcePath, function (err, data) {
            if (err) throw err; //TODO throw blocks the program?
            fs.writeFile(destinationPath, data, function(err) {
                if (err) throw err;
            });
        });
    }

    delete() {
        fs.unlink(this.path, (err) => {
            if(err) throw err;
        });
    }
    
    download(){
        var url  	= hostUrl + urlConstants.track.DOWNLOAD.url + this.track.id;
        var method	= urlConstants.track.DOWNLOAD.method;

        return axios({url: url, method: method, headers: {'api-token': process.env.WATAPE_KEY}, responseType: 'arraybuffer'})
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
