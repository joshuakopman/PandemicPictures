const fetch = require("node-fetch");
const fs = require("fs");

class IMDBProvider {
    constructor() {

    }
    
    readRatingsFromDisk() {
      console.log('reading imdb');
       fs.readFile('./mocks/imdb.json',(err, result) => {
            console.log('read imdb');
           let json = JSON.parse(result);
           return json;        
      });
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
      var resp = {};

      try {
       var prevYear = (parseInt(movie.Year)-1).toString();
       resp =  await fetch('http://www.omdbapi.com?apikey=fa8c70e4&t=' + this.sanitizeMovieName(movie.Name)+"&y="+prevYear);
       resp = await resp.json();
      }catch(e) {
        console.log('Error: Couldnt find movie '+ movie.Name +' in year '+ prevYear);
      }

      try{
       if(resp.Response == "False") {
         console.log('Error: Couldnt find movie '+ movie.Name +' in year '+ prevYear);
         resp =  await fetch('http://www.omdbapi.com?apikey=9891fdba&t=' + this.sanitizeMovieName(movie.Name)+"&y=" + movie.Year);
         resp = await resp.json();
         if(resp.Response == "False") {
            console.log('Error 2: Couldnt find movie '+ movie.Name +' in year '+ movie.Year);
         }
       }
      }catch {
        console.log('Error: Couldnt find movie '+ movie.Name +' at all');
      }

      try {
        resp.Rating = resp.Ratings.find(x => x.Source == 'Internet Movie Database').Value.replace('/10','');
      }
      catch {
        resp.Rating = 'N/A';
      }
      return resp;
    }

    sanitizeMovieName(str){
      return encodeURIComponent(str).split('%20').join('+');
    }
}

module.exports.IMDBProvider = IMDBProvider;