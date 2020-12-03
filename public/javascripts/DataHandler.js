class DataHandler {
    
    constructor() {
    }

    fetchMovieDataFromAPI() {
        return new Promise((resolve, reject) => {   
            fetch('/movies')
            .then(response => response.json())
            .then(data => {
               resolve(data);
            })
        });
    }

    fetchIMDBDataFromAPIOrLocalStorage() {     
        return new Promise((resolve, reject) => {   
            if(!localStorage.getItem('imdb')) {
                fetch('/imdb')
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