import {Router} from "express";
import {DatabaseInterface} from "../../utils/database";

function getCredentialRouter(admin_firebase: any) {
    const db = new DatabaseInterface(admin_firebase, 'credentials');
    const router = Router();

    router.get('/credentials/', async (req, res, next) => {
        try {

            await db.getAll(function (credentials: any) {
                res.json(credentials);
            });

        } catch (e) {
            next(e);
        }
    });

    router.get('/credentials/:id', async (req, res, next) => {
        try {
            const id = req.params.id;

            await db.getOne(id)
                .then((credential: any) => {
                    if (!credential) {
                        res.status(404).json({message: 'Credential does not exists'})
                    } else {
                        res.json(credential);
                    }
                })

        } catch (e) {
            next(e);
        }
    });

    router.post('/credentials/', async (req, res, next) => {
        try {
            await db.create(req.body)
                .then((credential: any) => {
                    res.json(credential);
                })
        } catch (e) {
            next(e);
        }
    });

    router.put('/credentials/:id', async (req, res, next) => {
        try {
            await db.update(req.params.id, req.body, function (credential: any) {
                res.json(credential);
            })
        } catch (e) {
            next(e);
        }
    });

    router.delete('/credentials/:id', async (req, res, next) => {
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

export default getCredentialRouter;
