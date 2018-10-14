'use strict'

if (process.env.NODE_ENV == 'TESTING') {
    const dotenv = require('dotenv').config({path: '.test.env' });
    if (dotenv.error) {
        throw dotenv.error;
    }
} else if(process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}