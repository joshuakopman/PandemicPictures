function MovieDetails({ currentMovie, year }) {
    return (
        <div className="panel" data-object="panel">
            <div class="panel-inner">
                <p class="movie-details-line">
                    <span class="movie-detail-span" data-object={currentMovie.Name + "-" + year + "-genre"}>{currentMovie.Genre}</span></p>
                <p class="movie-details-line"><span class="movie-detail-span" data-object={currentMovie.Name + "-" + year + "-plot"}>{currentMovie.Plot}</span></p>
                <p class="movie-details-line"><span class="movie-detail-label">Directed by </span> <span class="movie-detail-span"
                    data-object={currentMovie.Name + "-" + year + "-director"}>{currentMovie.Director}</span></p>
                <p class="movie-details-line"><span class="movie-detail-label">Starring </span> <span class="movie-detail-span"
                    data-object={currentMovie.Name + "-" + year + "-actors"}>{currentMovie.Actors}</span></p>
            </div>
        </div>
    )
};

export default MovieDetails;