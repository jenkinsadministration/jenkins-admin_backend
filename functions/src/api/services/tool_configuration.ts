import {Router} from "express";
import {DatabaseInterface} from "../../utils/database";

function getToolConfigurationRouter(admin_firebase: any) {
    const db = new DatabaseInterface(admin_firebase, 'tool_configurations');
    const router = Router();

    router.get('/tool_configurations/', async (req, res, next) => {
        try {

            await db.getAll(function (tool_configurations: any) {
                res.json(tool_configurations);
            });

        } catch (e) {
            next(e);
        }
    });

    router.get('/tool_configurations/:id', async (req, res, next) => {
        try {
            const id = req.params.id;

            await db.getOne(id)
                .then((tool_configuration: any) => {
                    if (!tool_configuration) {
                        res.status(404).json({message: 'Tool Configuration does not exists'})
                    } else {
                        res.json(tool_configuration);
                    }
                })

        } catch (e) {
            next(e);
        }
    });

    router.post('/tool_configurations/', async (req, res, next) => {
        try {
            await db.create(req.body)
                .then((tool_configuration: any) => {
                    res.json(tool_configuration);
                })
        } catch (e) {
            next(e);
        }
    });

    router.put('/tool_configurations/:id', async (req, res, next) => {
        try {
            await db.update(req.params.id, req.body, function (tool_configuration: any) {
                res.json(tool_configuration);
            })
        } catch (e) {
            next(e);
        }
    });

    router.delete('/tool_configurations/:id', async (req, res, next) => {
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

export default getToolConfigurationRouter;
