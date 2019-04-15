'use strict';

const app = require('./api/index').default;

const functions = require('firebase-functions');

exports.api = functions.https.onRequest((request: any, response: any) => {
    return app(request, response);
});
