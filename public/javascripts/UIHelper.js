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
        return {
            "moviesList": allUserElements,
            "randomlyChosenMovie": allUserElements.sort(() => Math.random() - 0.5)[0]
        };
    }

    filterByRadioButtons(allElements, inputTypeName, userName) {
        var bothUserNames = ["Alicia", "Josh"];
        
        if (userName == "Both") {
            allElements = allElements.filter(
                x => x.querySelector('input[name*=\"'+inputTypeName+'\"]:checked')?.getAttribute("name").includes(bothUserNames[0])
                    && x.parentNode.querySelector('input[name*=\"'+inputTypeName+'\"]:checked')?.getAttribute("name").includes(bothUserNames[1]));
        } else if (userName == "Neither") {
            userName = bothUserNames;
            allElements = allElements.filter(
                x => !x.querySelector('input[name*=\"'+inputTypeName+'\"]:checked')?.getAttribute("name").includes(bothUserNames[0])
                    && !x.parentNode.querySelector('input[name*=\"'+inputTypeName+'\"]:checked')?.getAttribute("name").includes(bothUserNames[1]));
        } else {
            allElements = allElements.filter(
                x => x.querySelector('input[name*=\"'+inputTypeName+'\"]:checked')?.getAttribute("name").includes(userName));
        }

        return allElements;
    }

}   