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
               self.addHasSeenAndSkipCheckboxListener(movieData.MoviesList);
            });
        }else {
            [].forEach.call(document.querySelectorAll('input[type=checkbox]'), (checkBox) => {
                checkBox.setAttribute("disabled", "true");
            });

            [].forEach.call(document.querySelectorAll('input[type=radio]'), (radio) => {
                radio.setAttribute("disabled", "true");
            });

            document.body.classList.add("read-only");
        }

        this.dataHandler.fetchIMDBDataFromAPIOrLocalStorage().then(imdbData => {
            self.bindIMDBDataToElements(imdbData);
            self.setChevronClickListeners(imdbData);
        });

        window.onscroll = () => {
          if (window.pageYOffset > this.sticky) {
            this.header.classList.add("sticky");
          } else {
            this.header.classList.remove("sticky");
          }
        };
    }

    setChevronClickListeners(imdb) {
         var chevrons = document.getElementsByClassName("chevron");
                var i;
            for (i = 0; i < chevrons.length; i++) {
              chevrons[i].addEventListener("click", function(e) {
                e.currentTarget.classList.toggle("chevron-active");
                var grandParentNode =  e.currentTarget.parentNode.parentNode;
                var panel = grandParentNode.querySelector(".panel");
                    if (panel.style.display === "block") {
                      panel.style.display = "none";
                    } else {
                      var movie = imdb.find(x => x.Title == e.currentTarget.getAttribute("Movie") && x.OscarYear == e.currentTarget.getAttribute("Year"));
                      document.querySelector('span[data-object="'+e.currentTarget.getAttribute("Movie")+'-'+e.currentTarget.getAttribute("Year")+'-director"]').innerHTML = movie.Director;
                      document.querySelector('span[data-object="'+e.currentTarget.getAttribute("Movie")+'-'+e.currentTarget.getAttribute("Year")+'-runtime"]').innerHTML = movie.Runtime;
                      document.querySelector('span[data-object="'+e.currentTarget.getAttribute("Movie")+'-'+e.currentTarget.getAttribute("Year")+'-genre"]').innerHTML = movie.Genre;
                      document.querySelector('span[data-object="'+e.currentTarget.getAttribute("Movie")+'-'+e.currentTarget.getAttribute("Year")+'-actors"]').innerHTML = movie.Actors;
                      document.querySelector('span[data-object="'+e.currentTarget.getAttribute("Movie")+'-'+e.currentTarget.getAttribute("Year")+'-plot"]').innerHTML = movie.Plot;
                      panel.style.display = "block";
                    }
                var moviePosterContainer = grandParentNode.querySelector(".movie-poster-container");
                    if (moviePosterContainer.style.zIndex === "999") {
                      moviePosterContainer.style.zIndex = "inherit";
                    } else {
                      moviePosterContainer.style.zIndex = "999";
                    }
            });
        }
    }

    addHasSeenAndSkipCheckboxListener(movies) {
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

        var skips = document.querySelectorAll('input[name*="checkbox-skip"]');
        for (const skip of skips) {
          skip.addEventListener('click', (e) => {
            var yearIndex = e.currentTarget.getAttribute('year-index');
            var movieIndex = e.currentTarget.getAttribute('movie-index');
            var nameOfPersonWhoHasSkipped = e.currentTarget.parentNode.parentNode.innerText.trim();
            movies[yearIndex].Movies[movieIndex].Viewers.find((viewer) => viewer.Name == nameOfPersonWhoHasSkipped).Skip = e.currentTarget.checked;
            this.dataHandler.postData('/movies', movies);
          });
        }
    }

    bindIMDBDataToElements(data) {
        data.forEach(movie => {
            try {
                document.querySelector('img[data-object="'+movie.Title+'-'+movie.OscarYear+'-poster"]').src = movie.ImageUrl;
                document.querySelector('span[data-object="'+movie.Title+'-'+movie.OscarYear+'-rating"]').innerHTML = movie.Rating;
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
                        document.querySelector("input[name='"+'checkbox-skip-' + movieName + '-' + nomYear.Year + '-' + viewer.Name+"']").checked = viewer.Skip;
                    }catch {
                        console.log('failed to update checkbox; selector was invalid (likely movie title with special characters');
                    }
                }
             }
           
        }
    }
}