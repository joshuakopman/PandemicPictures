const express = require('express');
const router = express.Router();
const { NomineeProvider } = require('../providers/nomineeProvider.js');
const { IMDBProvider } = require('../providers/imdbProvider.js');

const NomNomProvider = new NomineeProvider();
const imdbProvider = new IMDBProvider();

router.get('/getIMDBMetadata', async (req, res, next) => {
	console.log(NomNomProvider.readMoviesFromDisk());
    var moviesFormatted = NomNomProvider.readMoviesFromDisk().MoviesList.map(y => y.Movies.map(z => { return { "Year": y.Year,"Name" : z.Name} } ));
    var flattedMovies = [].concat.apply([],moviesFormatted);
    var allMetadata = await imdbProvider.getIMDBMetadata(flattedMovies);
    res.json(allMetadata);
});

module.exports = router;
