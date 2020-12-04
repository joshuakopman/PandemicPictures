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

        if(window.location.href.includes('edit')) {
            this.dataHandler.fetchMovieDataFromAPI().then(movieData => {
               self.addHasSeenCheckboxListener(movieData.MoviesList);
            });
        }else {
            var checkBoxes = document.querySelectorAll('input[type=checkbox]');
            [].forEach.call(checkBoxes, (checkBox) => {
                checkBox.setAttribute("disabled", "true");
            });
            var radios = document.querySelectorAll('input[type=radio]');
            [].forEach.call(radios, (radio) => {
                radio.setAttribute("disabled", "true");
            });
            document.body.classList.add("read-only");
        }

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

        this.setChevron();
    }

    setChevron() {
         var acc = document.getElementsByClassName("chevron");
                var i;
            for (i = 0; i < acc.length; i++) {
              acc[i].addEventListener("click", function(e) {
                e.currentTarget.classList.toggle("chevron-active");
                var panel = e.currentTarget.parentNode.parentNode.querySelector(".panel");
                    if (panel.style.display === "block") {
                      panel.style.display = "none";
                    } else {
                      panel.style.display = "block";
                    }
                var moviePosterContainer = e.currentTarget.parentNode.parentNode.querySelector(".movie-poster-container");
                    if (moviePosterContainer.style.zIndex === "999") {
                      moviePosterContainer.style.zIndex = "inherit";
                    } else {
                      moviePosterContainer.style.zIndex = "999";
                    }
            });
        }
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
                document.querySelector('span[data-object="'+movie.Title+'-'+movie.OscarYear+'-director"]').innerHTML = movie.Director;
                document.querySelector('span[data-object="'+movie.Title+'-'+movie.OscarYear+'-runtime"]').innerHTML = movie.Runtime;
                document.querySelector('span[data-object="'+movie.Title+'-'+movie.OscarYear+'-genre"]').innerHTML = movie.Genre;
                document.querySelector('span[data-object="'+movie.Title+'-'+movie.OscarYear+'-actors"]').innerHTML = movie.Actors;
                document.querySelector('span[data-object="'+movie.Title+'-'+movie.OscarYear+'-plot"]').innerHTML = movie.Plot;
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