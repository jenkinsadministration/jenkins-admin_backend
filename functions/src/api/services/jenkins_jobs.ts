import {Router} from "express";
import {DatabaseInterface} from "../../utils/database";


function getJobRouter(admin_firebase: any) {
    const db = new DatabaseInterface(admin_firebase, 'jobs');
    const router = Router();

    router.get('/projects/:projectId/jobs/', async (req, res, next) => {
        try {
            await db.setParent(`projects/${req.params.projectId}`).getAll(function (jobs: any) {
                res.json(jobs);
            });

        } catch (e) {
            next(e);
        }
    });

    router.get('/projects/:projectId/jobs/:id', async (req, res, next) => {
        try {
            const id = req.params.id;

            await db.setParent(`projects/${req.params.projectId}`).getOne(id)
                .then((job: any) => {
                    if (!job) {
                        res.status(404).json({message: 'Project does not exists'})
                    } else {
                        res.json(job);
                    }
                })

        } catch (e) {
            next(e);
        }
    });

    router.post('/projects/:projectId/jobs/', async (req, res, next) => {
        try {

            await db.setParent(`projects/${req.params.projectId}`).create(req.body)
                .then((job: any) => {
                    res.json(job);
                })

        } catch (e) {
            next(e);
        }
    });

    router.put('/projects/:projectId/jobs/:id', async (req, res, next) => {
        try {
            await db.setParent(`projects/${req.params.projectId}`).update(req.params.id, req.body, function (job: any) {
                res.json(job);
            })
        } catch (e) {
            next(e);
        }
    });

    router.delete('/projects/:projectId/jobs/:id', async (req, res, next) => {
        try {
            const id = req.params.id;
            await db.setParent(`projects/${req.params.projectId}`).delete(id);
            res.json({
                id
            });
        } catch (e) {
            next(e);
        }
    });

    return router;
}

export default getJobRouter;
