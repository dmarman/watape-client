'use strict';
const Datastore = require('nedb');
const Options = require('../database/seeds/options.js');
const db = {};

db.options = new Datastore({ filename: 'database/documents/options.db', autoload: true });

db.options.insert(Options, function(){
    console.log('Seeded')
});