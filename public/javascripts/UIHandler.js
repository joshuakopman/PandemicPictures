class UIHandler {
    constructor(DataHandler,ws) {
        this.socket = ws;
        this.dataHandler = DataHandler;
        this.header = document.getElementById("header");
        this.sticky = this.header.offsetTop;
    }

    init() {
        var self = this;

        this.socket.onmessage = (event) => {
            this.dataHandler.fetchMovieDataFromAPI().then(movieData => {
               self.updateHasSeenCheckboxesAndCounts(movieData);
            });
        };

        this.dataHandler.fetchMovieDataFromAPI().then(movieData => {
           self.addHasSeenCheckboxListener(movieData.MoviesList);
        });

        this.dataHandler.fetchIMDBDataFromAPIOrLocalStorage().then(imdbData => {
            self.bindIMDBDataToElements(imdbData);
        });

        window.onscroll = () => {
          if (window.pageYOffset > this.sticky) {
            this.header.classList.add("sticky");
          } else {
            this.header.classList.remove("sticky");
          }
        };
    }

    addHasSeenCheckboxListener(movies) {
        var checkBoxes = document.querySelectorAll('input[name*="checkbox-seen"]');
        for (const checkBox of checkBoxes) {
          checkBox.addEventListener('click', (e) => {
            var yearIndex = e.currentTarget.getAttribute('year-index');
            var movieIndex = e.currentTarget.getAttribute('movie-index');
            var nameOfPersonWhoHasSeen = e.currentTarget.parentNode.parentNode.innerText.trim();
            movies[yearIndex].Movies[movieIndex].Viewers.find((viewer) => viewer.Name == nameOfPersonWhoHasSeen).HasSeen = e.currentTarget.checked;
            this.dataHandler.postData('/movies', movies);
          });
        }
    }

    bindIMDBDataToElements(data) {
        data.forEach(movie => {
            try {
                document.querySelector('img[data-object="'+movie.Title+'-'+movie.OscarYear+'-poster"]').src = movie.ImageUrl;
                document.querySelector('span[data-object="'+movie.Title+'-'+movie.OscarYear+'-rating"]').innerHTML = movie.Rating;
                /* document.querySelector('span[data-object="'+movie.Title+'-director"]').innerHTML = movie.Director;
                document.querySelector('span[data-object="'+movie.Title+'-runtime"]').innerHTML = movie.Runtime;
                document.querySelector('span[data-object="'+movie.Title+'-genre"]').innerHTML = movie.Genre;
                document.querySelector('span[data-object="'+movie.Title+'-actors"]').innerHTML = movie.Actors;
                document.querySelector('span[data-object="'+movie.Title+'-plot"]').innerHTML = movie.Plot;
               */ 
                document.querySelector('img[data-object="'+movie.Title+'-'+movie.OscarYear+'-poster"]').closest('a').href = "https://www.imdb.com/title/" + movie.ImdbID; 
            }catch {
                console.log('missing HTML element for: '+movie.Title);
            }
        })
    }

    updateHasSeenCheckboxesAndCounts(allNomYears) {
        for(const count of allNomYears.Counts) {
            document.querySelector('div[data-object="' + count.Name + '"] span').innerHTML = count.MyCount; 
        }

        for(const nomYear of allNomYears.MoviesList) {
             for (const movie of nomYear.Movies) {
                var movieName = movie.Name;
                for(const viewer of movie.Viewers) {
                    try {
                        document.querySelector("input[name='"+'checkbox-seen-' + movieName + '-' + nomYear.Year + '-' + viewer.Name+"']").checked = viewer.HasSeen;
                    }catch {
                        console.log('failed to update checkbox; selector was invalid (likely movie title with special characters');
                    }
                }
             }
           
        }
    }
}