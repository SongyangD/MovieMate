import { useEffect, useState } from 'react';
import { Button, Checkbox, Container, FormControlLabel, Grid, Link, Slider, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import SongCard from '../components/SongCard';
import { formatDuration } from '../helpers/formatter';
import ImageSliders from '../components/ImageSlider';
const config = require('../config.json');

export default function OscarPage() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [selectedSongId, setSelectedSongId] = useState(null);

  const [country, setCountry] = useState('');
  const [year, setYear] = useState('');
  const [language, setLanguage] = useState('');

//   useEffect(() => {
//     fetch(`http://${config.server_host}:${config.server_port}/search_won`)
//       .then(res => res.json())
//       .then(resJson => {
//         setData(resJson);
//       });
//   }, []);


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
    { field: 'title', headerName: 'Title', width: 300},
  //   renderCell: (params) => (
  //      <Link onClick={() => setSelectedSongId(params.row.song_id)}>{params.value}</Link>
  // ) 
    {field: 'name',headerName:'Name',width: 250},
    
    // { field: 'country', headerName: 'Country' },
   // {field: 'category', headerName: 'Category'},
    { field: 'avg_vote', headerName: 'Rating' },
    { field: 'winner', headerName:'Win'},
    // error + mucial _  music o
//     at Query._handleFinalResultPacket (C:\Users\12674\Documents\GitHub\Team168_Project\server\node_modules\mysql\lib\protocol\sequences\Query.js:149:8)
//     at Query.EofPacket (C:\Users\12674\Documents\GitHub\Team168_Project\server\node_modules\mysql\lib\protocol\sequences\Query.js:133:8)       
//     at Protocol._parsePacket (C:\Users\12674\Documents\GitHub\Team168_Project\server\node_modules\mysql\lib\protocol\Protocol.js:291:23)       

// Node.js v18.15.0
//     at Sequence.end (C:\Users\12674\Documents\GitHub\Team168_Project\server\node_modules\mysql\lib\protocol\sequences\Sequence.js:83:24)       
//     at Query._handleFinalResultPacket (C:\Users\12674\Documents\GitHub\Team168_Project\server\node_modules\mysql\lib\protocol\sequenc
//    {field: 'category', headerName: 'Category'}
  ]

  const slides =[
    {url: "https://images.alphacoders.com/122/1220430.jpg", title:"snoopy"},
    {url: "https://images4.alphacoders.com/854/854483.png", title:"gumball"},
    {url: "https://wallpapercave.com/wp/wp2022676.jpg", title:"snowball"},
    {url: "https://post.healthline.com/wp-content/uploads/2021/11/lotus-flower-in-pond-732x549-thumbnail-732x549.jpg", title:"flower"},
    {url: "https://www.adobe.com/content/dam/cc/us/en/creativecloud/illustration-adobe-illustration/how-to-draw-trees/draw-trees_fb-img_1200x800.jpg", title:"flower"},
  {url:"https://empire-s3-production.bobvila.com/slides/14230/original/eastern_redbud.jpg?1599778725", title:"ga"}
  ]
  // This component makes uses of the Grid component from MUI (https://mui.com/material-ui/react-grid/).
  // The Grid component is super simple way to create a page layout. Simply make a <Grid container> tag
  // (optionally has spacing prop that specifies the distance between grid items). Then, enclose whatever
  // component you want in a <Grid item xs={}> tag where xs is a number between 1 and 12. Each row of the
  // grid is 12 units wide and the xs attribute specifies how many units the grid item is. So if you want
  // two grid items of the same size on the same row, define two grid items with xs={6}. The Grid container
  // will automatically lay out all the grid items into rows based on their xs values.
  const containerStyles={
    width: '1000px',
    height: '280px',
    margin: '0 auto',
  };

  const imageStyles = {
    width:"100%",
    height:"100%",
    objectFit:"cover",
  }

  return (
    <Container>

      <div>
        <h1>Hello slider</h1>
        <div style={containerStyles}>
        <ImageSliders slides={slides} parentWidth={500}/>
        </div>
      </div>


      {selectedSongId && <SongCard songId={selectedSongId} handleClose={() => setSelectedSongId(null)} />}
      <h2>Search Movie</h2>
      <Grid container spacing={6}>
        <Grid item xs={4}>
          <TextField label='Year' value={year} onChange={(e) => setYear(e.target.value === '' ? null : e.target.value)} style={{ width: "100%" }}/>
        </Grid>

        <Grid item xs={4}>
          <TextField label='Country' value={country} onChange={(e) => setCountry(e.target.value)} style={{ width: "100%" }}/>
        </Grid>

        {/* <Grid item xs={4}>
          <TextField label='Language' value={language} onChange={(e) => setLanguage(e.target.value)} style={{ width: "100%" }}/>
        </Grid> */}
        {/* <Grid item xs={4}>
          <TextField label='Language' value={language} onChange={(e) => setLanguage(e.target.value)} style={{ width: "100%" }}/>
        </Grid> */}
        {/* <Grid item xs={12}>
          <p>Duration</p>
          <Slider
            value={duration}
            min={60}
            max={660}
            step={10}
            onChange={(e, newValue) => setDuration(newValue)}
            valueLabelDisplay='auto'
            valueLabelFormat={value => <div>{formatDuration(value)}</div>}
          />
        </Grid> */}
      </Grid>
      <Button onClick={() => search()} style={{ left: '50%', transform: 'translateX(-50%)' }}>
        Search
      </Button>
      <h2>Results</h2>
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



  );
}