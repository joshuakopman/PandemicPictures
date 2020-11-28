const { JSDOM } = require('jsdom');
const fetch = require("node-fetch");
const fs = require("fs");

class IMDBProvider {
    constructor() {

    }

    async getIMDBMetadata(allMovies) {
      let moviesDict = [];
      for (var movie of allMovies) {
          var movieMetaData = await this.fetchOMDBAPIInfo(movie);
          var movieTmp = {};
              movieTmp.Title = movie;
              movieTmp.Rating = movieMetaData.Rating;
          moviesDict.push(movieTmp);
      }
      fs.writeFileSync('./mocks/imdbRatings.json', JSON.stringify(moviesDict, null, 4));
      return moviesDict;
    }

    async fetchOMDBAPIInfo(movie) {
      var resp = '';
      try {
       resp =  await fetch('http://www.omdbapi.com?apikey=1096e53f&t=' + movie);
       resp = await resp.json();
      }catch {
        console.log('error');
      }

      try {
        resp.Rating = resp.Ratings.find(x => x.Source == 'Internet Movie Database').Value.replace('/10','');
      }
      catch {
        resp.Rating = 'N/A';
      }
      return resp;
    }
}

module.exports.IMDBProvider = IMDBProvider;