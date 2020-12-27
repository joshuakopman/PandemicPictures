class UIHelper {
    constructor() {

    }

    filterMoviesBySearchCriteriaAndChooseRandomly(seenbyUserName, skippedByUserName, minIMDBRating, maxDuration, decade, winnersOnly) {
        var allUserElements = [...document.querySelectorAll('.user-container')];
        
        if (winnersOnly) {
            allUserElements = allUserElements.filter(x => x.parentNode.querySelector('h3').classList.contains('trophy'));
        }

        if (seenbyUserName) {
            allUserElements = this.filterByRadioButtons(allUserElements, "seen", seenbyUserName);
        }

        if (skippedByUserName) {
            allUserElements = this.filterByRadioButtons(allUserElements, "skip", skippedByUserName);
        }

        if (minIMDBRating) {
            allUserElements = allUserElements.filter(x => parseFloat(x.parentNode.parentNode.querySelector("span[data-object*='rating']").innerHTML) >= minIMDBRating);
        }

        if (maxDuration) {
            allUserElements = allUserElements.filter(x => parseInt(x.parentNode.parentNode.querySelector("span[data-object*='runtime']").innerHTML.replace(' min', '')) <= maxDuration);
        }

        return {
            "moviesList": allUserElements,
            "randomlyChosenMovie": allUserElements.sort(() => Math.random() - 0.5)[0]
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
        var numberOfPeopleWhoHaveSeen = [...element.parentNode.querySelectorAll(`input[name*="${inputTypeName}"]:checked`)].length;

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
            element.parentNode.querySelectorAll(`input[name*="${inputTypeName}"]:checked`).forEach(x => {
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