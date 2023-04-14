import { useEffect, useState } from 'react';
import { Box, Container } from '@mui/material';
import { NavLink } from 'react-router-dom';

const config = require('../config.json');

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/movies`)
      .then(res => res.json())
      .then(resJson => setMovies(resJson));
  }, []);

  // flexFormat provides the formatting options for a "flexbox" layout that enables the album cards to
  // be displayed side-by-side and wrap to the next line when the screen is too narrow. Flexboxes are
  // incredibly powerful. You can learn more on MDN web docs linked below (or many other online resources)
  // https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox
  const flexFormat = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' };

  return (
    // TODO (TASK 22): replace the empty object {} in the Container attribute sx with flexFormat. Observe the change to the Albums page. Then uncomment the code to display the cover image and once again observe the change, i.e. what happens to the layout now that each album card has a fixed width?
    <Container style={flexFormat}>
      {movies.map((movie) =>
        <Box
          key={movie.imdb_title_id}
          p={3}
          m={2}
          style={{ background: 'white', borderRadius: '16px', border: '2px solid #000' }}
        >
          {
          <img
            src={movie.poster_url}
            alt={`${movie.title}`}
          />
          }
          <h4><NavLink to={`/movies/${movie.imdb_title_id}`}>{movie.title}</NavLink></h4>
        </Box>
      )}
    </Container>
  );
}