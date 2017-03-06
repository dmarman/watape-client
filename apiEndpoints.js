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
    queue: {
        GET_QUEUED_FILES: {
            method: 'GET',
            url: '/queue/files'
        },
        GET_QUEUED_TRACKS: {
            method: 'GET',
            url: '/queue/tracks'
        },
        GET_QUEUED_UPLOADS: {
            method: 'GET',
            url: '/queue/uploads'
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