import { useEffect, useState } from 'react';
import { Container, Divider, Box } from '@mui/material';
import MediaCard from '../components/RandomMovieCard';
import TopTabs from '../components/TopMovieCard'
import { NoSsr } from '@mui/material';
const config = require('../config.json');

export default function HomePage() {

const [appAuthor, setAppAuthor] = useState("");

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/author/name`)
      .then(res => res.text())
      .then(resText => setAppAuthor(resText));
  }, []);

  const genreList = [
    "Drama",
    "Comedy",
    "Romance",
    "Crime",
    "Action",
    "Adventure",
    "Thriller",
    "Mystery",
    "Fantasy",
    "History",
    "Biography",
    "War",
    "Family",
    "Animation",
    "Music",
    "Sci-Fi",
    "Sport",
    "Musical"
  ];

  const languageList = [
    "English",
    "Mandarin",
    "French",
    "Spanish",
    "German",
    "Italian",
    "Japanese",
    "Russian",
    "Dutch",
    "Danish",
    "Korean",
    "Cantonese",
    "Latin",
    "Hindi",
    "Thai",
    "Portuguese"
  ];


  return (
    <Container>
      <h1 style={{ textAlign: 'center' }}>Oscar Movie of the Day       </h1>
      <NoSsr>
        <MediaCard />
      </NoSsr>
      <Divider />
      <h1 style={{ textAlign: 'center' }}>Genre</h1>
      <Box>
        <TopTabs
          tabList={genreList}
          fetchUrl={'recentgenre'}
          defaultTab={'Drama'}
          tabType={'Genre'}
        />
      </Box>
      <Divider />
      <h1 style={{ textAlign: 'center' }}>Language</h1>
      <Box>
        <TopTabs
          tabList={languageList}
          fetchUrl={'toplanguage'}
          defaultTab={'English'}
          tabType={'Language'}
        />
      </Box>

      <Divider />
      <p>{appAuthor}</p>
      <footer>
        <p>Disclaimer: We created this movie and Oscar data web application as a course project, driven by our passion for cinema. We overcame numerous challenges to bring our vision to life and hope that our platform provides valuable insights for movie enthusiasts. However, please note that this web application is not affiliated with the Academy of Motion Picture Arts and Sciences or the Oscars. The data presented here is based on publicly available information and is provided for informational purposes only. We cannot guarantee its accuracy. We remain impartial and do not endorse any particular movie, actor, or director. We are passionate about this web application and welcome any feedback or suggestions.</p>
      </footer>
    </Container>
  );
};
