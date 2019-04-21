import {DatabaseInterface} from "../utils/database";
import {Router} from "express";

const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

const admin_firebase = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://jenkinsadmin.firebaseio.com'
}, 'jobs');

const jobsServer = express();

jobsServer.use(cors({origin: true}));

jobsServer.use(express.json());

const db = new DatabaseInterface(admin_firebase, 'projects');
const router = Router();

router.get('*', async (req, res, next) => {
    try {

        let jobsResult: any[] = [];
        await db
            .read()
            .then((projects: any) => {

                for (const k in projects) {
                    if (projects.hasOwnProperty(k)) {

                        if (projects[k].hasOwnProperty('jobs')) {
                            const jobs: any = projects[k]['jobs'];

                            const test_jobs = jobs.hasOwnProperty('test') ? jobs['test'] : [];
                            const build_jobs = jobs.hasOwnProperty('build') ? jobs['build'] : [];

                            for (const j in test_jobs) {
                                jobsResult.push(test_jobs[j]);
                            }

                            for (const j in build_jobs) {
                                jobsResult.push(build_jobs[j]);
                            }
                        }

                    }
                }
            }).catch((e) => {
                console.error(e);
            });

        res.json(jobsResult);

    } catch (e) {
        next(e);
    }
});

jobsServer.use(router);

export default jobsServer;
