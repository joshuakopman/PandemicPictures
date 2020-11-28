function random(obj) {
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

	fetch('/getIMDBMetadata')
	.then(response => response.json())
  	.then(data => {
  		console.log(data);
  	});	


	fetch('/getMockObjectForStorage')
	.then(response => response.json())
  	.then(data => {
  		localStorage.setItem('movies', JSON.stringify(data));
  	});	

  	var checkBoxes = document.querySelectorAll('input[type=checkbox]');
  	var moviesLS = JSON.parse(localStorage.getItem('movies'));
  	for (const checkBox of checkBoxes) {
	  checkBox.addEventListener('click', function(e) {
	  	var yIndex = e.currentTarget.getAttribute('year-index');
	  	var mIndex = e.currentTarget.getAttribute('movie-index');
	  	var personWhoHasSeen = e.currentTarget.parentNode.innerText.trim();
	  	moviesLS[yIndex].Movies[mIndex].Viewers.find(x => x.Name == personWhoHasSeen).HasSeen = e.currentTarget.checked;
	  	localStorage.setItem('movies', JSON.stringify(moviesLS));
	  });
	}

	setInterval(function() {
		//write localStorage to file
		postData(url = '/writeToDiskFromStorage', data = localStorage.getItem('movies'));
	},10000);

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
});





