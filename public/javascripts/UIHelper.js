class UIHelper {
    constructor() {

    }

    filterMoviesBySearchCriteriaAndChooseRandomly(filterValues) {
        var allMovieElements = [...document.querySelectorAll('.movie-container')];

        if (filterValues.winnersOnlyFilter) {
            allMovieElements = allMovieElements.filter(x => x.querySelector('h3').classList.contains('trophy'));
        }

        if (filterValues.seenByFilter) {
            allMovieElements = this.filterByRadioButtons(allMovieElements, "seen", filterValues.seenByFilter);
        }

        if (filterValues.skippedByFilter) {
            allMovieElements = this.filterByRadioButtons(allMovieElements, "skip", filterValues.skippedByFilter);
        }

        if (filterValues.imdbSliderFilter) {
            allMovieElements = allMovieElements.filter(x => parseFloat(x.querySelector("span[data-object*='rating']").innerHTML) >= filterValues.imdbSliderFilter);
        }

        if (filterValues.durationSliderFilter) {
            allMovieElements = allMovieElements.filter(x => parseInt(x.querySelector("span[data-object*='runtime']").innerHTML.replace(' min', '')) <= filterValues.durationSliderFilter);
        }

        if (filterValues.minSliderFilter) {
            allMovieElements = allMovieElements.filter(x => parseInt(x.parentNode.querySelector("h2").id) >= filterValues.minSliderFilter);
        }

        if (filterValues.maxSliderFilter) {
            allMovieElements = allMovieElements.filter(x => parseInt(x.parentNode.querySelector("h2").id) <= filterValues.maxSliderFilter);
        }

        return {
            "moviesList": allMovieElements,
            "randomlyChosenMovie": allMovieElements.sort(() => Math.random() - 0.5)[0]
        };
    }

    filterByRadioButtons(allElements, inputTypeName, userName) {
        if (userName == "Both") {
            allElements = allElements.filter(x => this.determineSelection(x, inputTypeName, userName, true, false));
        } else if (userName == "Neither") {
            allElements = allElements.filter(x => this.determineSelection(x, inputTypeName, userName, false, true));
        } else {
            allElements = allElements.filter(x => this.determineSelection(x, inputTypeName, userName, false, false));
        }

        return allElements;
    }

    determineSelection(element, inputTypeName, userName, isBoth, isNeither) {
        var include = false;
        var numberOfPeopleWhoHaveSeen = [...element.querySelectorAll(`input[name*="${inputTypeName}"]:checked`)].length;

        //show only movies no one has seen
        if (isNeither) {
            return numberOfPeopleWhoHaveSeen == 0;
        }
        //show only movies both of us have seen
        if (isBoth) {
            return numberOfPeopleWhoHaveSeen == 2;
        }

        //show only movies Alicia has seen XOR show only movies Josh has seen
        if (isBoth == false && isNeither == false) {
            element.querySelectorAll(`input[name*="${inputTypeName}"]:checked`).forEach(x => {
                if (x.getAttribute("name").includes(userName) && numberOfPeopleWhoHaveSeen == 1) {
                    include = true;
                }
            })
        }

        //missing:
        //show all movies Josh has seen, regardless of if Alicia has seen or not
        //show all movies Alicia has seen, regardless of if Josh has seen or not

        return include;
    }

}   