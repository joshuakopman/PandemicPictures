class UIManager {
    constructor(UIEventListenerManager, ws) {
        this.socket = ws;
        this.uiEventListenerManager = UIEventListenerManager;
        this.header = document.getElementById("header");
        this.sticky = this.header.offsetTop;
        this.initialSkip = 0;
        this.initialLimit = 6;
        this.ratingsTemplate = document.getElementById('ratings-template');
        this.UserOne = new URLSearchParams(window.location.search).get('userOne') ?? 'Josh';
        this.UserTwo = new URLSearchParams(window.location.search).get('userTwo') ?? 'Alicia';
    }

    initializeView() {
        var self = this;
        self.uiEventListenerManager.addAboutListeners();

        Handlebars.registerHelper("inc", (value, options) => {
            return parseInt(value) + 1;
        });

        this.socket.onmessage = () => {
                self.uiEventListenerManager.dataHandler.fetchMovieDataFromAPI(null,null,self.UserOne,self.UserTwo).then(movieData => {
                self.updateHasSeenCheckboxesAndCounts(movieData);
            });
        };

        this.setFilterPanelNames();

        this.compileTemplatesAndBindElementData();

        window.requestIdleCallback(() => {
            setTimeout(() => {
                self.initialLimit = 93;
                self.compileTemplatesAndBindElementData(true);
            }, 500);
        });

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > this.sticky) {
                this.header.classList.add("sticky");
            } else {
                this.header.classList.remove("sticky");
            }
        }, false);

        self.uiEventListenerManager.bindFilterClickListener();
    }

    compileTemplatesAndBindElementData(allMoviesLoaded) {
        var self = this;

        self.uiEventListenerManager.dataHandler.fetchMovieDataFromAPI(self.initialLimit, self.initialSkip, self.UserOne,self.UserTwo).then(movieData => {
 
            var renderRatings = Handlebars.compile(this.ratingsTemplate.innerHTML);

            document.getElementsByTagName('main')[0].innerHTML = renderRatings({
                moviesList: movieData.MoviesList
            });

            self.uiEventListenerManager.dataHandler.fetchIMDBDataFromAPIOrLocalStorage(null,null,self.UserOne,self.UserTwo).then(imdbData => {
                self.bindIMDBDataToMovies(imdbData);
                self.updateHasSeenCheckboxesAndCounts(movieData);

                document.getElementById('ajaxLoader').style.display = 'none';
                document.getElementsByTagName('main')[0].style.display = "block";
                document.getElementsByTagName('footer')[0].style.display = 'block';
                document.getElementById('about-button').style.display = 'block';
                
                if (allMoviesLoaded) {
                    self.uiEventListenerManager.addRandomMovieClickListener();
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
                    if (window.location.hash) {
                        document.getElementById(window.location.hash.replace("#", "")).scrollIntoView();
                    }

                    if(this.getCookie('filterCookie')) {
                        self.uiEventListenerManager.setFilters(JSON.parse(this.getCookie('filterCookie')));
                        self.uiEventListenerManager.applyFilters();
                    }
                }
            });
        });
    }
    getCookie = function (name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }

    bindIMDBDataToMovies(data) {
        data.forEach(movie => {
            try {
                var moviePosterElement = document.querySelector('img[data-object="' + movie.Title + '-' + movie.OscarYear + '-poster"]');
                moviePosterElement.src = movie.ImageUrl;
                moviePosterElement.closest('a').href = "https://www.imdb.com/title/" + movie.ImdbID;
                document.querySelector('span[data-object="' + movie.Title + '-' + movie.OscarYear + '-rating"]').innerHTML = movie.Rating;
                document.querySelector('span[data-object="' + movie.Title + '-' + movie.OscarYear + '-runtime"]').innerHTML = movie.Runtime;
                var movieTitleElement = document.querySelector('div[movie="' + movie.Title + '"][year="' + movie.OscarYear + '"]').nextElementSibling;
                if (movieTitleElement.getAttribute('index') == "0") {
                    movieTitleElement.classList.add("trophy");
                }

            } catch (e) {
            }
        })
    }

    updateHasSeenCheckboxesAndCounts(allNomYears) {
        for (const count of allNomYears.Counts) {
            document.querySelector('div[data-object="totals-' + count.Name + '"] span').innerHTML = count.MyCount;
            document.querySelector('div[data-object="sticky-' + count.Name + '"] span').innerHTML = count.MyCount;
        }

        for (const nomYear of allNomYears.MoviesList) {
            for (const movie of nomYear.Movies) {
                var movieName = movie.Name;
                for (const viewer of movie.Viewers) {
                    try {
                        document.querySelector("input[name='" + 'checkbox-seen-' + movieName.replace(/'/g, "\\'") + '-' + nomYear.Year + '-' + viewer.Name + "']").checked = viewer.HasSeen;
                        document.querySelector("input[name='" + 'checkbox-skip-' + movieName.replace(/'/g, "\\'") + '-' + nomYear.Year + '-' + viewer.Name + "']").checked = viewer.Skip;
                        if (viewer.Rating == true) {
                            document.querySelector("input[id='" + 'radio-1-' + movieName.replace(/'/g, "\\'") + '-' + nomYear.Year + '-' + viewer.Name + "']").checked = true;
                        } else if (viewer.Rating == false) {
                            document.querySelector("input[id='" + 'radio-2-' + movieName.replace(/'/g, "\\'") + '-' + nomYear.Year + '-' + viewer.Name + "']").checked = true;
                        }
                    } catch {
                    }
                }
            }

        }
    }

    setFilterPanelNames() {
        var radioButtonsInFilters = [...document.querySelectorAll("div[data-object='filter-item'] input[type=radio]")];
        radioButtonsInFilters[0].nextElementSibling.innerHTML = this.UserOne;
        radioButtonsInFilters[0].value = this.UserOne;
        radioButtonsInFilters[1].nextElementSibling.innerHTML = this.UserTwo;
        radioButtonsInFilters[1].value = this.UserTwo;
        radioButtonsInFilters[4].nextElementSibling.innerHTML = this.UserOne;
        radioButtonsInFilters[4].value = this.UserOne;
        radioButtonsInFilters[5].nextElementSibling.innerHTML = this.UserTwo;
        radioButtonsInFilters[5].value = this.UserTwo;
    }
}