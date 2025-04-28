class UIEventListenerManager {

  constructor(dataHandler, UIHelper) {
    this.myDataHandler = dataHandler;
    this.uiHelper = UIHelper;
    this.chosenMovieElement = null;
  }

  addAboutListeners() {
    var aboutContainer = document.querySelector("#about-box");

    document.querySelector("#about-button").addEventListener("click", () => {
      aboutContainer.style.display = (aboutContainer.style.display != 'block') ?
        aboutContainer.style.display = 'block' :
        aboutContainer.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
      if (event.target == aboutContainer) {
        aboutContainer.style.display = 'none';
      }
    });

    document.querySelector('button[data-object="about-close"]').addEventListener("click", () => {
      aboutContainer.style.display = 'none';
    });
  }

  addChevronClickListeners(imdb) {
    var chevron = document.querySelector("#filterChevron");
    chevron.addEventListener("click", () => {
      var filtersPanel = document.querySelector("#filtersPanel");
      if (filtersPanel.style.display != 'flex') {
        filtersPanel.style.display = "flex";
      } else {
        filtersPanel.style.display = 'none';
      }
    });

    var movieContainers = [...document.querySelectorAll("div[data-object='movie-container']")];
    movieContainers.forEach(movieContainer => {
      movieContainer.querySelector('div[data-object="chevron"]').addEventListener("click", (e) => {
        e.currentTarget.classList.toggle("chevron-active");
        var panel = movieContainer.querySelector('div[data-object="panel"]');
        if (panel) {
          if (panel.style.display === "block") {
            panel.style.display = "none";
          } else {
            var currentElementMovie = e.currentTarget.getAttribute("Movie");
            var currentElementYear = e.currentTarget.getAttribute("Year");
            var renderPanel = Handlebars.compile(document.getElementById('panel-template').innerHTML);
            panel.innerHTML = renderPanel({ name: currentElementMovie, year: currentElementYear });

            var matchingMovie = imdb.find(x => x.Title == currentElementMovie && x.OscarYear == currentElementYear);
            if (matchingMovie) {
              document.querySelector('span[data-object="' + currentElementMovie + '-' + currentElementYear + '-director"]').innerHTML = matchingMovie.Director;
              document.querySelector('span[data-object="' + currentElementMovie + '-' + currentElementYear + '-genre"]').innerHTML = matchingMovie.Genre;
              document.querySelector('span[data-object="' + currentElementMovie + '-' + currentElementYear + '-actors"]').innerHTML = matchingMovie.Actors;
              document.querySelector('span[data-object="' + currentElementMovie + '-' + currentElementYear + '-plot"]').innerHTML = matchingMovie.Plot;
              panel.style.display = "block";
            }
          }
          var moviePosterContainer = movieContainer.querySelector('div[data-object="movie-poster-container"]');
          if (moviePosterContainer.style.zIndex === "999") {
            moviePosterContainer.style.zIndex = "inherit";
          } else {
            moviePosterContainer.style.zIndex = "999";
          }
        }
      });
    });
  }

  addInputClickListeners(movies) {
    var userContainers = [...document.querySelectorAll('div[data-object="user-container"]')];

    for (const userContainer of userContainers) {
      userContainer.querySelector('input[name*="checkbox-seen"]').addEventListener('click', (e) => {
        this.addInputClickListener(e, userContainer.querySelector('div[data-object="user-name"]').innerText.trim(), "HasSeen", movies);

      });
      userContainer.querySelector('input[name*="checkbox-skip"]').addEventListener('click', (e) => {
        this.addInputClickListener(e, userContainer.querySelector('div[data-object="user-name"]').innerText.trim(), "Skip", movies);
      });
      var likes = userContainer.querySelectorAll('input[name*="radio-group"]');
      for (const like of likes) {
        like.addEventListener('click', (e) => {
          this.addInputClickListener(e, userContainer.querySelector('div[data-object="user-name"]').innerText.trim(), "Rating", movies);
        });
      }
    }
  }

  addInputClickListener(e, nameOfPerson, value, movies) {
    var movieViewers = movies[e.currentTarget.getAttribute('year-index')].Movies[e.currentTarget.getAttribute('movie-index')].Viewers;
    if (value == "Rating") {
      if ((e.currentTarget.id.includes("radio-2") && movieViewers.find((viewer) => viewer.Name == nameOfPerson)[value] == false) ||
        (e.currentTarget.id.includes("radio-1") && movieViewers.find((viewer) => viewer.Name == nameOfPerson)[value] == true)) {
        e.currentTarget.checked = false;
        movieViewers.find((viewer) => viewer.Name == nameOfPerson)[value] = null;
      }
      else {
        if (e.currentTarget.id.includes("radio-2")) {
          movieViewers.find((viewer) => viewer.Name == nameOfPerson)[value] = false;
        } else {
          movieViewers.find((viewer) => viewer.Name == nameOfPerson)[value] = true;
        }
      }

    } else {
      movieViewers.find((viewer) => viewer.Name == nameOfPerson)[value] = e.currentTarget.checked;
    }
    this.myDataHandler.postData('/movies', movies);
  }

  addRandomMovieClickListener() {
    var self = this;
    document.querySelector("#moviePickerButton").addEventListener("click", (e) => {
      var filtered = self.uiHelper.filterMoviesBySearchCriteriaAndChooseRandomly(this.getFiltersValues());
      if (self.chosenMovieElement) {
        self.chosenMovieElement.classList.remove("chosen-one");
      }
      self.chosenMovieElement = filtered.randomlyChosenMovie;
      self.chosenMovieElement.classList.add("chosen-one");
      self.chosenMovieElement.scrollIntoView();
      if (document.querySelector("#filtersPanel").style.display == "flex") {
        window.scrollBy(0, -500);
      } else {
        window.scrollBy(0, -200);
      }
    });
  }

  bindFilterClickListener() {
    var self = this;
    var filters = [...document.querySelectorAll('div[data-object="filter-item"] input')];

    filters.forEach(x => x.addEventListener("click", (e) => {
      self.applyFilters();
    }));

    document.querySelector('#durationSlider').addEventListener("change", (e) => {
      self.applyFilters();
    });

    document.querySelector('#clearFilters').addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelector("#filtersPanel").reset();
      self.applyFilters(true);
    });
  }

  applyFilters(resetClicked = false) {
    var filterValues = this.getFiltersValues();
    document.cookie = "filterCookie=" + JSON.stringify(filterValues);
    var filtered = this.uiHelper.filterMoviesBySearchCriteriaAndChooseRandomly(filterValues);

    document.querySelectorAll('div[data-object="movie-container"]').forEach(x => x.style.display = 'none');
    filtered.moviesList.forEach(x => x.style.display = 'block');
    var clearFilterValue = document.querySelector("#clearFilters").value;

    if (clearFilterValue.includes("(")) {
      document.querySelector("#clearFilters").value = clearFilterValue.substring(0, clearFilterValue.indexOf('(') - 1);
    }
    if (!resetClicked) {
      document.querySelector("#clearFilters").value += " ( Showing " + filtered.moviesList.length + " Matches )";
    }

    var yearContainers = [...document.querySelectorAll('div[data-object="year-container"]')];
    yearContainers.filter(x => x.querySelectorAll('div[data-object="movie-container"][style*="block"]').length == 0 && x.children[0].getAttribute("id").substring(x.children[0].getAttribute("id").length - 1) != "0").forEach(y => y.style.display = 'none');
    yearContainers.filter(x => x.querySelectorAll('div[data-object="movie-container"][style*="block"]').length > 0).forEach(y => y.style.display = 'flex');
  }

  getFiltersValues() {
    return {
      seenByFilter: document.querySelector('input[name="seenByFilter"]:checked')?.value,
      skippedByFilter: document.querySelector('input[name="skippedByFilter"]:checked')?.value,
      imdbSliderFilter: document.querySelector('#imdbSlider')?.value,
      durationSliderFilter: document.querySelector('#durationSlider')?.value,
      minSliderFilter: document.querySelector('#minSlider')?.value,
      maxSliderFilter: document.querySelector('#maxSlider')?.value,
      winnersOnlyFilter: document.querySelector('input[id="winnersOnly"]:checked')?.value
    }
  }

  setFilters(filterCookie) {
    document.querySelector('#imdbSlider').value = filterCookie.imdbSliderFilter;
    document.querySelector('#imdbSlider').nextElementSibling.value = filterCookie.imdbSliderFilter;

    document.querySelector('#durationSlider').value = filterCookie.durationSliderFilter;
    document.querySelector('#durationSlider').nextElementSibling.value = filterCookie.durationSliderFilter;

    document.querySelector('#minSlider').value = filterCookie.minSliderFilter;
    document.querySelector('#minSlider').nextElementSibling.value = filterCookie.minSliderFilter;

    document.querySelector('#maxSlider').value = filterCookie.maxSliderFilter;
    document.querySelector('#maxSlider').nextElementSibling.value = filterCookie.maxSliderFilter;

    document.querySelector('input[id="winnersOnly"]').checked = filterCookie.winnersOnlyFilter;

    var matchingSeenByFilter = [...document.querySelectorAll('input[name="seenByFilter"]')].find(x => x.value == filterCookie.seenByFilter);
    if (matchingSeenByFilter) {
      matchingSeenByFilter.checked = true;
    }

    var matchingSkippedByFilter = [...document.querySelectorAll('input[name="skippedByFilter"]')].find(x => x.value == filterCookie.skippedByFilter)
    if (matchingSkippedByFilter) {
      matchingSkippedByFilter.checked = true;
    }
  }

  get dataHandler() {
    return this.myDataHandler;
  }

}