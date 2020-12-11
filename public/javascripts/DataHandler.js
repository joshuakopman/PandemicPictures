class DataHandler {
    
    constructor() {
    }

    fetchMovieDataFromAPI(limit,skip) {
        console.log('fetching limit'+limit);
        var url = "/movies";

        if(limit != null) {
            url += "?limit=" + limit;
        }

        if(skip != null) {
            url += "&skip=" + skip;
        }

        return new Promise((resolve, reject) => {   
            fetch(url)
            .then(response => response.json())
            .then(data => {
               resolve(data);
            })
        });
    }

    fetchIMDBDataFromAPIOrLocalStorage(limit,skip) {   
        var url = "/imdb";

        if(limit != null) {
            url += "?limit=" + limit;
        }

        if(skip != null) {
            url += "&skip=" + skip;
        }

        return new Promise((resolve, reject) => {   
            if(!localStorage.getItem('imdb')) {
                fetch(url)
                .then(response => response.json())
                .then(data => 
                {
                    localStorage.setItem('imdb', JSON.stringify(data));
                    resolve(data);
                });
            } else {
                resolve(JSON.parse(localStorage.getItem('imdb')));
            }
        });
    }

    async postData(url = '', data = {}) {
        try{
            const response = await fetch(url, {
                method: 'POST', 
                cache: 'no-cache', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

          let jsonResp = await response.json();
          
          return jsonResp;
        } catch(e) {
            return e;
        }
    }

}