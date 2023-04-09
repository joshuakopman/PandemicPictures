import MoviesInYear from './MoviesInYear';

function AllMoviesList({ moviesResponse }) {
    return (
        <main>
            {moviesResponse.MoviesList && moviesResponse.MoviesList.map((moviesInYear, yearIndex) => (
                <MoviesInYear moviesInYear={moviesInYear} yearIndex={yearIndex}></MoviesInYear>
            ))}
        </main>
    )
}


export default AllMoviesList;