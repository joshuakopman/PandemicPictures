const { JSDOM } = require('jsdom');
const got = require("got");
const fs = require("fs");

class NomineeProvider {
    constructor() {

    }

    readMoviesFromDisk() {
       let raw = fs.readFileSync('./mocks/movies.json');
       let json = JSON.parse(raw);
       return json;
    }

    writeMoviesToDisk(payload){
       fs.writeFileSync('./mocks/movies.json', JSON.stringify(payload, null, 4));
    }

    async fetchNomineeMarkup(){
         let response = await got('https://en.wikipedia.org/wiki/Academy_Award_for_Best_Picture');
         let allNoms = this.parseNominees(response.body);
         return allNoms;
    }

   parseNominees(htmlPayload) {
        var allNominees = [];
        var wikipediaTables = new JSDOM(htmlPayload).window.document.querySelectorAll(".wikitable");
        var nomineeObj = {};
        for (const wikipediaTable of wikipediaTables) {
            if(!wikipediaTable.classList.contains('sortable')) {
                for (const wikipediaNomineeRow of wikipediaTable.querySelectorAll('tr')) {
                    var nominee = wikipediaNomineeRow.querySelector('td a')?.getAttribute('title');
                    if(nominee != null && nominee.indexOf('Academy Awards') < 0) {
                        if(nominee.indexOf('in film') > 0) {
                            if(Object.keys(nomineeObj).length != 0) {
                                allNominees.push(nomineeObj);
                            }
                            nomineeObj = {};
                            nomineeObj.Movies = [];
                            nomineeObj.Year = parseInt(nominee.substring(0,nominee.indexOf('in film')-1));
                        } else {
                            nomineeObj.Movies.push(
                                {
                                    'Name' : nominee.includes('(') ? nominee.substring(0,nominee.indexOf('(')-1) : nominee,
                                    'Viewers':[
                                         {
                                              "Name" : "Josh",
                                              "HasSeen" : true,
                                              "Rating" : "Up",
                                              "Skip" : false
                                        },
                                        {
                                              "Name" : "Alicia",
                                              "HasSeen" : false,
                                              "Rating" : "Down",
                                              "Skip" : false
                                        }
                                    ]
                                }
                            );
                        }
                    }
                }
          }
        }
        allNominees.push(nomineeObj);
        return allNominees;
    }
}

module.exports.NomineeProvider = NomineeProvider;