import { useEffect, useState } from 'react';
import { Box, Container, dividerClasses } from '@mui/material';
import { NavLink } from 'react-router-dom';
import Pagination from '../components/Pagination';
import Typography from '@mui/material/Typography';
import Filter from '../components/Filter';

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

  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 30;
  const totalMovies = movies.length;
  const totalPages = Math.ceil(totalMovies / moviesPerPage);
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  return (
    <Container style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: '50px' }}>
      <Filter/>  
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {currentMovies.map(movie => (
          <Box key={movie.id} sx={{ width: 'calc(20% - 10px)', minWidth: '150px' }}>
            <a href=" ">
              < img src={movie.poster_url} alt={movie.title} style={{ width: '90%', height: 'auto' }} />
            </a >
            <Typography variant="h2" sx={{ marginTop: '5px', textAlign: 'center', fontSize: '12px' }}>
              {movie.title}
            </Typography>
          </Box>
        ))}
      </Box>
      <div className="movie-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '40px 0' }}>
        <Pagination
          count={totalPages}
          currentPage={currentPage}
          onChangePage={handleChangePage}
          sx={{ '& .MuiPaginationItem-root': { fontSize: '1.8rem', padding: '8px' } }}
        />
      </div>
    </Container>
  );
}
  // return (
  //   <Container style={{display: 'flex', flexWrap: 'wrap'}}>
  //     {movies.map((movie) =>
  //       <Box
  //         key={movie.imdb_title_id}
  //         p={3}
  //         m={2}
  //         // style={{ background: 'white', borderRadius: '16px', border: '2px solid #000' }}
  //         style={{ background: 'white', borderRadius: '16px', border: '2px solid #000', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', maxWidth: '300px' }}
  //       >
  //         {
  //           <img
  //             src={movie.poster_url}
  //             alt={`${movie.title}`}
  //           />
  //         }
  //         <h4 style={{ fontSize: '16px', lineHeight: '20px', maxHeight: '40px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'normal' }}>
  //           <NavLink to={`/movies/${movie.imdb_title_id}`}>{movie.title}</NavLink>
  //         </h4>
  //       </Box>
  //     )}
  //   </Container>
  // );