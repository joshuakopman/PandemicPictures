const express = require('express');
const router = express.Router();
const { NomineeProvider } = require('../providers/nomineeProvider.js');
const NomNomProvider = new NomineeProvider();

router.get('/', (req, res, next)  => {
    res.json(NomNomProvider.readMoviesFromDisk());
});

router.post('/write', function(req, res, next) {
    NomNomProvider.writeMoviesToDisk(req.body);
    req.writeConfig.wsServer.clients.forEach(function each(client) {
        if (client.readyState === req.writeConfig.ws.OPEN) {
            client.send('JSONUpdated');
        }
    });    
});


module.exports = router;
