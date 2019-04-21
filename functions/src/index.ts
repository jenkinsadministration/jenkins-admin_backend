'use strict';

const app = require('./api/index').default;
const graphQLServer = require('./graphql/server').default;

const functions = require('firebase-functions');

// https://us-central1-<project-name>.cloudfunctions.net/api
exports.query = functions.https.onRequest((request: any, response: any) => {
    return graphQLServer(request, response);
});

exports.api = functions.https.onRequest((request: any, response: any) => {
    return app(request, response);
});

