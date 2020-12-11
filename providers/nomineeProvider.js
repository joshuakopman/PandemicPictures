import JSDOM  from 'jsdom';
import got from "got";
import { readFileSync, writeFile } from "fs";

class NomineeProvider {
    constructor() {
    
    }

    readMoviesFromDisk(limit,skip) {
      let raw = readFileSync('./mocks/movies.json');
      var resp = {};
      let json = JSON.parse(raw);
      if(limit && skip) {
        resp.MoviesList = json.slice(skip,skip+limit);
      }else {
        resp.MoviesList = json;
      }
      resp.TotalMovies = [].concat.apply([],json.map(x => x.Movies.map(y => y.Name))).length;
      resp.Counts = []
      resp.Counts.push(this.getMoviesWatchedCount(json, "Josh"));
      resp.Counts.push(this.getMoviesWatchedCount(json, "Alicia"));
    
      return resp;
    }

    getMoviesWatchedCount(movies,name) {
        var viewers = movies.map(y => y.Movies.map(z => z.Viewers));
        var flatViewers = [].concat.apply([],viewers);
        var flatterViewers = [].concat.apply([],flatViewers);
        var count = flatterViewers.filter(z => z.Name == name && z.HasSeen == true).length;                         
        
        return { "Name" : name, "MyCount" : count };
    }

    writeMoviesToDisk(payload) {
       //updates server data store JSON for movie ratings; not under source control
       writeFile('./mocks/movies.json', JSON.stringify(payload, null, 4), (err, result) => {
          if(err) console.log('error', err);
        });

        //update a copy of movie ratings JSON for local development; under source control
        writeFile('./movies_local.json', JSON.stringify(payload, null, 4), (err, result) => {
            if(err) console.log('error', err);
          });
    }

    async fetchNomineeMarkup() {
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

const _NomineeProvider = NomineeProvider;
export { _NomineeProvider as NomineeProvider };