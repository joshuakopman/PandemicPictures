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
              movieTmp.Title = movie.Name;
              movieTmp.Rating = movieMetaData.Rating;
              movieTmp.ImageUrl = movieMetaData.Poster;
              movieTmp.Runtime = movieMetaData.Runtime;
              movieTmp.Genre = movieMetaData.Genre;
              movieTmp.Director = movieMetaData.Director;
              movieTmp.Actors = movieMetaData.Actors;
              movieTmp.Plot = movieMetaData.Plot;
              movieTmp.ImdbID = movieMetaData.imdbID;

          moviesDict.push(movieTmp);
      }
      fs.writeFileSync('./mocks/imdb.json', JSON.stringify(moviesDict, null, 4));
      return moviesDict;
    }

    async fetchOMDBAPIInfo(movie) {
      var resp = '';
      try {
       resp =  await fetch('http://www.omdbapi.com?apikey=1096e53f&t=' + movie.Name+"&y="+movie.Year);
       resp = await resp.json();
       if(resp.Response == "False"){
         console.log('trying adjacent year: '+ (parseInt(movie.Year)-1).toString()+" for: "+movie.Name);
         var prevYear = (parseInt(movie.Year)-1).toString();
         resp =  await fetch('http://www.omdbapi.com?apikey=1096e53f&t=' + movie.Name+"&y=" + prevYear);
         resp = await resp.json();
       }
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