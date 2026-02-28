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
            localStorage.removeItem('imdbUpdated2023');
            localStorage.removeItem('imdbUpdated2024');
            localStorage.removeItem('imdbUpdated2025');
            localStorage.removeItem('imdbUpdated2026');
            localStorage.removeItem('imdbUpdated2027');
            localStorage.removeItem('imdbUpdated2028');
            if (!localStorage.getItem('imdbUpdated2029')) {
                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        localStorage.setItem('imdbUpdated2029', JSON.stringify(data));
                        resolve(data);
                    });
            } else {
                resolve(JSON.parse(localStorage.getItem('imdbUpdated2029')));
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
        console.log(data);
        try {
            const response = await fetch(url, {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
    
            if (response.ok && response.status !== 204) {
                try {
                    const jsonResp = await response.json();
                    return jsonResp;  // return the parsed response
                } catch (jsonError) {
                    // Catch JSON parse error if response isn't valid JSON
                    console.error('Error parsing JSON from response:', jsonError);
                    return null;
                }
            } else {
                // Handle empty responses with status 204 or invalid responses
                console.error('Error: Received empty or invalid response with status', response.status);
                return null;
            }
        } catch (e) {
            console.error('POST request failed:', e);
            return e;
        }
    }

}