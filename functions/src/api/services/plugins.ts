import {Router} from "express";
import {DatabaseInterface} from "../../utils/database";

function getPluginRouter(admin_firebase: any) {
    const db = new DatabaseInterface(admin_firebase, 'plugins');
    const router = Router();

    router.get('/plugins/', async (req, res, next) => {
        try {

            await db.getAll(function (plugins: any) {
                res.json(plugins);
            });

        } catch (e) {
            next(e);
        }
    });

    router.get('/plugins/:id', async (req, res, next) => {
        try {
            const id = req.params.id;

            await db.getOne(id)
                .then((plugin: any) => {
                    if (!plugin) {
                        res.status(404).json({message: 'Plugin does not exists'})
                    } else {
                        res.json(plugin);
                    }
                })

        } catch (e) {
            next(e);
        }
    });

    router.post('/plugins/', async (req, res, next) => {
        try {
            await db.create(req.body)
                .then((plugin: any) => {
                    res.json(plugin);
                })
        } catch (e) {
            next(e);
        }
    });

    router.put('/plugins/:id', async (req, res, next) => {
        try {
            await db.update(req.params.id, req.body, function (plugin: any) {
                res.json(plugin);
            })
        } catch (e) {
            next(e);
        }
    });

    router.delete('/plugins/:id', async (req, res, next) => {
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

export default getPluginRouter;
