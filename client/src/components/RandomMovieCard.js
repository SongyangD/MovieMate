import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
const config = require('../config.json');

const styles = {
  cardContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%', 
    margin: '0 auto',
    // border: '1px solid #3f51b5',
  },
  cardMedia: {
    width: 300, // set a fixed width
    height: 450, // set a fixed height
    flex: '0 0 200px',
  },
  cardContent: {
    flex: '1 1 auto',
    margin: '0 16px',
    minWidth: 0,
    // fontSize: '2rem',
  },
};

export default function MediaCard() {


  const [oscarMovieOfTheDay, setOscarMovieOfTheDay] = useState({});

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/oscar_recommend`)
      .then(res => res.json())
      .then(resJson => setOscarMovieOfTheDay(resJson[0]));
  }, []);


  return (
    <div style={{margin: '2%'}}>
    <Card sx={styles.cardContainer}> 
      <a href={`/movies/${oscarMovieOfTheDay.imdb_title_id}`}>
        <CardMedia
          component="img"
          sx={styles.cardMedia}
          image={oscarMovieOfTheDay.poster_url}
        />
      </a>
      <CardContent sx={styles.cardContent}>

        <Typography gutterBottom variant="h5" component="div" style={{ marginTop: '32px' }}>
        <a href={`/movies/${oscarMovieOfTheDay.imdb_title_id}`}>{oscarMovieOfTheDay.title}</a>
        </Typography>
        <Typography variant="body2" color="text.primary" sx={{ fontSize: 16 }}>
          Release year: {oscarMovieOfTheDay.year}
        </Typography>
        <Typography variant="body2" color="text.primary" sx={{ fontSize: 16 }}>
          Duration: {oscarMovieOfTheDay.duration} minutes
        </Typography>
        <Typography variant="body2" color="text.primary" sx={{ fontSize: 16 }}>
          Director: {oscarMovieOfTheDay.director_name}
        </Typography>
        <Typography variant="body2" color="text.primary" sx={{ fontSize: 16 }}>
          Oscar Nominations: {oscarMovieOfTheDay.num_nominations }
        </Typography>
        <Typography variant="body2" color="text.secondary" style={{ marginTop: '16px' }}>
        {oscarMovieOfTheDay.description}
        </Typography>
      </CardContent>
      {/* <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions> */}
    </Card>
    </div>
  );
}