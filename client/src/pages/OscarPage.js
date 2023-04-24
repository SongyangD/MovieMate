import { useEffect, useState } from 'react';
import { Button, Checkbox, Container, FormControlLabel, Grid, Link, Slider, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {NavLink} from 'react-router-dom';
import {link} from 'react-router-dom';

import i1940 from '../images/1940.jpg';
import i1949 from '../images/1949.jpg';
import i1955 from '../images/1955.jpg';
import i1974 from '../images/1974.jpg';
import i1982 from '../images/1982.jpg';
import i1995 from '../images/1995.jpg';
import i2010 from '../images/2010.jpg';
import i2023 from '../images/2023.jpg';
import image1 from '../images/tt1.jpg';
import image2 from '../images/i2.jpg';
import rita from '../images/rita.jpg';

import image6 from '../images/z1.jpg';
import image7 from '../images/z2.jpg';
import image8 from '../images/i6.jpg';

import a2 from '../images/a2.png';
import a3 from '../images/a3.jpg';
import a5 from '../images/a5.jpg';
import a6 from '../images/a6.jpg';
import a7 from '../images/a8.jpg';
import a9 from '../images/a11.jpg';
import a10 from '../images/a12.jpg';

import SongCard from '../components/SongCard';
import { formatDuration } from '../helpers/formatter';
import ImageSliders from '../components/ImageSlider';
const config = require('../config.json');

export default function OscarPage() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [year, setYear] = useState('');

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/search_won`)
      .then(res => res.json())
      .then(resJson => {
        const moviesWithId = resJson.map((movie) => ({
          id: `${movie.imdb_title_id}-${movie.year}-${movie.category}-${movie.name}`,
          ...movie
        }));
        setData(moviesWithId);
      });
  }, []);
  

  // const search = () => {
  //   fetch(`http://${config.server_host}:${config.server_port}/search_oscar_filter?title=${title}` +
  //     `&language=${language}` +
  //     `&duration_low=${duration[0]}&duration_high=${duration[1]}}`
  //   )

  const search = () => {
    fetch(`http://${config.server_host}:${config.server_port}/search_won?year=${year}` )
    // `&language=${language}` +
    // `&country=${country}`)
    .then(res => res.json())
    .then(resJson => {
      const moviesWithId = resJson.map((movie) => ({
          id: `${movie.imdb_title_id}-${movie.year}-${movie.category}-${movie.name}`,
          ...movie
        }));
        setData(moviesWithId);
    });
}

  // This defines the columns of the table of songs used by the DataGrid component.
  // The format of the columns array and the DataGrid component itself is very similar to our
  // LazyTable component. The big difference is we provide all data to the DataGrid component
  // instead of loading only the data we need (which is necessary in order to be able to sort by column)
  // M.title, M.year, M.country, M.language, O.category, O.winner
  const columns = [
    { field: 'year', headerName: 'Year' },
    { field: 'category', headerName:'Category', width:300},
    {
      field: 'title',
      headerName: 'Title',
      width: 300,
      renderCell: (params) => (
        <a href={`/movies/${params.row.imdb_title_id}`} target="_blank" rel="noopener noreferrer">
          {params.value}
        </a>
      ),
    },
    {field: 'name',headerName:'Name',width: 250},
    
    { field: 'avg_vote', headerName: 'Rating' },
    { field: 'winner', headerName:'Win'},
  ]
  
  const slides =[
    // {url:image1, title:"non"},
    {url:a2, title:"The ceremony for the first-ever Academy Awards was held in 1929 in the Blossom Room of the Hollywood Roosevelt Hotel in Hollywood, California."},
    {url:a3, title:"There were only 270 guests at the first Academy Awards, and tickets cost just $5, which is about $87 today, adjusted for inflation."},
    // {url:i9, title:"The original design of the Oscar was realized by MGM art director Cedric Gibbons. He came up with a statuette of a knight standing on a reel of film gripping a crusader’s sword. The Academy commissioned the Los Angeles sculptor George Stanley to create the design in three dimensions, based on actor Emilio Fernandez."},
    {url:a5, title:"With Douglas Fairbanks, William C. deMille co-hosted the 1st Academy Awards in 1929, and the ceremony lasted just 15 minutes."},
    {url:a6, title:"Today, the typical ceremony looks very different, with around 3,400 attendees and 24 categories."},
    {url:a7, title:"However, due to the coronavirus pandemic, the 2021 event was even smaller than the first ceremony back in 1929."},
    {url:a10, title:"MGM art director Cedric Gibbons designed a statuette of a knight standing on a reel of film gripping a crusader’s sword. The Academy tapped Los Angeles sculptor George Stanley to realize the design in three dimensions and the world renowned statuette was born."},
    {url:a9, title:"The Academy says the first statuettes were made from gold-plated solid bronze but then switched over to Britannia metal. During a metal shortage in World War II, the statuettes were made of painted plaster for at least three years. After the war, the plaster was exchanged for gold-plated metal, which is how we know the Oscar statuette today."}
  ]

  const slides2= [
    {url:image1, title:"Janet Gaynor: The First Woman To Win The Academy Award For Best Actress in 1929."},
    {url: i1940, title:"Best Film Editing: Anne Bauchens (North West Mounted Police, 1940)"},
    {url: i1949, title:"Best Costume Design: Dorothy Jeakins Karinska (Joan of Arc, 1948)"},
    {url: i1955, title:"Best Documentary Feature: Nancy Hamilton (Helen Keller in Her Story, 1955)"},
    {url:image2, title:"In 1983, Buffy Sainte-Marie became the first Indigenous person to win an Oscar for Best Original Song."},
    {url:rita, title:"In 1962, Rita Moreno became the first Latina woman to win an Oscar."},
    {url:i1974, title:"Julia Phillips was the first female producer to win an Oscar for best picture. She won for The Sting in 1973."},
    {url:i1982, title:"Best Makeup and Hairstyling Sarah Monzani and Michèle Burke (Quest for Fire, 1982)"},
    {url:i1995, title:"Marleen Gorris is the first woman to win Best Foreign Language Film. She won for ANTONIA'S LINE at the 68th Academy Awards."},
    {url:image6, title:"In 1985, Kay Rose won an Oscar for best sound editing — the first woman to do so."},
    {url:image7, title: "Halle Berry remains the only Black woman to win an Academy Award for best actress in 2002."},
    {url:i2010, title:"Best Sound: Lora Hirschberg (Inception, 2010)"},
    {url:image8, title: "Kathryn Bigelow became the first woman ever to win best director. She won in 2010 for The Hurt Locker."},
    {url:i2023, title: " Michelle Yeoh would make history as the first woman of Asian descent to win a best actress Oscar in 2023."}]

    

    const titleStyle = {
      color: "red",
      fontSize: "2rem",
      textAlign: "center",
      margin: "1rem 0",
    };

  // This component makes uses of the Grid component from MUI (https://mui.com/material-ui/react-grid/).
  // The Grid component is super simple way to create a page layout. Simply make a <Grid container> tag
  // (optionally has spacing prop that specifies the distance between grid items). Then, enclose whatever
  // component you want in a <Grid item xs={}> tag where xs is a number between 1 and 12. Each row of the
  // grid is 12 units wide and the xs attribute specifies how many units the grid item is. So if you want
  // two grid items of the same size on the same row, define two grid items with xs={6}. The Grid container
  // will automatically lay out all the grid items into rows based on their xs values.
  const containerStyles={
    width: '1500px',
    height: '300px',
    margin: '0 auto',
  };

  const containerStyles2={
    width: '1500px',
    height: '350px',
    margin: '0 auto',
  };

// const bodyStyle = {
//   backgroundColor: "black",
//   color: "red"
// };

const searchContainerStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '100px',
  width: '100%',
  maxWidth: '600px'
};

  return (

    <body >
            <div>
        <h1></h1>
        <div style={containerStyles}>
        <ImageSliders slides={slides} parentWidth={500}/>
        </div>
   
      </div > 
       
    <Container>
       <div style={{ marginTop: '100px' }}>
      {/* <h2>Search Movie</h2> */}
      <Grid container spacing={2} style={{ marginLeft: '250px' }} alignItems="centerContent" direction="row" justify="center">
  <Grid item xs={4}>
    <TextField label="Year" value={year} onChange={(e) => setYear(e.target.value)} fullWidth />
  </Grid>
  <Grid item xs={2} style={{ marginTop: '20px', marginLeft:'5px' }}>
    <Button variant="outlined" onClick={() => search()} fullWidth>
      Search
    </Button>
  </Grid>
</Grid>
</div>

      {/* <Button onClick={() => search()} style={{ left: '50%', transform: 'translateX(-50%)' }}>
        Search
      </Button> */}
      <h1> </h1>

      {/* Notice how similar the DataGrid component is to our LazyTable! What are the differences? */}
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />
    </Container>

    <div>
        <h1></h1>
        <div style={containerStyles2}>
        <ImageSliders slides={slides2} parentWidth={500}/>
        </div>
   
      </div>

    </body>

  );
}