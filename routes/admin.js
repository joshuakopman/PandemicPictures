const express = require('express');
const fs = require("fs");
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

router.get('/addYearsToJSON', async (req, res, next) => {
    var moviesFormatted= NomNomProvider.readMoviesFromDisk().MoviesList.map(y => y.Movies.map(z => { return { "Year": y.Year,"Name" : z.Name} } ));
    var flattedMovies = [].concat.apply([],moviesFormatted);
    
    let raw = fs.readFileSync('./mocks/imdb.json');
    let json = JSON.parse(raw);
    var index = 0;
    for(var imdbListing of json) {
        imdbListing.OscarYear = flattedMovies[index].Year;
        index++;
      }
      fs.writeFileSync('./mocks/imdb.json', JSON.stringify(json, null, 4));
});

router.get('/refreshIMDBRatingsOnly', async (req, res, next) => {
	const currentMoviesArray = imdbProvider.readRatingsFromDisk();

	for(var currentMovie of currentMoviesArray) {
		var updatedIMDBInfoForMovie = imdbProvider.fetchOMDBAPIInfoByID(currentMovie.ImdbID);
		try {
			currentMoviesArray.find(x => x.ImdbID == updatedIMDBInfoForMovie.imdbID).Rating = updatedIMDBInfoForMovie.Ratings.find(y => y.Source == 'Internet Movie Database').Value.replace('/10','');
		}
		catch {
			console.log("No IMDB rating retrieved for: "+ currentMovie.Title);
		}
	}

      fs.writeFileSync('./mocks/imdb.json', JSON.stringify(currentMoviesArray, null, 4));

});
module.exports = router;
