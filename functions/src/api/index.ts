import getProjectRouter from "./services/projects";
import getJobRouter from "./services/jenkins_jobs";
import getConfigRouter from "./services/global_configuration";
import getPluginRouter from "./services/plugins";
import getPlatformRouter from "./services/platforms";

const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const cookieParser = require('cookie-parser')();

const defaultApp = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://jenkinsadmin.firebaseio.com'
}, 'api');

const app = express();

const validateFirebaseIdToken = async (req: any, res: any, next: any) => {
    console.log('Check if request is authorized with Firebase ID token');

    if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
        !(req.cookies && req.cookies.__session)) {
        console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
            'Make sure you authorize your request by providing the following HTTP header:',
            'Authorization: Bearer <Firebase ID Token>',
            'or by passing a "__session" cookie.');
        res.status(403).send('Unauthorized');
        return;
    }

    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        console.log('Found "Authorization" header');
        // Read the ID Token from the Authorization header.
        idToken = req.headers.authorization.split('Bearer ')[1];
    } else if(req.cookies) {
        console.log('Found "__session" cookie');
        // Read the ID Token from cookie.
        idToken = req.cookies.__session;
    } else {
        // No cookie
        res.status(403).send('Unauthorized');
        return;
    }

    try {
        req.user = await defaultApp.auth().verifyIdToken(idToken);
        next();
        return;
    } catch (error) {
        console.error('Error while verifying Firebase ID token:', error);
        res.status(403).send('Unauthorized');
        return;
    }
};

app.use(cors({origin: true}));

app.use(cookieParser);

app.use(validateFirebaseIdToken);

app.use(express.json());

app.use(getProjectRouter(defaultApp));
app.use(getJobRouter(defaultApp));
app.use(getConfigRouter(defaultApp));
app.use(getPluginRouter(defaultApp));
app.use(getPlatformRouter(defaultApp));

export default app;
