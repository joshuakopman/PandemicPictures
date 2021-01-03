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

    document.querySelector(".about-close").addEventListener("click", () => {
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
      movieContainer.querySelector('.chevron').addEventListener("click", (e) => {
        e.currentTarget.classList.toggle("chevron-active");
        var panel = movieContainer.querySelector(".panel");
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
          var moviePosterContainer = movieContainer.querySelector(".movie-poster-container");
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
    var userContainers = [...document.querySelectorAll(".user-container")];

    for (const userContainer of userContainers) {
      userContainer.querySelector('input[name*="checkbox-seen"]').addEventListener('click', (e) => {
        var yearIndex = e.currentTarget.getAttribute('year-index');
        var movieIndex = e.currentTarget.getAttribute('movie-index');
        var nameOfPersonWhoHasSeen = userContainer.querySelector('.user-name').innerText.trim();
        movies[yearIndex].Movies[movieIndex].Viewers.find((viewer) => viewer.Name == nameOfPersonWhoHasSeen).HasSeen = e.currentTarget.checked;
        this.myDataHandler.postData('/movies', movies);
      });

      userContainer.querySelector('input[name*="checkbox-skip"]').addEventListener('click', (e) => {
        var yearIndex = e.currentTarget.getAttribute('year-index');
        var movieIndex = e.currentTarget.getAttribute('movie-index');
        var nameOfPersonWhoHasSkipped = userContainer.querySelector('.user-name').innerText.trim();
        movies[yearIndex].Movies[movieIndex].Viewers.find((viewer) => viewer.Name == nameOfPersonWhoHasSkipped).Skip = e.currentTarget.checked;
        this.myDataHandler.postData('/movies', movies);
      });

      var likes = userContainer.querySelectorAll('input[name*="radio-group"]');
      for (const like of likes) {
        like.addEventListener('click', (e) => {
          var yearIndex = e.currentTarget.getAttribute('year-index');
          var movieIndex = e.currentTarget.getAttribute('movie-index');
          var nameOfPersonWhoHasRated = userContainer.querySelector('.user-name').innerText.trim();
          var movieViewers = movies[yearIndex].Movies[movieIndex].Viewers;
          if (e.currentTarget.id.includes("radio-2")) {
            movieViewers.find((viewer) => viewer.Name == nameOfPersonWhoHasRated).Rating = false;
          } else {
            movieViewers.find((viewer) => viewer.Name == nameOfPersonWhoHasRated).Rating = true;
          }
          this.myDataHandler.postData('/movies', movies);
        });
      }

    }
  }

  addRandomMovieClickListener() {
    var self = this;
    document.querySelector("#moviePickerButton").addEventListener("click", (e) => {
      var filtered = self.uiHelper.filterMoviesBySearchCriteriaAndChooseRandomly(
        document.querySelector('input[name="seenByFilter"]:checked')?.value,
        document.querySelector('input[name="skippedByFilter"]:checked')?.value,
        document.querySelector('#imdbSlider')?.value,
        document.querySelector('#durationSlider')?.value,
        document.querySelector('#minSlider')?.value,
        document.querySelector('#maxSlider')?.value,
        document.querySelector('input[id="winnersOnly"]:checked')?.value,
      );
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
    var filters = [...document.querySelectorAll('.filter-item input')];

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
    var filtered = this.uiHelper.filterMoviesBySearchCriteriaAndChooseRandomly(
      document.querySelector('input[name="seenByFilter"]:checked')?.value,
      document.querySelector('input[name="skippedByFilter"]:checked')?.value,
      document.querySelector('#imdbSlider')?.value,
      document.querySelector('#durationSlider')?.value,
      document.querySelector('#minSlider')?.value,
      document.querySelector('#maxSlider')?.value,
      document.querySelector('input[id="winnersOnly"]:checked')?.value,
    );

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


  get dataHandler() {
    return this.myDataHandler;
  }

}