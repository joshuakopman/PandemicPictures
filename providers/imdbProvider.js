import fetch from "node-fetch";
import { readFileSync, writeFileSync } from "fs";

class IMDBProvider {
    constructor() {

    }
    
    readRatingsFromDisk(limit,skip) {
      let raw = readFileSync('./mocks/imdb.json');
      let json = JSON.parse(raw);

      if(limit && skip) {
        json  = json.slice(skip,skip+limit);
      }

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
      writeFileSync('./mocks/imdbFinal.json', JSON.stringify(moviesDict, null, 4));
      return moviesDict;
    }
    
    async fetchOMDBAPIInfoByID(id) {
      if(id) {
       var resp =  await fetch(`http://www.omdbapi.com?apikey=782e8a6f&i=${id}`);
       resp = await resp.json();
       return resp;
     }
    };
    
    async fetchOMDBAPIInfo(movie) {
      var resp = {};

      try {
       var prevYear = (parseInt(movie.Year)-1).toString();
       resp =  await fetch(`http://www.omdbapi.com?apikey=782e8a6f&t=${this.sanitizeMovieName(movie.Name)}&y=${prevYear}`);
       resp = await resp.json();
      }catch(e) {
        console.log('Exception: Couldnt fetch movie '+ movie.Name +' for year '+ prevYear + '| message: ' + e);
      }

      var imdbRating = "N/A";
      try {
        imdbRating = resp.Ratings.find(x => x.Source == 'Internet Movie Database').Value.replace('/10','');
      }
       catch(e) {
        console.log('Exception: Couldnt find IMDB Rating for '+ movie.Name + '| message: ' +  e);
      }
      try {
       if(resp.Response == "False" || resp.Awards == "N/A" || resp.Rated == "N/A" || resp.Runtime == "N/A" || resp.Genre.includes('Short') || imdbRating== "N/A" || parseFloat(imdbRating) <= 6.2) {
         console.log('RetryError: Couldnt find movie '+ movie.Name +' for year '+ prevYear + ': Now trying the following year');
         resp =  await fetch(`http://www.omdbapi.com?apikey=2e35e374&t=${this.sanitizeMovieName(movie.Name)}&y=${movie.Year}`);
         resp = await resp.json();
         if(resp.Response == "False") {
            console.log('RetryError: Couldnt find movie '+ movie.Name +' in year '+ movie.Year + ' either');
         }else {
            try {
              imdbRating = resp.Ratings.find(x => x.Source == 'Internet Movie Database').Value.replace('/10','');
            }
             catch (e) {
              console.log('RetryException: Couldnt find movie rating for '+ movie.Name + '| message: ' + e);
            }
         }
       }
      }catch(e) {
        console.log('RetryException: Couldnt fetch movie at all for '+ movie.Name + '| message : ' + e);
      }

      resp.Rating = imdbRating;

      return resp;
    }

    sanitizeMovieName(str) {
      return encodeURIComponent(str).split('%20').join('+');
    }
}

const _IMDBProvider = IMDBProvider;
export { _IMDBProvider as IMDBProvider };