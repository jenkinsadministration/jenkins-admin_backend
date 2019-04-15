import {Router} from "express";
import {DatabaseInterface} from "../../utils/database";

function create_test_job(db: DatabaseInterface, project: any, platform: string, browser: string) {
    const job = {
        full_name: project.data.path + '/Test/' + platform,
        setup: {
            template: 'test_template.xml',
            repository: '',
            branch: '',
            log_rotate: 3,
            cron: {
                poll_scm: '',
                build: ''
            },
            parameters: []
        },
        athenea_project: {
            project_id: '',
            environment_id: ''
        },
        type: 'TEST',
        platform: platform,
        browser: browser
    };

    db.create(job)
}

function create_build_job(db: DatabaseInterface, project: any, platform: string) {
    const job = {
        full_name: project.data.path + '/Build/' + platform,
        setup: {
            template: 'build_' + platform.toString().toLowerCase() + '_template.xml',
            repository: '',
            branch: '',
            log_rotate: 3,
            cron: {
                poll_scm: '',
                build: ''
            },
            parameters: []
        },
        type: 'BUILD',
        platform: platform
    };

    db.create(job)
}

function remove_test_jobs(db: DatabaseInterface, project: any, config: any) {
    if (project.data.hasOwnProperty('jobs') && project.data.jobs.hasOwnProperty('test')) {

        for (const j in project.data.jobs['test']) {

            if (project.data.jobs['test'].hasOwnProperty(j)) {

                const job: any = project.data.jobs['test'][j];

                if (!project.data.test_jobs.includes(job.platform)) {
                    db.delete(j).catch((e) => (console.error(e)));
                } else {
                    if (!config.available_test_platforms.hasOwnProperty(job.platform)){
                        db.delete(j).catch((e) => (console.error(e)));
                    }else {
                        if (!config.available_test_platforms[job.platform].includes(job.browser)){
                            db.delete(j).catch((e) => (console.error(e)));
                        }
                    }
                }

            }
        }
    }
}

function remove_build_jobs(db: DatabaseInterface, project: any, config: any) {
    if (project.data.hasOwnProperty('jobs') && project.data.jobs.hasOwnProperty('build')) {

        for (const j in project.data.jobs['build']) {

            if (project.data.jobs['build'].hasOwnProperty(j)) {

                const job: any = project.data.jobs['build'][j];

                if (!project.data.build_jobs.includes(job.platform)) {
                    db.delete(j).catch((e) => (console.error(e)));
                } else {
                    if (!config.available_build_platforms.includes(job.platform)){
                        db.delete(j).catch((e) => (console.error(e)));
                    }
                }

            }
        }
    }
}

function projectHasTheJob(project: any, type: string, platform: string, browser?: string) {

    if (project.hasOwnProperty('jobs') && project.jobs.hasOwnProperty(type.toLowerCase())) {

        for (const j in project.jobs[type.toLowerCase()]) {

            if (project.jobs[type.toLowerCase()].hasOwnProperty(j)) {

                const job: any = project.jobs[type.toLowerCase()][j];

                if (type === 'TEST' && browser !== undefined) {
                    if (job['platform'] === platform && job['browser'] === browser) {
                        return true;
                    }
                } else {
                    if (job['platform'] === platform) {
                        return true;
                    }
                }
            }
        }
    }

    return false;
}

function sync_jobs(admin_firebase: any, projectId: string, isCreation: boolean) {

    const config_db = new DatabaseInterface(
        admin_firebase, 'global_configuration'
    );

    config_db.read()
        .then((config) => {

            const db = new DatabaseInterface(admin_firebase, 'projects');

            db.getOne(projectId)
                .then((project) => {

                    let local_db = new DatabaseInterface(
                    admin_firebase, `projects/${project.id}/jobs/test`
                );

                    if (project.data.hasOwnProperty('test_jobs')) {

                        for (let j in project.data.test_jobs) {

                            if (project.data.test_jobs.hasOwnProperty(j)) {

                                const platform = project.data.test_jobs[j];

                                for (let b in config.available_test_platforms[platform]) {

                                    const browser = config.available_test_platforms[platform][b];

                                    const hasTheJob = projectHasTheJob(project.data, 'TEST', platform, browser);

                                    if (isCreation || !hasTheJob) {
                                        create_test_job(
                                            local_db,
                                            project,
                                            platform,
                                            browser
                                        );
                                    }
                                }

                            }
                        }

                    } else {
                        project.data['test_jobs'] = [];
                    }

                    if (!isCreation) {
                        remove_test_jobs(local_db, project, config);
                    }

                    local_db = new DatabaseInterface(
                        admin_firebase, `projects/${project.id}/jobs/build`
                    );

                    if (project.data.hasOwnProperty('build_jobs')) {

                        for (let j in project.data.build_jobs) {

                            const platform = project.data.build_jobs[j];

                            if (isCreation || !projectHasTheJob(project.data, 'BUILD', platform)) {
                                create_build_job(local_db, project, platform);
                            }
                        }

                    } else {
                        project.data['build_jobs'] = [];
                    }

                    if (!isCreation) {
                        remove_build_jobs(local_db, project, config);
                    }

                })

        });

}

function getProjectRouter(admin_firebase: any) {
    const db = new DatabaseInterface(admin_firebase, 'projects');
    const router = Router();

    router.get('/projects/', async (req, res, next) => {
        try {

            await db.getAll(function (projects: any) {
                res.json(projects);
            });

        } catch (e) {
            next(e);
        }
    });

    router.get('/projects/:id', async (req, res, next) => {
        try {
            const id = req.params.id;

            await db.getOne(id)
                .then((project: any) => {
                    if (!project) {
                        res.status(404).json({message: 'Project does not exists'})
                    } else {
                        res.json(project);
                    }
                })

        } catch (e) {
            next(e);
        }
    });

    router.post('/projects/', async (req, res, next) => {
        try {
            await db.create(req.body)
                .then((project: any) => {

                    sync_jobs(admin_firebase, project.id, true);

                    res.json(project);

                })
        } catch (e) {
            next(e);
        }
    });

    router.put('/projects/:id', async (req, res, next) => {
        try {
            await db.update(req.params.id, req.body, function (project: any) {

                sync_jobs(admin_firebase, project.id, false);

                res.json(project);

            })
        } catch (e) {
            next(e);
        }
    });

    router.delete('/projects/:id', async (req, res, next) => {
        try {
            const id = req.params.id;
            await db.delete(id);
            res.json({
                id
            });
        } catch (e) {
            next(e);
        }
    });

    return router;
}

export default getProjectRouter;
