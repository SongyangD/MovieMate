import { useEffect, useState } from 'react';
import { Container, Divider, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';

import LazyTable from '../components/LazyTable';
import SongCard from '../components/SongCard';
const config = require('../config.json');

export default function Stats() {
  // We use the setState hook to persist information across renders (such as the result of our API calls)
  const [songOfTheDay, setSongOfTheDay] = useState({});
  // TODO (TASK 13): add a state variable to store the app author (default to '')
  const [selectedSongId, setSelectedSongId] = useState(null);

  // The useEffect hook by default runs the provided callback after every render
  // The second (optional) argument, [], is the dependency array which signals
  // to the hook to only run the provided callback if the value of the dependency array
  // changes from the previous render. In this case, an empty array means the callback
  // will only run on the very first render.
  useEffect(() => {
    // Fetch request to get the song of the day. Fetch runs asynchronously.
    // The .then() method is called when the fetch request is complete
    // and proceeds to convert the result to a JSON which is finally placed in state.
    fetch(`http://${config.server_host}:${config.server_port}/top_oscar_director`)
      .then(res => res.json())
      .then(resJson => setSongOfTheDay(resJson));


    // TODO (TASK 14): add a fetch call to get the app author (name not pennkey) and store it in the state variable

  }, []);

  // Here, we define the columns of the "Top Songs" table. The songColumns variable is an array (in order)
  // of objects with each object representing a column. Each object has a "field" property representing
  // what data field to display from the raw data, "headerName" property representing the column label,
  // and an optional renderCell property which given a row returns a custom JSX element to display in the cell.
  const songColumns = [
    {
      field: 'name',
      headerName: 'Name',
    //  renderCell: (row) => <Link onClick={() => setSelectedSongId(row.song_id)}>{row.title}</Link> // A Link component is used just for formatting purposes
    },
    {
      field: 'num_nominations',
      headerName: 'Nominations',
    //  renderCell: (row) => <NavLink to={`/albums/${row.album_id}`}>{row.album}</NavLink> // A NavLink component is used to create a link to the album page
    },
    {
      field: 'decade',
      headerName: 'Decade'
    },
  ];

  // TODO (TASK 15): define the columns for the top albums (schema is Album Title, Plays), where Album Title is a link to the album page
  // Hint: this should be very similar to songColumns defined above, but has 2 columns instead of 3
  const albumColumns = [
    {
      field: 'director',
      headerName: 'Director Name',
     // renderCell: (row) => <NavLink to={`/albums/${row.album_id}`}>{row.title}</NavLink>
      },
      {
      field: 'num_nominations',
      headerName: 'Counts'
      },
      {
      field: 'num_movies',
      headerName:'Movies'
      }
  ]

  const topOscar =[
    {field:'title',
    headerName: 'Title'},
    {field: 'country',
    headerName: 'Country'},
    {field: 'year', 
    headerName: 'Year'},
    {field: 'genre',
    headerName: 'Genre'}
  ]

  const oscarPpl=[
    {field:'name',
  headerName:'Name'},
    {field:'ceremony',
  headerName:'Ceremony'},
    {field:'movie_title',
  headerName:'Movie Title'}
  ]

  return (
    <Container>
      {/* SongCard is a custom component that we made. selectedSongId && <SongCard .../> makes use of short-circuit logic to only render the SongCard if a non-null song is selected */}
      {selectedSongId && <SongCard songId={selectedSongId} handleClose={() => setSelectedSongId(null)} />}
      <h2>Check out your song of the day:&nbsp;
        <Link onClick={() => setSelectedSongId(songOfTheDay.song_id)}>{songOfTheDay.title}</Link>
      </h2>
      <Divider />
      <h2>Each Decade</h2>
      <LazyTable route={`http://${config.server_host}:${config.server_port}/stats`} columns={songColumns} defaultPageSize={5} rowsPerPageOptions={[0, 10]}/>
      <Divider />
      {/* TODO (TASK 16): add a h2 heading, LazyTable, and divider for top albums. Set the LazyTable's props for defaultPageSize to 5 and rowsPerPageOptions to [5, 10] */}
      <h2>Top 5 Directors</h2>
      <LazyTable route={ `http://${config.server_host}:${config.server_port}/top_oscar_director`} columns={albumColumns} defaultPageSize={5} rowsPerPageOptions={[5, 10]} />
      
      {/* TODO (TASK 17): add a paragraph (<p>text</p>) that displays the value of your author state variable from TASK 13 */}
      <Divider />

      <h2>Top 5 Rated Oscar Movies</h2>
      <LazyTable route={ `http://${config.server_host}:${config.server_port}/top10_rated_oscar_movies`} columns={topOscar} defaultPageSize={5} rowsPerPageOptions={[5, 10]} />
      
      {/* TODO (TASK 17): add a paragraph (<p>text</p>) that displays the value of your author state variable from TASK 13 */}
      <Divider />
      <h2>Nominated Actors</h2>
      <LazyTable route={ `http://${config.server_host}:${config.server_port}/oscar`} columns={oscarPpl} defaultPageSize={5} rowsPerPageOptions={[5, 10]} />

    </Container>
  );
};