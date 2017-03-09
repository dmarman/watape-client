'use strict';

const urlConstants 	= require('./apiEndpoints');
const hostUrl 		= process.env.APP_URL;
const axios			= require('axios');

class Queue {
    get(listName) {
        var url, method;
        
        if(listName == 'files'){
            url		= hostUrl + urlConstants.queue.GET_QUEUED_FILES.url;
            method	= urlConstants.queue.GET_QUEUED_FILES.method;
        } else if (listName == 'tracks') {
            url		= hostUrl + urlConstants.queue.GET_QUEUED_TRACKS.url;
            method	= urlConstants.queue.GET_QUEUED_TRACKS.method;
        } else if (listName == 'uploads') {
            url		= hostUrl + urlConstants.queue.GET_QUEUED_UPLOADS.url;
            method	= urlConstants.queue.GET_QUEUED_UPLOADS.method;
        } else {
            console.log('Error: that list name does not exist');
        }

        return axios({url: url, method: method})
            .catch(function (error) {
                console.log('Could not get queue of ' + listName);
                console.log(error);
            });
    }
}

module.exports = new Queue();