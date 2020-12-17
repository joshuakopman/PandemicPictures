import express from 'express';
import { readFileSync, writeFileSync } from "fs";
import { NomineeProvider } from '../providers/nomineeProvider.js';
import { IMDBProvider } from '../providers/imdbProvider.js';
import basicAuth from 'express-basic-auth';

const router = express.Router();
const NomNomProvider = new NomineeProvider();
const imdbProvider = new IMDBProvider();

router.get('/getIMDBMetadata', async (req, res, next) => {
    var moviesFormatted = NomNomProvider.readMoviesFromDisk().MoviesList.map(y => y.Movies.map(z => { return { "Year": y.Year, "Name": z.Name } }));
    var flattedMovies = [].concat.apply([], moviesFormatted);
    var allMetadata = await imdbProvider.getIMDBMetadata(flattedMovies);
    res.json(allMetadata);
});

router.get('/addYearsToJSON', async (req, res, next) => {
    var moviesFormatted = NomNomProvider.readMoviesFromDisk().MoviesList.map(y => y.Movies.map(z => { return { "Year": y.Year, "Name": z.Name } }));
    var flattedMovies = [].concat.apply([], moviesFormatted);

    let raw = readFileSync('./mocks/imdb.json');
    let json = JSON.parse(raw);
    var index = 0;
    for (var imdbListing of json) {
        imdbListing.OscarYear = flattedMovies[index].Year;
        index++;
    }
    writeFileSync('./mocks/imdb.json', JSON.stringify(json, null, 4));
});

router.get('/refreshIMDBRatingsOnly', async (req, res, next) => {
    const currentMoviesArray = imdbProvider.readRatingsFromDisk();

    for (var currentMovie of currentMoviesArray) {
        var updatedIMDBInfoForMovie = imdbProvider.fetchOMDBAPIInfoByID(currentMovie.ImdbID);
        try {
            currentMoviesArray.find(x => x.ImdbID == updatedIMDBInfoForMovie.imdbID).Rating = updatedIMDBInfoForMovie.Ratings.find(y => y.Source == 'Internet Movie Database').Value.replace('/10', '');
        }
        catch {
            console.log("No IMDB rating retrieved for: " + currentMovie.Title);
        }
    }

    writeFileSync('./mocks/imdb.json', JSON.stringify(currentMoviesArray, null, 4));

});

router.get('/edit', basicAuth(
    {
        users: {
            'admin': 'galleryWall'
        },
        challenge: true
    }), (req, res, next) => {
        res.render('main', {
            layout: 'index', 'allNominees': NomNomProvider.readMoviesFromDisk()
        });
    });

export default router;
