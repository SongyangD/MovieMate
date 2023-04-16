import { useEffect, useState } from 'react';
import { Container, Divider, Box} from '@mui/material';
// import { NavLink } from 'react-router-dom';

// import LazyTable from '../components/LazyTable';
import SongCard from '../components/SongCard';
import MediaCard from '../components/RandomMovieCard';
import GenreTabs from '../components/GenreCard'
import TopTabs from '../components/TopMovieCard'
import LanguageTabs from '../components/LanguageCard'
const config = require('../config.json');




export default function HomePage() {

  const [appAuthor, setAppAuthor] = useState("");
  const [selectedMovieId, setSelectedMovieId] = useState(null);


  useEffect(() => {

    fetch(`http://${config.server_host}:${config.server_port}/author/name`)
      .then(res => res.text())
      .then(resText => setAppAuthor(resText));


  }, []);

  const genreList = [
    "Action",
    "Comedy",
    "Romance",
    "Fantasy",
    "Sci-Fi",
    "Drama",
    "Adventure",
    "Mystery",
    "History",
    "Family",
    "War",
    "Biography",
    "Crime",
    "Sport",
    "Western"
  ];

  const languageList = [
    "English",
    "German",
    "Mandarin",
    "Italian",
    "French",
    "Spanish",
    "Japanese",
    "Russian",
    "Dutch",
    "Danish",
    "Korean",
    "Cantonese",
    "Latin",
    "Hindi",
    "Thai"
  ];

  return (
    <Container>
      
      {/* <div>
        <h1>MovieEase</h1>
        <h2> ola</h2>
        <p>Welcome</p>
      </div> */}
      {/* SongCard is a custom component that we made. selectedSongId && <SongCard .../> makes use of short-circuit logic to only render the SongCard if a non-null song is selected */}
      {selectedMovieId && <SongCard songId={selectedMovieId} handleClose={() => setSelectedMovieId(null)} />}
      <h2>Oscar Nominated Movie of the day:</h2>
      {/* <h2>Check out your Oscar Nominated Movie of the day:&nbsp;
         <Link onClick={() => setSelectedMovieId(oscarMovieOfTheDay.imdb_title_id)}>{oscarMovieOfTheDay.title}</Link> 
      </h2> */}
      <MediaCard></MediaCard>
      <Divider />
      <h2>Recent 10 Movies by Genre</h2>
      {/* <Button variant="outlined" href="#outlined-buttons">
        Disabled
      </Button>
      <Button variant="outlined" href="#outlined-buttons">
        Link
      </Button> */}
      <Box>
      {/* <GenreTabs></GenreTabs> */}
      <TopTabs
        tabList={genreList}
        fetchUrl={'recent10genre'}
        defaultTab={'Action'}
        tabType={'Genre'}
      />
      </Box>
      {/* <LazyTable route={`http://${config.server_host}:${config.server_port}/top_songs`} columns={songColumns} /> */}
      <Divider />
      {/* TODO (TASK 16): add a h2 heading, LazyTable, and divider for top albums. Set the LazyTable's props for defaultPageSize to 5 and rowsPerPageOptions to [5, 10] */}
      <h2>Top 10 Movies by Language</h2>
      <Box>
      {/* <LanguageTabs></LanguageTabs> */}

      <TopTabs
        tabList={languageList}
        fetchUrl={'top10language'}
        defaultTab={'English'}
        tabType={'Language'}
      />
      </Box>
      
      {/* TODO (TASK 17): add a paragraph (<p>text</p>) that displays the value of your author state variable from TASK 13 */}
      <Divider />
      <p>{appAuthor}</p>
    </Container>
  );
};