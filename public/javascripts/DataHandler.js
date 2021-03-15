class DataHandler {

    constructor() {
    }

    fetchMovieDataFromAPI(limit, skip, userOne, userTwo) {
        var url = "/movies";

        if (limit != null) {
            url += "?limit=" + limit;
        }

        if (skip != null) {
            url += "&skip=" + skip;
        }

        if (userOne != null && userTwo != null) {
            if (url.includes('?')) {
                url += "&userOne=" + userOne + "&userTwo=" + userTwo;
            } else {
                url += "?userOne=" + userOne + "&userTwo=" + userTwo;
            }
        }


        return new Promise((resolve, reject) => {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    resolve(data);
                })
        });
    }

    fetchIMDBDataFromAPIOrLocalStorage(limit, skip) {
        var url = "/imdb";

        if (limit != null) {
            url += "?limit=" + limit;
        }

        if (skip != null) {
            url += "&skip=" + skip;
        }

        return new Promise((resolve, reject) => {
            if (!localStorage.getItem('imdb2021')) {
                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        localStorage.setItem('imdb2021', JSON.stringify(data));
                        resolve(data);
                    });
            } else {
                resolve(JSON.parse(localStorage.getItem('imdb2021')));
            }
        });
    }

    async postData(url = '', data = {}) {
        if (new URLSearchParams(window.location.search).get('userOne') != null) {
            url += "?userOne=" + new URLSearchParams(window.location.search).get('userOne');
        }

        if (new URLSearchParams(window.location.search).get('userTwo') != null) {
            url += "&userTwo=" + new URLSearchParams(window.location.search).get('userTwo');
        }

        try {
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
        } catch (e) {
            return e;
        }
    }

}