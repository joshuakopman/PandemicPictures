const express = require('express');
const router = express.Router();
const { NomineeProvider } = require('../providers/nomineeProvider.js');
const NomNomProvider = new NomineeProvider();

router.get('/', (req, res, next)  => {
    res.json(NomNomProvider.readMoviesFromDisk());
});

router.post('/', (req, res, next) => {
    NomNomProvider.writeMoviesToDisk(req.body);
    req.writeConfig.wsServer.clients.forEach(function each(client) {
        if (client.readyState === req.writeConfig.ws.OPEN) {
            client.send('JSONUpdated');
        }
    });  

    return res.status(200).send();
});


module.exports = router;
