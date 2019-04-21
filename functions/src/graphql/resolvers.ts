const admin = require('firebase-admin');
import {DatabaseInterface} from "../utils/database";

const admin_firebase = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://jenkinsadmin.firebaseio.com'
}, 'query');


const resolvers: any = {
    Query: {
        async environment_vars() {
            let environmentVarsResult: any[] = [];
            await new DatabaseInterface(admin_firebase, 'environment_vars')
                .getAll((environment_vars: any) => {
                    environmentVarsResult = environment_vars
                }).catch((e) => {
                    console.error(e);
                });
            return environmentVarsResult;
        },
        async tool_configurations() {
            let toolConfigurationsResult: any[] = [];
            await new DatabaseInterface(admin_firebase, 'tool_configurations')
                .getAll((tool_configurations: any) => {
                    toolConfigurationsResult = tool_configurations
                }).catch((e) => {
                    console.error(e);
                });
            return toolConfigurationsResult;
        },
        async credentials() {
            let credentialsResult: any[] = [];
            await new DatabaseInterface(admin_firebase, 'credentials')
                .getAll((credentials: any) => {
                    credentialsResult = credentials
                }).catch((e) => {
                    console.error(e);
                });
            return credentialsResult;
        },
        async plugins() {
            let pluginsResult: any[] = [];
            await new DatabaseInterface(admin_firebase, 'plugins')
                .getAll((plugins: any) => {
                    pluginsResult = plugins
                }).catch((e) => {
                    console.error(e);
                });
            return pluginsResult;
        },
        async jobs(){
            let jobsResult: any[] = [];
            await new DatabaseInterface(admin_firebase, 'projects')
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
            return jobsResult;
        },
        async projects() {
            let projectsResult: any[] = [];
            await new DatabaseInterface(admin_firebase, 'projects')
                .read()
                .then((projects: any) => {

                    for (const k in projects) {
                        if (projects.hasOwnProperty(k)) {

                            if (projects[k].hasOwnProperty('jobs')) {
                                const jobs = projects[k]['jobs'];

                                const new_jobs: any = {
                                    test: [],
                                    build: []
                                };

                                const test_jobs = jobs.hasOwnProperty('test') ? jobs['test'] : [];
                                const build_jobs = jobs.hasOwnProperty('build') ? jobs['build'] : [];

                                for (const j in test_jobs) {
                                    new_jobs.test.push(test_jobs[j]);
                                }

                                for (const j in build_jobs) {
                                    new_jobs.build.push(build_jobs[j]);
                                }

                                projects[k]['jobs'] = new_jobs;
                            }


                            projectsResult.push({
                                id: k,
                                data: projects[k]
                            });
                        }
                    }
                }).catch((e) => {
                    console.error(e);
                });
            return projectsResult;
        }
    },
    Job: {},
    Credential: {},
    EnvironmentVar: {},
    ToolConfiguration: {},
    Plugin: {},
    Project: {}
};

export {resolvers};

