const { JSDOM } = require('jsdom');
const fetch = require("node-fetch");
const fs = require("fs");

class IMDBProvider {
    constructor() {

    }
    
    readRatingsFromDisk() {
       let raw = fs.readFileSync('./mocks/imdb.json');
       let json = JSON.parse(raw);
       return json;
    }

    async getIMDBMetadata(allMovies) {
      let moviesDict = [];
      for (var movie of allMovies) {
          var movieMetaData = await this.fetchOMDBAPIInfo(movie);
          var movieTmp = {};
              movieTmp.Title = movie;
              movieTmp.Rating = movieMetaData.Rating;
              movieTmp.ImageUrl = movieMetaData.Poster;
          moviesDict.push(movieTmp);
      }
      fs.writeFileSync('./mocks/imdb.json', JSON.stringify(moviesDict, null, 4));
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