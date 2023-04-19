import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Container, Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { NavLink } from 'react-router-dom';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import Avatar from '@mui/material/Avatar';


const config = require('../config.json');

const styles = {
  cardContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    margin: ' auto',
  },
  cardMedia: {
    width: 400, // set a fixed width
    height: 500, // set a fixed height
    flex: '0 0 200px',
  },
  cardContent: {
    flex: '1 1 auto',
    margin: '0 16px',
    minWidth: 0,
    // fontSize: '2rem',
  },
};


export default function MovieInfoPage() {
  const { movie_id } = useParams();
  const [movieData, setMovieData] = useState([]);
  const [moviePeople, setMoviePeople] = useState([{}]);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/movies/${movie_id}`)
      .then(res => res.json())
      .then(resJson => {
        console.log('Movie data:', resJson);
        setMovieData(resJson);
      });

    fetch(`http://${config.server_host}:${config.server_port}/movie_people/${movie_id}`)
      .then(res => res.json())
      .then(resJson => setMoviePeople(resJson));
  }, [movie_id]);

  return (
    <Container>
      <div style={{ margin: '5%' }}>
        <Card sx={styles.cardContainer}>
          <CardMedia
            component="img"
            sx={styles.cardMedia}
            image={movieData.poster_url}
          />
          <CardContent sx={styles.cardContent}>
            <Typography gutterBottom variant="h4" component="div" >
              {movieData.title}
            </Typography>
            {/* <Typography component="legend">Rating:</Typography> */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Rating name="read-only" value={movieData.avg_vote / 2} readOnly />
              <Typography variant="subtitle1" sx={{ marginLeft: '5px', fontSize: '20px', marginTop: '0px' }}>
                {`${(movieData.avg_vote / 2).toFixed(1)}`}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.primary" sx={{ fontSize: 20 }}>
              Release Year: <span style={{ color: '#999' }}>{movieData.year}</span>
            </Typography>
            <Typography variant="body2" color="text.primary" sx={{ fontSize: 20 }}>
              Director: <span style={{ color: '#999' }}>{movieData.director}</span>
            </Typography>
            <Typography variant="body2" color="text.primary" sx={{ fontSize: 20 }}>
              Genre: <span style={{ color: '#999' }}>{movieData.genre}</span>
            </Typography>
            <Typography variant="body2" color="text.primary" sx={{ fontSize: 20 }}>
              Country: <span style={{ color: '#999' }}>{movieData.country}</span>
            </Typography>
            <Typography variant="body2" color="text.primary" sx={{ fontSize: 20 }}>
              Language: <span style={{ color: '#999' }}>{movieData.language}</span>
            </Typography>
            <Typography variant="body2" color="text.primary" sx={{ fontSize: 20 }}>
              Duration: <span style={{ color: '#999' }}>{movieData.duration}</span>
            </Typography>
            <Typography variant="body2" color="text.primary" sx={{ fontSize: 20 }}>
              Oscar Nominations: <span style={{ color: '#999' }}>{movieData.Oscar_nominated ? 'Yes' : 'No'}</span>
            </Typography>
            <Typography variant="body2" color="text.secondary" style={{ marginTop: '18px' }}>
              {movieData.description}
            </Typography>
          </CardContent>
        </Card>
      </div>
      <div>
        <Typography variant="h6" sx={{ mb: 2 }}>Related People</Typography>
        <div style={{ display: 'flex', overflowX: 'scroll' }}>
          {moviePeople.map(person => (
            <div key={person.name} style={{ marginRight: 50 }}>
              <NavLink to={`/people/${person.imdb_name_id}`}>
                <Avatar alt={person.name} src={person.photo_url} sx={{ width: 100, height: 100 }} />
              </NavLink>
              <Typography variant="subtitle1" sx={{ mt: 1 }}>{person.name}</Typography>
            </div>
          ))}
        </div>
      </div>
    </Container>

  );
}