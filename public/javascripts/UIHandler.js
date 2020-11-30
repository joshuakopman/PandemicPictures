class UIHandler {
    constructor(DataHandler,ws) {
        this.socket = ws;
        this.dataHandler = DataHandler;
    }

    init() {
        var self = this;
        this.socket.onmessage = function(event) {
            console.log('JSON File Updated; refreshing checkboxes!');
            fetch('/getMoviesForStorage')
            .then(response => response.json())
            .then(data => {
               localStorage.setItem('movies', JSON.stringify(data));
               self.updateHasSeenCheckboxes(data);
            })
        };

        this.dataHandler.fetchMovieDataFromAPIOrLocalStorage().then(movieData=>{
           self.addHasSeenCheckboxListener(movieData);
        });

        this.dataHandler.fetchIMDBDataFromAPIOrLocalStorage().then(imdbData=>{
            self.bindIMDBDataToElements(imdbData);
        });
    }

    addHasSeenCheckboxListener(movies) {
        var checkBoxes = document.querySelectorAll('input[type=checkbox]');
        var moviesLS = JSON.parse(movies);
        for (const checkBox of checkBoxes) {
          checkBox.addEventListener('click', (e) => {
            var yearIndex = e.currentTarget.getAttribute('year-index');
            var movieIndex = e.currentTarget.getAttribute('movie-index');
            var nameOfPersonWhoHasSeen = e.currentTarget.parentNode.parentNode.innerText.trim();
            moviesLS[yearIndex].Movies[movieIndex].Viewers.find((viewer) => viewer.Name == nameOfPersonWhoHasSeen).HasSeen = e.currentTarget.checked;
            localStorage.setItem('movies', JSON.stringify(moviesLS));
            this.dataHandler.postData('/writeMoviesToDiskFromStorage', localStorage.getItem('movies'));
          });
        }
    }

    bindIMDBDataToElements(data) {
        data.forEach(movie => {
                document.querySelector('img[data-object="'+movie.Title+'-poster"]').src = movie.ImageUrl;
                document.querySelector('span[data-object="'+movie.Title+'-rating"]').innerHTML = movie.Rating;
             /* document.querySelector('span[data-object="'+movie.Title+'-director"]').innerHTML = movie.Director;
                document.querySelector('span[data-object="'+movie.Title+'-runtime"]').innerHTML = movie.Runtime;
                document.querySelector('span[data-object="'+movie.Title+'-genre"]').innerHTML = movie.Genre;
                document.querySelector('span[data-object="'+movie.Title+'-actors"]').innerHTML = movie.Actors;
                document.querySelector('span[data-object="'+movie.Title+'-plot"]').innerHTML = movie.Plot;
                document.querySelector('span[data-object="'+movie.Title+'-imdbID"]').innerHTML = movie.ImdbID; */
        })
    }

    updateHasSeenCheckboxes(allNomYears){
        console.log('updating');
        for(const nomYear of allNomYears){
             for (const movie of nomYear.Movies){
                var movieName = movie.Name;
                for(const viewer of movie.Viewers){
                    try{
                        document.querySelector("input[name='"+'checkbox-seen-' + movieName + '-' + viewer.Name+"']").checked = viewer.HasSeen;
                    }catch{
                        console.log('failed to update checkbox; selector was invalid (likely movie title with special characters');
                    }
                }
             }
           
        }
    }
}