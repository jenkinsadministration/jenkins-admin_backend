import getProjectRouter from "./services/projects";
import getJobRouter from "./services/jenkins_jobs";
import getConfigRouter from "./services/global_configuration";

const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

const defaultApp = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://jenkinsadmin.firebaseio.com'
}, 'api');

const app = express();

app.use(cors({origin: true}));

app.use(express.json());

app.use(getProjectRouter(defaultApp));
app.use(getJobRouter(defaultApp));
app.use(getConfigRouter(defaultApp));

export default app;
