import Movie from "./Movie"

function MovieViewer({ currentMovie, viewer, year, currentMovieIndex, yearIndex }){

    function seenMovie(e){
      /*  var movieViewers = movies[e.currentTarget.getAttribute('year-index')].Movies[e.currentTarget.getAttribute('movie-index')].Viewers;
        if (value == "Rating") {
          if (e.currentTarget.id.includes("radio-2")) {
            movieViewers.find((viewer) => viewer.Name == nameOfPerson)[value] = false;
          } else {
            movieViewers.find((viewer) => viewer.Name == nameOfPerson)[value] = true;
          }
        } else {
          movieViewers.find((viewer) => viewer.Name == nameOfPerson)[value] = e.currentTarget.checked;
        }

        this.myDataHandler.postData('/movies', movies);
    */
    }

    return (
        <div className="user-container" data-object="user-container">
            <div className="user-info user-name" data-object="user-name">{viewer.Name}</div>
            <div className="user-info user-check">
                <input id={"checkbox-seen-" + currentMovie.Name + "-" + year + "-" + viewer.Name} className="checkbox-custom read-only"
                    name={"checkbox-seen-" + currentMovie.Name + "-" + year + "-" + viewer.Name} type="checkbox"
                    movie-index={currentMovieIndex} year-index={yearIndex} checked={viewer.HasSeen} onClick={seenMovie}/>
                <label for={"checkbox-seen-" + currentMovie.Name + "-" + year + "-" + viewer.Name} className="checkbox-custom-label check-label"></label>
            </div>
            <div className="user-info user-smile">
                <input id={"radio-1-" + currentMovie.Name + "-" + year + "-" + viewer.Name} className="radio-custom read-only"
                    name={"radio-group-" + currentMovie.Name + "-" + currentMovie.Year + "-" + viewer.Name} type="radio"
                    movie-index={currentMovieIndex} year-index={yearIndex} checked={viewer.Rating} />
                <label for={"radio-1-" + currentMovie.Name + "-" + year + "-" + viewer.Name}
                    className="radio-custom-label smile-label"></label>
            </div>
            <div className="user-info user-frown">
                <input id={"radio-2-" + currentMovie.Name + "-" + year + "-" + viewer.Name} className="radio-custom read-only"
                    name={"radio-group-" + currentMovie.Name + "-" + currentMovie.Year + "-" + viewer.Name} type="radio"
                    movie-index={currentMovieIndex} year-index={yearIndex} checked={viewer.Rating} />
                <label for={"radio-2-" + currentMovie.Name + "-" + year + "-" + viewer.Name}
                    className="radio-custom-label frown-label"></label>
            </div>
            <div className="user-info user-skip">
                <input id={"checkbox-skip-" + currentMovie.Name + "-" + year + "-" + viewer.Name} className="checkbox-custom read-only"
                    name={"checkbox-skip-" + currentMovie.Name + "-" + year + "-" + viewer.Name} type="checkbox"
                    movie-index={currentMovieIndex} year-index={yearIndex} checked={viewer.Skip} />
                <label for={"checkbox-skip-" + currentMovie.Name + "-" + year + "-" + viewer.Name}
                    className="checkbox-custom-label skip-label"></label>
            </div>
        </div>
    )}

    export default MovieViewer;