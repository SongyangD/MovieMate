import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import PeopleCard from '../components/PeopleCard';
import { formatDuration, formatReleaseDate } from '../helpers/formatter';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Box, Container } from '@mui/material';
import { NavLink } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
const handleAvatarClick = (event, person) => {
  event.preventDefault();
  window.location.href = `/people/${person.id}`;
};

const config = require('../config.json');

export default function PeopleInfoPage() {
  const { imdb_name_id } = useParams();
  // const imdb_name_id = 'nm0000025';
  // console.log({imdb_name_id});

  const [peopleData, setPeopleData] = useState([]); // default should actually just be [], but empty object element added to avoid error in template code
  const [avgVote, setAvgVote] = useState({});
  const [relatedActors, setRelatedActors] = useState([]);
  const [moviesActedIn, setMoviesActedIn] = useState([]);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/people/${imdb_name_id}`)
      .then(res => res.json())
      .then(resJson => setPeopleData(resJson));
    fetch(`http://${config.server_host}:${config.server_port}/avg_vote_person/${imdb_name_id}`)
      .then(res => res.json())
      .then(resJson => setAvgVote(resJson));
    fetch(`http://${config.server_host}:${config.server_port}/related_actors/${imdb_name_id}`)
      .then(res => res.json())
      .then(resJson => setRelatedActors(resJson));
    fetch(`http://${config.server_host}:${config.server_port}/movie_people_acted/${imdb_name_id}`)
      .then(res => res.json())
      .then(resJson => setMoviesActedIn(resJson));
  }, []);
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 7,
      slidesToSlide: 7, // optional, default to 1.
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
      slidesToSlide: 5, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
      slidesToSlide: 3, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  };

  return (
    <Container>
      <div>
        <PeopleCard
          name={peopleData.name}
          avgVote={avgVote.avg_rating}
          date_of_birth={peopleData.date_of_birth}
          place_of_birth={peopleData.place_of_birth}
          bio={peopleData.bio}
          photo_url={peopleData.photo_url}
          date_of_death={peopleData.date_of_death}
        />
        {moviesActedIn && moviesActedIn.length > 0 && (
          <>
            <h3>Most Popular Movies</h3>
            <Carousel responsive={responsive} itemClass="carousel-item">
              {moviesActedIn.map((movie) => (
                <div key={movie.imdb_title_id}>
                  <NavLink to={`/movies/${movie.imdb_title_id}`}>
                    <img src={movie.poster_url} alt={`${movie.title} poster`} style={{ width: '100%' }} />
                  </NavLink>
                </div>
              ))}
            </Carousel>
          </>
        )}
        <Typography variant="h6" sx={{ mb: 2 }}>Related People</Typography>
        <div style={{ display: 'flex', overflowX: 'scroll' }}>
          {relatedActors.map(person => (
            <div key={person.name} style={{ marginRight: 50 }}>
              <NavLink to={`/people/${person.id}`} exact style={{ zIndex: 1 }}>
                <Avatar alt={person.name} src={person.photo_url} sx={{ width: 100, height: 100, cursor: 'pointer' }} onClick={(event) => handleAvatarClick(event, person)} />
              </NavLink>
              <Typography variant="subtitle1" sx={{ mt: 1 }}>{person.name}</Typography>
            </div>
          ))}
{/* 
          {relatedActors.map(person => (
            <div key={person.name} style={{ marginRight: 50 }}>
              <NavLink to={`/people/${person.id}`} exact>
                <Avatar alt={person.name} src={person.photo_url} sx={{ width: 100, height: 100 }} />
              </NavLink>
              <Typography variant="subtitle1" sx={{ mt: 1 }}>{person.name}</Typography>
            </div>
          ))} */}
        </div>
      </div>
    </Container>
  )
}