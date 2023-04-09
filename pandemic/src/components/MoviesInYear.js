import Movie from './Movie';

function MoviesInYear({ moviesInYear, yearIndex }) {
    return (
        <div className="year-container" data-object="year-container">
            <h2 id={moviesInYear.Year + 1} className="year-heading" yearIndex={yearIndex} data-object="year">{moviesInYear.Year + 1}</h2>
            {
                moviesInYear.Movies && moviesInYear.Movies.map((currentMovie, currentMovieIndex) => (
                    <Movie year={moviesInYear.Year} currentMovie={currentMovie} currentMovieIndex={currentMovieIndex} yearIndex={yearIndex}></Movie>
                ))
            }
        </div>
    )
}

export default MoviesInYear;