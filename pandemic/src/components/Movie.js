import MovieDetails from './/MovieDetails';
import MovieViewer from './MovieViewer';
import { useState } from 'react';


function Movie({ year, currentMovie, currentMovieIndex, yearIndex }) {
    
    const [show, setShow] = useState(false);

    return (
        <div className="movie-container" data-object="movie-container">
            <div className="movie-poster-container" data-object="movie-poster-container">
                <a href={"https://imdb.com/" + currentMovie.ImdbID} target="_blank"> <img className="movie-poster"
                    data-object={currentMovie.Name + "-" + year + "-poster"} src={currentMovie.ImageUrl} loading="lazy" /></a>
                <a href={"https://www.youtube.com/results?search_query=" + currentMovie.Name + " " + year + " trailer"}
                    target="_blank"><i className="fab fa-youtube"></i></a>
            </div>

            { show ? <MovieDetails currentMovie={currentMovie} year={year}></MovieDetails> : null }

            <div className="movie-content-container">
                <div className={ show ? "chevron chevron-active" : "chevron"}  data-object="chevron" movie={currentMovie.Name} year={year} tabindex="0" onClick={() => setShow(currentShow => !currentShow)}></div>
                <h3 className="movie-title" index={currentMovieIndex}>{currentMovie.Name} </h3>
                <div className="imdb-container">
                    <span className="imdb-star"><i className="far fa-star"></i></span>
                    <span className="imdb-rating" data-object={currentMovie.Name + "-" + year + "-rating"}>{currentMovie.Rating}</span> &nbsp; &nbsp;
                    <span className="imdb-star"><i className="far fa-clock"></i></span>
                    <span className="imdb-runtime" data-object={currentMovie.Name + "-" + year + "-runtime"}>{currentMovie.Runtime}</span>
                </div>
            </div>

            {currentMovie.Viewers && currentMovie.Viewers.map((viewer) => (
                <MovieViewer viewer={viewer} currentMovie={currentMovie} year={year} currentMovieIndex={currentMovieIndex} yearIndex={yearIndex}></MovieViewer>
            ))}

        </div>
    )
}



export default Movie;