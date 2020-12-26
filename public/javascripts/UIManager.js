class UIManager {
    constructor(UIEventListenerManager, ws) {
        this.socket = ws;
        this.uiEventListenerManager = UIEventListenerManager;
        this.header = document.getElementById("header");
        this.sticky = this.header.offsetTop;
        this.initialSkip = 0;
        this.initialLimit = 6;
        this.ratingsTemplate = document.getElementById('ratings-template');
    }

    initializeView() {
        var self = this;

        Handlebars.registerHelper("inc", (value, options) => {
            return parseInt(value) + 1;
        });

        this.socket.onmessage = (event) => {
            self.uiEventListenerManager.dataHandler.fetchMovieDataFromAPI().then(movieData => {
                self.updateHasSeenCheckboxesAndCounts(movieData);
            });
        };

        this.compileTemplatesAndBindElementData();

        window.requestIdleCallback(() => {
            setTimeout(() => {
                self.initialLimit = 95;
                self.compileTemplatesAndBindElementData(true);
            }, 250);
        });

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > this.sticky) {
                this.header.classList.add("sticky");
            } else {
                this.header.classList.remove("sticky");
            }
        }, false);

        this.uiEventListenerManager.bindFilters();
    }

    compileTemplatesAndBindElementData(allMoviesLoaded) {
        var self = this;

        self.uiEventListenerManager.dataHandler.fetchMovieDataFromAPI(self.initialLimit, self.initialSkip).then(movieData => {
            var ratingsTemplate = this.ratingsTemplate.innerHTML;
            var renderRatings = Handlebars.compile(ratingsTemplate);

            document.getElementsByTagName('main')[0].innerHTML = renderRatings({
                moviesList: movieData.MoviesList
            });
            document.getElementById('ajaxLoader').style.display = 'none';
            document.getElementsByTagName('main')[0].style.display = "block";
            document.getElementsByTagName('footer')[0].style.display = 'block';

            self.uiEventListenerManager.dataHandler.fetchIMDBDataFromAPIOrLocalStorage().then(imdbData => {
                self.bindIMDBDataToMovies(imdbData);
                self.updateHasSeenCheckboxesAndCounts(movieData);
                if (allMoviesLoaded) {
                    self.uiEventListenerManager.addRandomMovieClickListener(movieData);
                    self.uiEventListenerManager.addChevronClickListeners(imdbData);
                    if (window.location.href.includes('edit')) {
                        self.uiEventListenerManager.addInputClickListeners(movieData.MoviesList);
                    } else {
                        [].forEach.call(document.querySelector('main').querySelectorAll('input[type=checkbox]'), (checkBox) => {
                            checkBox.setAttribute("disabled", "true");
                        });

                        [].forEach.call(document.querySelector('main').querySelectorAll('input[type=radio]'), (radio) => {
                            radio.setAttribute("disabled", "true");
                        });

                        document.body.classList.add("read-only");
                    }
                    if(window.location.hash) {
                        document.getElementById(window.location.hash.replace("#", "")).scrollIntoView();
                    }
                }
            });
        });
    }

    bindIMDBDataToMovies(data) {
        var year = '';
        data.forEach(movie => {
            try {
                document.querySelector('img[data-object="' + movie.Title + '-' + movie.OscarYear + '-poster"]').src = movie.ImageUrl;
                document.querySelector('span[data-object="' + movie.Title + '-' + movie.OscarYear + '-rating"]').innerHTML = movie.Rating;
                document.querySelector('img[data-object="' + movie.Title + '-' + movie.OscarYear + '-poster"]').closest('a').href = "https://www.imdb.com/title/" + movie.ImdbID;
                if (movie.OscarYear != year) {
                    var movieTitleElement = document.querySelector('div[movie="' + movie.Title + '"][year="' + movie.OscarYear + '"]').nextElementSibling;
                    if (movieTitleElement.getAttribute('index') == "0") {
                        movieTitleElement.classList.add("trophy");
                    }
                    year = movie.OscarYear;
                }
            } catch (e) {
                // console.log('missing HTML element for: '+movie.Title + " | exception: " + e);
            }
        })
    }

    updateHasSeenCheckboxesAndCounts(allNomYears) {
        for (const count of allNomYears.Counts) {
            document.querySelector('div[data-object="' + count.Name + '"] span').innerHTML = count.MyCount;
        }

        for (const nomYear of allNomYears.MoviesList) {
            for (const movie of nomYear.Movies) {
                var movieName = movie.Name;
                for (const viewer of movie.Viewers) { //radio-1-{{../this.Name}}-{{../../this.Year}}-{{this.Name}}
                    try {
                        document.querySelector("input[name='" + 'checkbox-seen-' + movieName.replace(/'/g,"\\'") + '-' + nomYear.Year + '-' + viewer.Name + "']").checked = viewer.HasSeen;
                        document.querySelector("input[name='" + 'checkbox-skip-' + movieName.replace(/'/g,"\\'") + '-' + nomYear.Year + '-' + viewer.Name + "']").checked = viewer.Skip;
                        if (viewer.Rating == true) {
                            document.querySelector("input[id='" + 'radio-1-' + movieName.replace(/'/g,"\\'") + '-' + nomYear.Year + '-' + viewer.Name + "']").checked = true;
                        } else if (viewer.Rating == false) {
                            document.querySelector("input[id='" + 'radio-2-' + movieName.replace(/'/g,"\\'") + '-' + nomYear.Year + '-' + viewer.Name + "']").checked = true;
                        }
                    } catch {
                        //console.log('failed to update checkbox; selector was invalid (likely movie title with special characters');
                    }
                }
            }

        }
    }
}