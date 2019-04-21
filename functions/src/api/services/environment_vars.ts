import {Router} from "express";
import {DatabaseInterface} from "../../utils/database";

function getEnvironmentVarRouter(admin_firebase: any) {
    const db = new DatabaseInterface(admin_firebase, 'environment_vars');
    const router = Router();

    router.get('/environment_vars/', async (req, res, next) => {
        try {

            await db.getAll(function (environment_vars: any) {
                res.json(environment_vars);
            });

        } catch (e) {
            next(e);
        }
    });

    router.get('/environment_vars/:id', async (req, res, next) => {
        try {
            const id = req.params.id;

            await db.getOne(id)
                .then((environment_var: any) => {
                    if (!environment_var) {
                        res.status(404).json({message: 'Environment variable does not exists'})
                    } else {
                        res.json(environment_var);
                    }
                })

        } catch (e) {
            next(e);
        }
    });

    router.post('/environment_vars/', async (req, res, next) => {
        try {
            await db.create(req.body)
                .then((environment_var: any) => {
                    res.json(environment_var);
                })
        } catch (e) {
            next(e);
        }
    });

    router.put('/environment_vars/:id', async (req, res, next) => {
        try {
            await db.update(req.params.id, req.body, function (environment_var: any) {
                res.json(environment_var);
            })
        } catch (e) {
            next(e);
        }
    });

    router.delete('/environment_vars/:id', async (req, res, next) => {
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

export default getEnvironmentVarRouter;
