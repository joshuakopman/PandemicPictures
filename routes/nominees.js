import express from 'express';
import { NomineeProvider } from '../providers/nomineeProvider.js';
import { IMDBProvider } from '../providers/imdbProvider.js';


const router = express.Router();

router.get('/', (req, res, next) => {
    var userRatingsForMovies = new NomineeProvider(req.query.userOne, req.query.userTwo).readMoviesFromDisk(req.query.limit, req.query.skip);
    res.json(userRatingsForMovies);
});

router.get('/reactMovies', (req, res, next) => {
    var userRatingsForMovies = new NomineeProvider(req.query.userOne, req.query.userTwo).readMoviesFromDisk(req.query.limit, req.query.skip);
    var allMoviesFromIdmb = new IMDBProvider(req.query.userOne, req.query.userTwo).readRatingsFromDisk(req.query.limit, req.query.skip);
    for (let moviesListIndex in userRatingsForMovies.MoviesList) {
        var moviesFromAllYears = userRatingsForMovies.MoviesList[moviesListIndex];
        for (let allMoviesIndex in moviesFromAllYears) {
            var moviesFromYear = moviesFromAllYears[allMoviesIndex];
            for (let movieIndex in moviesFromYear) {
                var movie = moviesFromYear[movieIndex];
                var foundMatchingImdbFilm = allMoviesFromIdmb.find(film => film.Title == movie.Name && film.OscarYear == moviesFromAllYears.Year);

                movie.Rating = foundMatchingImdbFilm.Rating;
                movie.ImageUrl = foundMatchingImdbFilm.ImageUrl;
                movie.Plot = foundMatchingImdbFilm.Plot;
                movie.Runtime = foundMatchingImdbFilm.Runtime;
                movie.Genre = foundMatchingImdbFilm.Genre;
                movie.Actors = foundMatchingImdbFilm.Actors;
                movie.Director = foundMatchingImdbFilm.Director;
            }
        }
    }
    res.json(userRatingsForMovies);
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
