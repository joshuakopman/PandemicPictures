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
      fs.writeFileSync('./mocks/imdbTestFinal.json', JSON.stringify(moviesDict, null, 4));
      return moviesDict;
    }

    async fetchOMDBAPIInfo(movie) {
      var resp = {};

      try {
       var prevYear = (parseInt(movie.Year)-1).toString();
       resp =  await fetch('http://www.omdbapi.com?apikey=782e8a6f&t=' + this.sanitizeMovieName(movie.Name)+"&y="+prevYear);
       resp = await resp.json();
      }catch(e) {
        console.log('Error: Couldnt find movie '+ movie.Name +' in year '+ prevYear);
      }

      var imdbRating = "N/A";
      try {
        imdbRating = resp.Ratings.find(x => x.Source == 'Internet Movie Database').Value.replace('/10','');
      }
       catch {
        console.log('Error: Couldnt find movie rating for '+ movie.Name);
      }
      try{
       if(resp.Response == "False" || resp.Poster == "N/A" || resp.Runtime == "N/A" || imdbRating== "N/A" || parseFloat(imdbRating) <= 6.2) {
         console.log('Error: Couldnt find movie '+ movie.Name +' in year '+ prevYear);
         resp =  await fetch('http://www.omdbapi.com?apikey=2e35e374&t=' + this.sanitizeMovieName(movie.Name)+"&y=" + movie.Year);
         resp = await resp.json();
         if(resp.Response == "False") {
            console.log('Error 2: Couldnt find movie '+ movie.Name +' in year '+ movie.Year);
         }else{
            try {
              imdbRating = resp.Ratings.find(x => x.Source == 'Internet Movie Database').Value.replace('/10','');
            }
             catch {
              console.log('Error 2: Couldnt find movie rating for '+ movie.Name);
            }
         }
       }
      }catch {
        console.log('Error: Couldnt find movie at all for '+ movie.Name);
      }
      
      resp.Rating = imdbRating;

      return resp;
    }

    sanitizeMovieName(str) {
      return encodeURIComponent(str).split('%20').join('+');
    }
}

module.exports.IMDBProvider = IMDBProvider;