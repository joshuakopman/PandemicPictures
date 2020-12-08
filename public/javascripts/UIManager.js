class UIManager {
    constructor(DataHandler,UIEventListenerManager,ws) {
        this.socket = ws;
        this.dataHandler = DataHandler;
        this.uiEventListenerManager = UIEventListenerManager;
        this.header = document.getElementById("header");
        this.sticky = this.header.offsetTop;
    }

    initializeView() {
        var self = this;

        this.socket.onmessage = (event) => {
            this.dataHandler.fetchMovieDataFromAPI().then(movieData => {
               self.updateHasSeenCheckboxesAndCounts(movieData);
            });
        };

        this.dataHandler.fetchMovieDataFromAPI().then(movieData => {
            self.uiEventListenerManager.addRandomMovieClickListener(movieData);
            
            if(window.location.href.includes('edit')) {
                   self.uiEventListenerManager.addInputClickListeners(movieData.MoviesList);
            }else {
                [].forEach.call(document.querySelectorAll('input[type=checkbox]'), (checkBox) => {
                    checkBox.setAttribute("disabled", "true");
                });

                [].forEach.call(document.querySelectorAll('input[type=radio]'), (radio) => {
                    radio.setAttribute("disabled", "true");
                });

                document.body.classList.add("read-only");
            }
        });

        this.dataHandler.fetchIMDBDataFromAPIOrLocalStorage().then(imdbData => {
            self.bindIMDBDataToMovies(imdbData);
            self.uiEventListenerManager.addChevronClickListeners(imdbData);
        });

        window.onscroll = () => {
          if (window.pageYOffset > this.sticky) {
            this.header.classList.add("sticky");
          } else {
            this.header.classList.remove("sticky");
          }
        };
    }

    bindIMDBDataToMovies(data) {
        var year = '';
        data.forEach(movie => {
            try {
                document.querySelector('img[data-object="'+movie.Title+'-'+movie.OscarYear+'-poster"]').src = movie.ImageUrl;
                document.querySelector('span[data-object="'+movie.Title+'-'+movie.OscarYear+'-rating"]').innerHTML = movie.Rating;
                document.querySelector('img[data-object="'+movie.Title+'-'+movie.OscarYear+'-poster"]').closest('a').href = "https://www.imdb.com/title/" + movie.ImdbID; 
                if(movie.OscarYear != year) {
                    var movieTitleElement = document.querySelector('div[movie="'+movie.Title+'"][year="'+movie.OscarYear+'"]').nextElementSibling;
                    if(movieTitleElement.getAttribute('index') == "0") {
                        movieTitleElement.innerText += " 🏆";
                    }
                    year = movie.OscarYear;
                }
            }catch(e) {
                console.log('missing HTML element for: '+movie.Title + " | exception: " + e);
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
                for(const viewer of movie.Viewers) { //radio-1-{{../this.Name}}-{{../../this.Year}}-{{this.Name}}
                    try {
                        document.querySelector("input[name='"+'checkbox-seen-' + movieName + '-' + nomYear.Year + '-' + viewer.Name+"']").checked = viewer.HasSeen;
                        document.querySelector("input[name='"+'checkbox-skip-' + movieName + '-' + nomYear.Year + '-' + viewer.Name+"']").checked = viewer.Skip;
                        if(viewer.Rating == true){
                            document.querySelector("input[id='"+'radio-1-' + movieName + '-' + nomYear.Year + '-' + viewer.Name+"']").checked = true;
                        }else if(viewer.Rating == false){
                            document.querySelector("input[id='"+'radio-2-' + movieName + '-' + nomYear.Year + '-' + viewer.Name+"']").checked = true;
                        }
                    }catch {
                        console.log('failed to update checkbox; selector was invalid (likely movie title with special characters');
                    }
                }
             }
           
        }
    }
}