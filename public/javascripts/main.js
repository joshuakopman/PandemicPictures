/*function random(obj) {
	var unseenMovies = [];
	var seenMovies = [];
	var allMoviesWeighted = [];
	obj.forEach((o)=> {
		var unseen = o.Movies.filter(m => m.Viewers[0].HasSeen == false && m.Viewers[1].HasSeen == false).map(m => m.Name);
		if(unseen.length > 0) {
			unseenMovies = unseenMovies.concat(unseen);
		}

		var seen = o.Movies.filter(m => m.Viewers[0].HasSeen == true || m.Viewers[1].HasSeen == true).map(m => m.Name);
		if(seen.length > 0) {
			seenMovies = seenMovies.concat(seen);
		}
	});

	allMoviesWeighted = seenMovies.concat(unseenMovies);

	for(var x=0;x<100;x++) {
		allMoviesWeighted = allMoviesWeighted.concat(unseenMovies);
	}
	
	console.log(allMoviesWeighted.filter(x =>x == "Wings").length);
	
	var name = allMoviesWeighted.sort(() => Math.random() - 0.5);

	document.querySelector('#chosenMovie').innerHTML = name[0];
}*/

async function postData(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST', 
    cache: 'no-cache', 
    headers: {
      'Content-Type': 'application/json'
    },
    body: data
  });
  return response.json();
}

function fetchDataFromAPI() {
	fetch('/getIMDBForStorage')
	.then(response => response.json())
  	.then(data => {
  		for(const movie of data){
  			document.querySelector('img[data-object="'+movie.Title+'-poster"]').src = movie.ImageUrl;
  			document.querySelector('span[data-object="'+movie.Title+'-rating"]').innerHTML = movie.Rating;
  			document.querySelector('span[data-object="'+movie.Title+'-director"]').innerHTML = movie.Director;
  			document.querySelector('span[data-object="'+movie.Title+'-runtime"]').innerHTML = movie.Runtime;
  			document.querySelector('span[data-object="'+movie.Title+'-genre"]').innerHTML = movie.Genre;
  			document.querySelector('span[data-object="'+movie.Title+'-rating"]').innerHTML = movie.Rating;
  			document.querySelector('span[data-object="'+movie.Title+'-actors"]').innerHTML = movie.Actors;
  			document.querySelector('span[data-object="'+movie.Title+'-plot"]').innerHTML = movie.Plot;
  			document.querySelector('span[data-object="'+movie.Title+'-imdbID"]').innerHTML = movie.ImdbID;
  		}
  	});	

	fetch('/getMoviesForStorage')
	.then(response => response.json())
  	.then(data => {
  		localStorage.setItem('movies', JSON.stringify(data));
  	});	
}

function handleSeenCheckboxes(){
  	var checkBoxes = document.querySelectorAll('input[type=checkbox]');
  	var moviesLS = JSON.parse(localStorage.getItem('movies'));
  	for (const checkBox of checkBoxes) {
	  checkBox.addEventListener('click', function(e) {
	  	var yIndex = e.currentTarget.getAttribute('year-index');
	  	var mIndex = e.currentTarget.getAttribute('movie-index');
	  	console.log(moviesLS[yIndex].Movies[mIndex].Viewers);
	  	var personWhoHasSeen = e.currentTarget.parentNode.parentNode.innerText.trim();
	  	console.log(personWhoHasSeen);
	  	moviesLS[yIndex].Movies[mIndex].Viewers.find(x => x.Name == personWhoHasSeen).HasSeen = e.currentTarget.checked;
	  	localStorage.setItem('movies', JSON.stringify(moviesLS));
	  });
	}
}

function pollLocalStorage(){
	setInterval(function() {
		postData(url = '/writeMoviesToDiskFromStorage', data = localStorage.getItem('movies'));
	},10000);
}

document.addEventListener('DOMContentLoaded', function () {
	fetchDataFromAPI();
	handleSeenCheckboxes();
	pollLocalStorage();
});





