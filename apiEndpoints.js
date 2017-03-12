'use strict';

var urlConstants =  {
    queuedTrack: {
        GET_FIRST_IN: {
            method: 'GET',
            url: '/queued-track/first-in'
        },
        UPDATE_STATUS: {
            method: 'PUT',
            url: '/queued-track/'
        }
    },
    track: {
        DOWNLOAD: {
            method: 'GET',
            url: '/track/download/'
        }
    },
    record: {
        UPLOAD: {
            method: 'POST',
            url: '/record'
        }
    },
    queue: {
        GET_QUEUE_WAITING: {
            method: 'GET',
            url: '/queue/waiting'
        },
        GET_QUEUE_DOWNLOADED: {
            method: 'GET',
            url: '/queue/downloaded'
        },
        GET_QUEUE_RECORDED: {
            method: 'GET',
            url: '/queue/recorded'
        },
        GET_QUEUE_UPLOADED: {
            method: 'GET',
            url: '/queue/uploaded'
        },
        GET_FIRST_WAITING: {
            method: 'GET',
            url: '/queue/waiting/first'
        },
        GET_FIRST_DOWNLOADED: {
            method: 'GET',
            url: '/queue/downloaded/first'
        },
        GET_FIRST_RECORDED: {
            method: 'GET',
            url: '/queue/recorded/first'
        },
        GET_FIRST_UPLOADED: {
            method: 'GET',
            url: '/queue/uploaded/first'
        }
    },
    file: {
        GET_FILE: {
            method: 'GET',
            url: '/file/'
        }
    }
};

module.exports = urlConstants;