const express = require('express');
const router = express.Router();
const { IMDBProvider } = require('../providers/imdbProvider.js');
const imdbProvider = new IMDBProvider();
const allMetadata = imdbProvider.readRatingsFromDisk();

router.get('/', (req, res, next) => {
    res.json(allMetadata);
});


module.exports = router;
