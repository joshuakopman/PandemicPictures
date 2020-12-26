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
        if (userName == "Both") {
            allElements = allElements.filter(x => this.determineSelection(x,inputTypeName,userName,true,false));
        } else if (userName == "Neither") {
            allElements = allElements.filter(x => this.determineSelection(x,inputTypeName,userName,false,true));

        } else {
            allElements = allElements.filter(x => this.determineSelection(x,inputTypeName,userName,false,false));
        }

        return allElements;
    }

    determineSelection(element,inputTypeName,userName,isBoth,isNeither) {
        var include = false;
        var numberOfPeopleWhoHaveSeen = [...element.parentNode.querySelectorAll(`input[name*="${inputTypeName}"]:checked`)].length;
        
        if(isNeither) {
            return numberOfPeopleWhoHaveSeen == 0;
        }

        if(isBoth) {
            return numberOfPeopleWhoHaveSeen == 2;
        }

        if(isBoth == false && isNeither == false) {
            element.parentNode.querySelectorAll(`input[name*="${inputTypeName}"]:checked`).forEach( x => {
                    if(x.getAttribute("name").includes(userName) && numberOfPeopleWhoHaveSeen == 1){
                        include = true;
                    }
            })
        } 
        
        return include;
    }

}   