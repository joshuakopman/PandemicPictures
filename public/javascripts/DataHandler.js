class DataHandler {
    
    constructor() {
    }

    fetchMovieDataFromAPI() {
        return new Promise((resolve, reject) => {   
        console.log('promise');         
            fetch('/getMovies')
            .then(response => response.json())
            .then(data => {
                console.log(data);
               resolve(data);
            })
        });
    }

    fetchIMDBDataFromAPIOrLocalStorage() {     
        return new Promise((resolve, reject) => {   
            if(!localStorage.getItem('imdb')) {
                console.log('imdb aint in store');
                fetch('/getIMDBForStorage')
                .then(response => response.json())
                .then(data => 
                {
                    console.log('ratings');
                    console.log(data);
                    localStorage.setItem('imdb', JSON.stringify(data));
                    resolve(data);
                });
            } else {
                console.log('imdbbb')
                resolve(JSON.parse(localStorage.getItem('imdb')));
            }
        });
    }
async postData(url = '', data = {}) {
      const response = await fetch(url, {
        method: 'POST', 
        cache: 'no-cache', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      return response.json();
    }

}