class UIEventListenerManager {

  constructor(dataHandler, UIHelper) {
    this.myDataHandler = dataHandler;
    this.uiHelper = UIHelper;
    this.chosenMovieElement = null;
  }

  addChevronClickListeners(imdb) {
    var chevron = document.querySelector("#filterChevron");
    chevron.addEventListener("click", (e) => {
      if (document.querySelector("#filtersPanel").style.display == "none") {
        document.querySelector("#filtersPanel").style.display = "flex";
      } else {
        document.querySelector("#filtersPanel").style.display = 'none';
      }
    });

    var chevrons = document.querySelectorAll("main .chevron");
    var i;
    for (i = 0; i < chevrons.length; i++) {
      chevrons[i].addEventListener("click", (e) => {
        e.currentTarget.classList.toggle("chevron-active");
        var grandParentNode = e.currentTarget.parentNode.parentNode;
        var panel = grandParentNode.querySelector(".panel");
        if (panel) {
          if (panel.style.display === "block") {
            panel.style.display = "none";
          } else {

            var template = document.getElementById('panel-template').innerHTML;
            var renderPanel = Handlebars.compile(template);
            var panelData = { name: e.currentTarget.getAttribute("Movie"), year: e.currentTarget.getAttribute("Year") };
            panel.innerHTML = renderPanel(panelData);

            var movie = imdb.find(x => x.Title == e.currentTarget.getAttribute("Movie") && x.OscarYear == e.currentTarget.getAttribute("Year"));
            if (movie) {
              document.querySelector('span[data-object="' + e.currentTarget.getAttribute("Movie") + '-' + e.currentTarget.getAttribute("Year") + '-director"]').innerHTML = movie.Director;
              // document.querySelector('span[data-object="' + e.currentTarget.getAttribute("Movie") + '-' + e.currentTarget.getAttribute("Year") + '-runtime"]').innerHTML = movie.Runtime;
              document.querySelector('span[data-object="' + e.currentTarget.getAttribute("Movie") + '-' + e.currentTarget.getAttribute("Year") + '-genre"]').innerHTML = movie.Genre;
              document.querySelector('span[data-object="' + e.currentTarget.getAttribute("Movie") + '-' + e.currentTarget.getAttribute("Year") + '-actors"]').innerHTML = movie.Actors;
              document.querySelector('span[data-object="' + e.currentTarget.getAttribute("Movie") + '-' + e.currentTarget.getAttribute("Year") + '-plot"]').innerHTML = movie.Plot;
              panel.style.display = "block";
            }
          }
          var moviePosterContainer = grandParentNode.querySelector(".movie-poster-container");
          if (moviePosterContainer.style.zIndex === "999") {
            moviePosterContainer.style.zIndex = "inherit";
          } else {
            moviePosterContainer.style.zIndex = "999";
          }
        }
      });
    }
  }

  addInputClickListeners(movies) {
    var checkBoxes = document.querySelectorAll('input[name*="checkbox-seen"]');
    for (const checkBox of checkBoxes) {
      checkBox.addEventListener('click', (e) => {
        var yearIndex = e.currentTarget.getAttribute('year-index');
        var movieIndex = e.currentTarget.getAttribute('movie-index');
        var nameOfPersonWhoHasSeen = e.currentTarget.parentNode.parentNode.innerText.trim();
        movies[yearIndex].Movies[movieIndex].Viewers.find((viewer) => viewer.Name == nameOfPersonWhoHasSeen).HasSeen = e.currentTarget.checked;
        this.myDataHandler.postData('/movies', movies);
      });
    }

    var skips = document.querySelectorAll('input[name*="checkbox-skip"]');
    for (const skip of skips) {
      skip.addEventListener('click', (e) => {
        var yearIndex = e.currentTarget.getAttribute('year-index');
        var movieIndex = e.currentTarget.getAttribute('movie-index');
        var nameOfPersonWhoHasSkipped = e.currentTarget.parentNode.parentNode.innerText.trim();
        movies[yearIndex].Movies[movieIndex].Viewers.find((viewer) => viewer.Name == nameOfPersonWhoHasSkipped).Skip = e.currentTarget.checked;
        this.myDataHandler.postData('/movies', movies);
      });
    }

    var likes = document.querySelectorAll('input[name*="radio-group"]');
    for (const like of likes) {
      like.addEventListener('click', (e) => {
        var yearIndex = e.currentTarget.getAttribute('year-index');
        var movieIndex = e.currentTarget.getAttribute('movie-index');
        var nameOfPersonWhoHasRated = e.currentTarget.parentNode.parentNode.innerText.trim();
        if (e.currentTarget.id.includes("radio-2")) {
          movies[yearIndex].Movies[movieIndex].Viewers.find((viewer) => viewer.Name == nameOfPersonWhoHasRated).Rating = false;
        } else {
          movies[yearIndex].Movies[movieIndex].Viewers.find((viewer) => viewer.Name == nameOfPersonWhoHasRated).Rating = true;
        }
        this.myDataHandler.postData('/movies', movies);
      });
    }
  }

  addRandomMovieClickListener(movieData) {
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
      self.chosenMovieElement = filtered.randomlyChosenMovie.parentNode.parentNode;
      self.chosenMovieElement.classList.add("chosen-one");
      self.chosenMovieElement.scrollIntoView();
      window.scrollBy(0, -200);
    });
  }

  bindFilterClickListener() {
    var self = this;
    var filters = [...document.querySelector('#filtersPanel').childNodes].filter(x => x.tagName == 'INPUT');
    filters.forEach(x => x.addEventListener("click", (e) => {
      self.applyFilters();
    }));

    document.querySelector('#durationSlider').addEventListener("change", (e) => {
      self.applyFilters();
    });
  }

  applyFilters() {
    var filtered = this.uiHelper.filterMoviesBySearchCriteriaAndChooseRandomly(
      document.querySelector('input[name="seenByFilter"]:checked')?.value,
      document.querySelector('input[name="skippedByFilter"]:checked')?.value,
      document.querySelector('#imdbSlider')?.value,
      document.querySelector('#durationSlider')?.value,
      document.querySelector('#minSlider')?.value,
      document.querySelector('#maxSlider')?.value,
      document.querySelector('input[id="winnersOnly"]:checked')?.value,
    );

    document.querySelectorAll('.movie-container').forEach(x => x.style.display = 'none');
    filtered.moviesList.forEach(x => x.parentNode.parentNode.style.display = 'block');

    [...document.querySelectorAll('.year-container')].filter(x => x.querySelectorAll('.movie-container[style*="block"]').length == 0 && x.children[0].getAttribute("id").substring(x.children[0].getAttribute("id").length - 1) != "0").forEach(y => y.style.display = 'none');
    [...document.querySelectorAll('.year-container')].filter(x => x.querySelectorAll('.movie-container[style*="block"]').length > 0).forEach(y => y.style.display = 'flex');
  }
  

  get dataHandler() {
    return this.myDataHandler;
  }

}