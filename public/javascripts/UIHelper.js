class UIHelper {
    constructor(){
        
    }
    randomlySelectMovie(allMovies) {
        var moviesToChooseFrom = [];
      //  var modernMovies = allMovies.MoviesList.filter(m => m.Year > 1970);
      allMovies.MoviesList.forEach((moviesInYear)=> {
          //  var modernUnseenMovies = moviesInYear.Movies.filter(m => m.Viewers[0].HasSeen == false || m.Viewers[1].HasSeen == false);
            var modernUnseenMoviesNotSkipped = moviesInYear.Movies.filter(m => m.Viewers[0].Skip == false && m.Viewers[1].Skip == false);
            if(modernUnseenMoviesNotSkipped.length > 0){
                moviesToChooseFrom.push(
                {
                    "Titles" : modernUnseenMoviesNotSkipped,
                    "Year" : moviesInYear.Year
                });
            }
        });
        var randomMovieYear = moviesToChooseFrom.sort(() => Math.random() - 0.5)[0];
        var randomMovieTitle = randomMovieYear.Titles.sort(() => Math.random() - 0.5)[0];
        var chosenMovieElement = document.querySelector("div[movie='"+randomMovieTitle.Name.replace(/'/g, "\\'")+"'][year='"+ randomMovieYear.Year +"']").parentNode.parentNode;
        return chosenMovieElement;
    }

    randomlySelectMovieByFilters(seenbyUserName,skippedByUserName,minIMDBRating,maxDuration,decade,winnersOnly) {
       var allUserElements = [...document.querySelectorAll('.user-container')];
       
       if(winnersOnly) {
        allUserElements = allUserElements.filter(x => x.parentNode.querySelector('h3').classList.contains('trophy'));
       }

       if(seenbyUserName) {
        allUserElements = allUserElements.filter(
            x => x.querySelector('input[name*="seen"]:checked') 
            && x.querySelector('input[name*="seen"]:checked').getAttribute("name").includes(seenbyUserName));
        }
    
       if(skippedByUserName) {
        allUserElements = allUserElements.filter(
            x => x.querySelector('input[name*="skip"]:checked') 
            && x.querySelector('input[name*="skip"]:checked').getAttribute("name").includes(skippedByUserName));
        }
       return allUserElements.sort(() => Math.random() - 0.5)[0];
    }

}   