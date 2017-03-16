'use strict';

var urlConstants =  {
    queuedTrack: {
        UPDATE_STATUS: {
            method: 'PUT',
            url: '/api/queued-track/'
        }
    },
    track: {
        DOWNLOAD: {
            method: 'GET',
            url: '/api/track/download/'
        }
    },
    record: {
        UPLOAD: {
            method: 'POST',
            url: '/api/record'
        }
    },
    queue: {
        GET_QUEUE_WAITING: {
            method: 'GET',
            url: '/api/queue/waiting'
        },
        GET_QUEUE_DOWNLOADED: {
            method: 'GET',
            url: '/api/queue/downloaded'
        },
        GET_QUEUE_RECORDED: {
            method: 'GET',
            url: '/api/queue/recorded'
        },
        GET_QUEUE_UPLOADED: {
            method: 'GET',
            url: '/api/queue/uploaded'
        },
        GET_FIRST_WAITING: {
            method: 'GET',
            url: '/api/queue/waiting/first'
        },
        GET_FIRST_DOWNLOADED: {
            method: 'GET',
            url: '/api/queue/downloaded/first'
        },
        GET_FIRST_RECORDED: {
            method: 'GET',
            url: '/api/queue/recorded/first'
        },
        GET_FIRST_UPLOADED: {
            method: 'GET',
            url: '/api/queue/uploaded/first'
        }
    }
};

module.exports = urlConstants;