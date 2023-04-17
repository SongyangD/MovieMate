import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Pagination from '../components/Pagination';
import { Box, TextField, Checkbox, Container, MenuItem, Button, Slider, FormControlLabel, Typography } from '@mui/material';
import Rating from '@mui/material/Rating';
import Grid from '@mui/material/Grid';
import defaultImage from '../images/i6.jpg';

const config = require('../config.json');
const genres = ['All genres', 'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'Film-Noir', 'History', 'Horror', 'Music', 'Musical', 'Mystery', 'Reality-TV', 'Romance', 'Sci-Fi', 'Sport', 'Thriller', 'War', 'Western'];
const languages = [
  'All languages',
  'Aboriginal',
  'Afrikaans',
  'Albanian',
  'American Sign Language',
  'Arabic',
  'Armenian',
  'Bengali',
  'Bosnian',
  'Bulgarian',
  'Cantonese',
  'Catalan',
  'Chinese',
  'Croatian',
  'Czech',
  'Dari',
  'Danish',
  'Dutch',
  'English',
  'Estonian',
  'Finnish',
  'Filipino',
  'Flemish',
  'French',
  'Georgian',
  'German',
  'Greek',
  'Hebrew',
  'Hindi',
  'Hokkien',
  'Hungarian',
  'Icelandic',
  'Indonesian',
  'Inuktitut',
  'Irish',
  'Italian',
  'Japanese',
  'Korean',
  'Kurdish',
  'Latin',
  'Latvian',
  'Lithuanian',
  'Mandarin',
  'Malayalam',
  'Marathi',
  'Min Nan',
  'Norwegian',
  'Persian',
  'Polish',
  'Portuguese',
  'Punjabi',
  'Quechua',
  'Romanian',
  'Romany',
  'Russian',
  'Scottish Gaelic',
  'Serbian',
  'Serbo-Croatian',
  'Shanghainese',
  'Slovak',
  'Slovenian',
  'Spanish',
  'Swahili',
  'Swedish',
  'Swiss German',
  'Tagalog',
  'Tamil',
  'Telugu',
  'Thai',
  'Tibetan',
  'Turkish',
  'Ukrainian',
  'Urdu',
  'Vietnamese',
  'Wolof',
  'Xhosa',
  'Yiddish',
  'Zulu'
];
const countries = [
  'All countries',
  'Algeria',
  'Argentina',
  'Australia',
  'Austria',
  'Belgium',
  'Brazil',
  'Bulgaria',
  'Canada',
  'Chile',
  'China',
  'Colombia',
  'Croatia',
  'Cuba',
  'Czech Republic',
  'Czechoslovakia',
  'Denmark',
  'East Germany',
  'Egypt',
  'Estonia',
  'Finland',
  'France',
  'Georgia',
  'Germany',
  'Greece',
  'Hong Kong',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Ireland',
  'Israel',
  'Italy',
  'Japan',
  'Kazakhstan',
  'Latvia',
  'Lithuania',
  'Luxembourg',
  'Mexico',
  'Morocco',
  'Netherlands',
  'New Zealand',
  'Norway',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Qatar',
  'Romania',
  'Russia',
  'Senegal',
  'Serbia',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'South Africa',
  'South Korea',
  'Soviet Union',
  'Spain',
  'Sweden',
  'Switzerland',
  'Taiwan',
  'Thailand',
  'Tunisia',
  'Turkey',
  'UK',
  'Ukraine',
  'United Arab Emirates',
  'Uruguay',
  'USA',
  'Venezuela',
  'West Germany',
  'Yugoslavia'
];

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesLoaded, setMoviesLoaded] = useState(false);

  const [title, setTitle] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [checkIsOscar, setCheckIsOscar] = useState(false);
  const [yearRange, setYearRange] = useState([1900, 2023]);

  const moviesPerPage = 30;
  const totalMovies = movies.length;
  const totalPages = totalMovies > 0 ? Math.ceil(totalMovies / moviesPerPage) : 0;
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies && movies.length > 0 ? movies.slice(indexOfFirstMovie, indexOfLastMovie) : [];

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/movies`)
      .then(res => res.json())
      .then(resJson => {
        setMovies(resJson);
        setMoviesLoaded(true);
      });
  }, []);

  const search = () => {
    fetch(`http://${config.server_host}:${config.server_port}/search_movies?title=${title}` +
      `&genre=${selectedGenre}` +
      `&language=${selectedLanguage}` +
      `&country=${selectedCountry}` +
      `&year_low=${yearRange[0]}&year_high=${yearRange[1]}` +
      `&isOscar=${checkIsOscar}`
    )
      .then(res => res.json())
      .then(resJson => setMovies(resJson));
  }

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  return (
    <Container style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: '50px', display: "flex", flexDirection: "column" }}>
      <Box
        component="form"
        sx={{
          '& > :not(style)': { m: 1, minwidth: '25ch' },
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="movieTitle"
          label="Movie Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          helperText="Please input the title"
        />
        <TextField
          id="genreSelection"
          select
          label="Genre"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value === 'All genres' ? '' : e.target.value)}
          defaultValue=""
          helperText="Please select the genre"
        >
          {genres.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id="languageSelection"
          select
          label="Language"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value === 'All languages' ? '' : e.target.value)}
          defaultValue=""
          helperText="Please select the language"
        >
          {languages.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id="countrySelection"
          select
          label="Country"
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value === 'All countries' ? '' : e.target.value)}
          defaultValue=""
          helperText="Please select the country"
        >
          {countries.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <FormControlLabel
          control={
            <Checkbox
              checked={checkIsOscar}
              onChange={(e) => setCheckIsOscar(e.target.checked)}
            // name="isOscar"
            // color="primary"
            />
          }
          label="isOscar"
        />
        <Slider
          value={yearRange}
          onChange={(e, newValue) => setYearRange(newValue)}
          valueLabelDisplay="auto"
          aria-labelledby="year-range-slider"
          min={1900}
          max={2023}
          step={1}
          style={{ width: 200 }}
        // helperText="Please select the year range"
        />
        {/* <Button onClick={() => search()} sx={{ alignSelf: 'flex-start', height: '55px', width: '30px' }}
          variant="outlined"
          size="small"
        // sx={{ height: '50px', width: '20px' }}
        >
          Find
        </Button> */}
        <Button onClick={() => search()} style={{ left: '50%', transform: 'translateX(-50%)' }}>
          Search
        </Button>
      </Box>
      {moviesLoaded && currentMovies && currentMovies.length > 0 ? (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '40px' }}>
          {currentMovies.map(movie => (
            <Box key={movie.id} sx={{ width: 'calc(20% - 10px)', minWidth: '150px' }}>
              <NavLink to={`/movies/${movie.imdb_title_id}`}>
                <img src={movie.poster_url ? movie.poster_url : defaultImage} alt={movie.title} style={{ height: '300px', width: '210px' }} />
              </NavLink>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="body1" sx={{ fontSize: '14px', marginBottom: '0px' }}>
                    {movie.title}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Rating name="read-only" value={movie.avg_vote / 2} readOnly />
                    <Typography variant="subtitle1" sx={{ marginLeft: '5px', fontSize: '15px', marginTop: '0px' }}>
                      {`${(movie.avg_vote / 2).toFixed(1)}`}
                    </Typography>
                  </div>
                </Grid>
              </Grid>
            </Box>
          ))}
        </Box>
      ) : (
        !moviesLoaded ? <Box sx={{ fontSize: 24 }}>Loading movies...</Box> :
          <Box sx={{ fontSize: 24 }}>No movies found</Box>
      )}
      <div className="movie-page"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '40px 0',
          flex: "1 1 auto"
        }}>
        <Pagination
          count={totalPages}
          currentPage={currentPage}
          onChangePage={handleChangePage}
          sx={{ '& .MuiPaginationItem-root': { fontSize: '1.8rem', padding: '8px' } }} />
      </div>
    </Container>
  );
}