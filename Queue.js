'use strict';

const urlConstants 	= require('./apiEndpoints');
const hostUrl 		= process.env.APP_URL;
const axios			= require('axios');

class Queue {
    get(listName) {
        var url, method;
        
        if(listName == 'waiting'){
            url		= hostUrl + urlConstants.queue.GET_QUEUE_WAITING.url;
            method	= urlConstants.queue.GET_QUEUE_WAITING.method;
        } else if (listName == 'downloaded') {
            url		= hostUrl + urlConstants.queue.GET_QUEUE_DOWNLOADED.url;
            method	= urlConstants.queue.GET_QUEUE_DOWNLOADED.method;
        } else if (listName == 'recorded') {
            url		= hostUrl + urlConstants.queue.GET_QUEUE_RECORDED.url;
            method	= urlConstants.queue.GET_QUEUE_RECORDED.method;
        } else if (listName == 'uploaded') {
            url		= hostUrl + urlConstants.queue.GET_QUEUE_UPLOADED.url;
            method	= urlConstants.queue.GET_QUEUE_UPLOADED.method;
        } else {
            console.log('Error: that list name does not exist');
        }

        return axios({url: url, method: method, headers: {'api-token': process.env.WATAPE_KEY}})
            .catch(function (error) {
                console.log('Could not get queue of ' + listName);
                console.log(error);
            });
    }
    
    first(listName) {
        var url, method;

        if(listName == 'waiting'){
            url		= hostUrl + urlConstants.queue.GET_FIRST_WAITING.url;
            method	= urlConstants.queue.GET_FIRST_WAITING.method;
        } else if (listName == 'downloaded') {
            url		= hostUrl + urlConstants.queue.GET_FIRST_DOWNLOADED.url;
            method	= urlConstants.queue.GET_FIRST_DOWNLOADED.method;
        } else if (listName == 'recorded') {
            url		= hostUrl + urlConstants.queue.GET_FIRST_RECORDED.url;
            method	= urlConstants.queue.GET_FIRST_RECORDED.method;
        } else if (listName == 'uploaded') {
            url		= hostUrl + urlConstants.queue.GET_FIRST_UPLOADED.url;
            method	= urlConstants.queue.GET_FIRST_UPLOADED.method;
        } else {
            console.log('Error: that list name does not exist, cannot get first');
        }

        return axios({url: url, method: method, headers: {'api-token': process.env.WATAPE_KEY}})
            .then((response) => {
                return response.data.data;
            })
            .catch(function (error) {
                console.log('Could not get first of queue of ' + listName);
                console.log(error);
            });
    }
    
}

module.exports = new Queue();
