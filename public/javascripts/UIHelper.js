class UIHelper {
    constructor(){
        
    }
     randomlySelectMovie(allMovies) {
        var moviesToChooseFrom = [];
        var modernMovies = allMovies.MoviesList.filter(m => m.Year > 1970);
        modernMovies.forEach((moviesInYear)=> {
            var modernUnseenMovies = moviesInYear.Movies.filter(m => m.Viewers[0].HasSeen == false || m.Viewers[1].HasSeen == false);
            var modernUnseenMoviesNotSkipped = modernUnseenMovies.filter(m => m.Viewers[0].Skip == false && m.Viewers[1].Skip == false);
            moviesToChooseFrom = moviesToChooseFrom.concat(modernUnseenMoviesNotSkipped);

        });
        var randomMovie = moviesToChooseFrom.sort(() => Math.random() - 0.5)[0];

        var chosenMovieElement = document.querySelector("div[movie='"+randomMovie.Name.replace(/'/g, "\\'")+"']").parentNode.parentNode;
        return chosenMovieElement;
    }

}   