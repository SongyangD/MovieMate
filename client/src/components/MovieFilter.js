import { useState } from 'react';
// import Box from '@mui/material/Box';
// import TextField from '@mui/material/TextField';
// import { Container } from '@mui/material';
// import MenuItem from '@mui/material/MenuItem';
// import Select from '@mui/material/Select';
// import Button from '@mui/material/Button';
// import Checkbox from '@mui/material/Checkbox';
import { Box, TextField, Checkbox, Container, MenuItem, Button, Slider, FormControlLabel, Typography } from '@mui/material';
const config = require('../config.json');

const genres = ['Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'Film-Noir', 'History', 'Horror', 'Music', 'Musical', 'Mystery', 'Reality-TV', 'Romance', 'Sci-Fi', 'Sport', 'Thriller', 'War', 'Western'];
const languages = [
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
    'Algeria',
    'Argentina',
    'Australia',
    'Austria',
    'Belgium',
    'Bosnia and Herzegovina',
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
    'Federal Republic of Yugoslavia',
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
    'Republic of North Macedonia',
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




export default function FilterForm(props) {
    // fetchUrl search_movies
    // const {fetchUrl, defaultMovies} = props;

    const [title, setTitle] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [checkIsOscar, setCheckIsOscar] = useState(true);
    const [yearRange, setYearRange] = useState([1900, 2023]);
    const [filteredMovies, setFilteredMovies] = useState([]);

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };
    const handleGenreChange = (event) => {
        setSelectedGenre(event.target.value);
    };
    const handleLanguageChange = (event) => {
        setSelectedLanguage(event.target.value);
    };
    const handleCountryChange = (event) => {
        setSelectedCountry(event.target.value);
    };
    const handleOscarChange = (event) => {
        setCheckIsOscar(event.target.checked);
    };
    const handleYearRangeChange = (event, newValue) => {
        setYearRange(newValue);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const queryParams = new URLSearchParams({
            title: title,
            genre: selectedGenre,
            language: selectedLanguage,
            country: selectedCountry,
            isOscar: checkIsOscar,
            year_start: yearRange[0],
            year_end: yearRange[1]
        });
        const url = `https://${config.server_host}:${config.server_port}/search_movies?${queryParams.toString()}`
        // const url = `http://${config.server_host}:${config.server_port}/search_movies?title=${title}&genre=${selectedGenre}&language=${selectedLanguage}&country=${selectedCountry}&year_low=${yearRange[0]}&year_low=${yearRange[1]}&isOscar=${checkIsOscar}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                // set filtered movies to the data received from the server
                setFilteredMovies(data);
                // call the onFilter function with the filtered movies
                props.onFilter(filteredMovies);
            })
            .catch(error => console.error(error));
    };

    return (
        <Container>
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
                onSubmit={handleSubmit}

            >
                <TextField
                    id="movieTitle"
                    label="Movie Title"
                    value={title}
                    onChange={handleTitleChange}
                    helperText="Please input the title"
                />
                <TextField
                    id="genreSelection"
                    select
                    label="Genre"
                    value={selectedGenre}
                    onChange={handleGenreChange}
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
                    onChange={handleLanguageChange}
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
                    onChange={handleCountryChange}
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
                            onChange={handleOscarChange}
                            name="isOscar"
                            color="primary"
                        />
                    }
                    label="isOscar"
                />
                <Slider
                    value={yearRange}
                    onChange={handleYearRangeChange}
                    valueLabelDisplay="auto"
                    aria-labelledby="year-range-slider"
                    min={1920}
                    max={2023}
                    step={1}
                    style={{ width: 200 }}
                    helperText="Please select the year range"
                />
                <Button sx={{ alignSelf: 'flex-start', height: '55px', width: '30px' }}
                    variant="outlined"
                    size="small"
                // sx={{ height: '50px', width: '20px' }}
                >
                    Find
                </Button>

            </Box>
        </Container >
    );
}
