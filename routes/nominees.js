import express from 'express';
import { NomineeProvider } from '../providers/nomineeProvider.js';

const router = express.Router();

router.get('/', (req, res, next) => {
    res.json(new NomineeProvider(req.query.userOne, req.query.userTwo).readMoviesFromDisk(req.query.limit, req.query.skip));
});

router.post('/', (req, res, next) => {
    new NomineeProvider(req.query.userOne, req.query.userTwo).writeMoviesToDisk(req.body);
    req.writeConfig.wsServer.clients.forEach(function each(client) {
        if (client.readyState === req.writeConfig.ws.OPEN) {
            client.send('JSONUpdated');
        }
    });

    return res.status(200).send();
});


export default router;
