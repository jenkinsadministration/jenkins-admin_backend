import {Router} from "express";
import {DatabaseInterface} from "../../utils/database";


function getConfigRouter(admin_firebase: any) {
    const db = new DatabaseInterface(admin_firebase, 'global_configuration');
    const router = Router();

    router.get('/global_configuration/', async (req, res, next) => {
        try {

            await db.read().then((config: any) => {
                if (!config) {
                    res.status(404).json({message: 'config does not exists'})
                } else {
                    res.json(config);
                }
            })

        } catch (e) {
            next(e);
        }
    });

    router.get('/global_configuration/:id', async (req, res, next) => {
        try {
            const id = req.params.id;

            await db.getOne(id)
                .then((config: any) => {
                    if (!config) {
                        res.status(404).json({message: 'config does not exists'})
                    } else {
                        res.json(config);
                    }
                })

        } catch (e) {
            next(e);
        }
    });

    router.post('/global_configuration/', async (req, res, next) => {
        try {
            await db.create(req.body)
                .then((config: any) => {
                    res.json(config);
                })
        } catch (e) {
            next(e);
        }
    });

    router.put('/global_configuration/:id', async (req, res, next) => {
        try {
            await db.update(req.params.id, req.body, function (config: any) {
                res.json(config);
            })
        } catch (e) {
            next(e);
        }
    });

    router.delete('/global_configuration/:id', async (req, res, next) => {
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

export default getConfigRouter;
