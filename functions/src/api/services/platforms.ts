import {Router} from "express";
import {DatabaseInterface} from "../../utils/database";

function getPlatformRouter(admin_firebase: any) {
    const db_ref = 'configuration/platforms';
    const db = new DatabaseInterface(admin_firebase, db_ref);
    const router = Router();

    router.get('/platforms/', async (req, res, next) => {
        try {

            await db.read()
                .then((platforms: any) => {
                    res.json(platforms);
                })

        } catch (e) {
            next(e);
        }
    });

    router.get('/platforms/:scope/:id', async (req, res, next) => {
        try {
            const id = req.params.id;
            const scope = req.params.scope;

            await new DatabaseInterface(admin_firebase, db_ref + '/' + scope)
                .getOne(id)
                .then((platform: any) => {
                    if (!platform) {
                        res.status(404).json({message: 'platform does not exists'})
                    } else {
                        res.json(platform);
                    }
                })

        } catch (e) {
            next(e);
        }
    });

    router.post('/platforms/:scope/', async (req, res, next) => {
        try {
            const scope = req.params.scope;

            await new DatabaseInterface(admin_firebase, db_ref + '/' + scope)
                .create(req.body)
                .then((platform: any) => {
                    res.json(platform);
                })
        } catch (e) {
            next(e);
        }
    });

    router.put('/platforms/:scope/:id', async (req, res, next) => {
        try {
            const scope = req.params.scope;

            await new DatabaseInterface(admin_firebase, db_ref + '/' + scope)
                .update(req.params.id, req.body, function (platform: any) {
                res.json(platform);
            })
        } catch (e) {
            next(e);
        }
    });

    router.delete('/platforms/:scope/:id', async (req, res, next) => {
        try {
            const id = req.params.id;
            const scope = req.params.scope;

            await new DatabaseInterface(admin_firebase, db_ref + '/' + scope)
                .delete(id);
            res.json({
                id
            });
        } catch (e) {
            next(e);
        }
    });

    return router;
}

export default getPlatformRouter;
