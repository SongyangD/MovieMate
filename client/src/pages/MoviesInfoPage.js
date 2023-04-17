import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import SongCard from '../components/SongCard';
import { formatDuration, formatReleaseDate } from '../helpers/formatter';
const config = require('../config.json');

export default function MovieInfoPage() {
  // const { movie_id } = useParams();
  const movie_id = 'tt0111161';

  // const [songData, setSongData] = useState([{}]); // default should actually just be [], but empty object element added to avoid error in template code
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
        {/* {selectedSongId && <SongCard songId={selectedSongId} handleClose={() => setSelectedSongId(null)} />} */}
        <Stack direction='row' justify='center'>
          <img
            key={movieData.imdb_title_id}
            src={movieData.poster_url}
            alt={`${movieData.title} `}
            style={{
              marginTop: '40px',
              marginRight: '40px',
              marginBottom: '40px'
            }} />
          <Stack>
            <h1 style={{ fontSize: 64 }}>{movieData.title}</h1>
            <h2>Released: {formatReleaseDate(movieData.year)}</h2>
          </Stack>
        </Stack>
      </Container>
  );
}
  // return (
  //   <Container>
  //     <div style={{ margin: '2%' }}>
  //       <Card sx={styles.cardContainer}>
  //         <CardMedia
  //           component="img"
  //           sx={styles.cardMedia}
  //           image={movieData.poster_url}
  //         />
  //         <CardContent sx={styles.cardContent}>
  //           <Typography gutterBottom variant="h5" component="div">
  //             <a href={`/movies/${movieData.imdb_title_id}`}>{movieData.title}</a>
  //           </Typography>
  //           <Typography variant="body2" color="text.primary" sx={{ fontSize: 16 }}>
  //             Release year: {movieData.year}
  //           </Typography>
  //           <Typography variant="body2" color="text.primary" sx={{ fontSize: 16 }}>
  //             Duration: {movieData.duration} minutes
  //           </Typography>
  //           <Typography variant="body2" color="text.primary" sx={{ fontSize: 16 }}>
  //             Director: {movieData.director_name}
  //           </Typography>
  //           <Typography variant="body2" color="text.primary" sx={{ fontSize: 16 }}>
  //             Oscar Nominations: {movieData.num_nominations}
  //           </Typography>
  //           <Typography variant="body2" color="text.secondary" style={{ marginTop: '16px' }}>
  //             {movieData.description}
  //           </Typography>
  //         </CardContent>
  //         {/* <CardActions>
  //       <Button size="small">Share</Button>
  //       <Button size="small">Learn More</Button>
  //     </CardActions> */}
  //       </Card>
  //     </div>
  //   </Container>
  // );