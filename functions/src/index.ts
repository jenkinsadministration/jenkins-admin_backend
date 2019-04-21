'use strict';

const jobsServer = require('./jobs/index').default;
const app = require('./api/index').default;
const graphQLServer = require('./graphql/server').default;

const functions = require('firebase-functions');

exports.query = functions.https.onRequest((request: any, response: any) => {
    return graphQLServer(request, response);
});

exports.api = functions.https.onRequest((request: any, response: any) => {
    return app(request, response);
});

exports.jobs = functions.https.onRequest((request: any, response: any) => {
    return jobsServer(request, response);
});

