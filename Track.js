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
        this.recordEndOffset = 10;
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

    record(configuration) {
        console.log('recording: ' + this.id);
        let volumePlay = 1;
        let volumePostProcessed = 1.38;
        
        if(configuration.parameter_1 === 1){
            volumePlay = 0.21;
            volumePostProcessed = 4.54;
        }

        if(configuration.parameter_1 === 2){
            volumePlay = 0.63;
            volumePostProcessed = 1.9;
        }
        
        setTimeout(() => {
            //0.1
            cmd.get('play --volume ' + volumePlay + ' '+ this.path +'',
                function(err, data){
                    if (!err) {
                        console.log(data)
                    } else {
                        console.log('error: ', err)
                    }
                    console.log('ended playing');
                });
        }, 4000);
        
        return new Promise ((resolve, reject) => {
            //console.log('arecord -f dat -D plughw:UA25 -d '+ this.duration +' records/'+ this.name +'');
            cmd.get('arecord -f cd --buffer-size=192000 -D plughw:UA25 -d '+ Math.round(this.duration) + ' records/'+ this.name +'', (err, data) => {
            //cmd.get('rec records/'+ this.name +' trim 0 '+ Math.round(this.duration), (err, data) => {

                if (!err) {
                    console.log(data)
                } else {
                    console.log('error: ', err)
                }
                //4.54
                cmd.get('sox --volume ' + volumePostProcessed + ' records/' + this.name + ' records/EQ_' + this.name + ' equalizer 40 0.6 +6 equalizer 12000 1.1 +8', () => {
                    cmd.get('sudo rm records/' + this.name,() => {
                        cmd.get('sudo mv records/EQ_' + this.name + ' records/' + this.name, () => {
                            return resolve('success');
                        });
                    });
                });
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
