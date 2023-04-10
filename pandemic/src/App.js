import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import AllMoviesList from './components/AllMoviesList';

import './App.css';

function App() {

  const [moviesResponse, setMovies] = useState([]); // use an empty array as initial value

  useEffect(
    () => {
      fetch('/movies/reactMovies')
        .then(r => r.json())
        .then((r) => {
          setMovies(r);
        });
    },
    []
  );

  return (
    <div>
      <Header moviesResponse={moviesResponse}></Header>
      <AllMoviesList moviesResponse={moviesResponse}></AllMoviesList>
      <Footer></Footer>
    </div>
  );

}



export default App;