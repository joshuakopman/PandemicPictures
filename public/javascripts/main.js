function random(obj){
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
}


document.addEventListener('DOMContentLoaded', function () {
    const years = document.querySelectorAll('.accordion-title')
	for (const year of years) {
	  year.addEventListener('click', function(e) {
	  	var moviesForYear =  e.currentTarget.nextElementSibling;
	    if(moviesForYear.style.display == '') {
		    moviesForYear.style.display = 'block';
		} else {
			moviesForYear.style.display = '';
		}
	  })
	}

	fetch('/getMockObjectForStorage')
	.then(response => response.json())
  	.then(data => {
  		console.log(data);
  		localStorage.setItem('movies', JSON.stringify(data));
  	});
});


