import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Container } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';

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

  


export default function FilterForm() {
    const [title, setTitle] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');

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

    return (
        <Container>
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <TextField
                    id="movieTitle"
                    label="Movie Title"
                    value={title}
                    onChange={handleTitleChange}
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
                    helperText="Please select the country or district"
                >
                    {countries.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
                {/* <Button variant="contained" size = "small">Go</Button> */}
            </Box>
        </Container>


    );
}
