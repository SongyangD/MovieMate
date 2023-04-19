import { useEffect, useState } from 'react';
import { Box, TextField, Checkbox, Container, MenuItem, Button, Slider, FormControlLabel, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import Pagination from '../components/Pagination';
// import { people } from '../../../server/routes';


const config = require('../config.json');
export default function PeoplePage() {
  const [allPeople, setAllPeople] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [name, setName] = useState('');
  const peoplePerPage = 30;
  const totalPeople = allPeople.length;
  const totalPages = Math.ceil(totalPeople / peoplePerPage);              
  const indexOfLastPeople = currentPage * peoplePerPage;
  const indexOfFirstPeople = indexOfLastPeople - peoplePerPage;
  const currentPeople = allPeople && allPeople.length > 0 ? allPeople.slice(indexOfFirstPeople, indexOfLastPeople) : [];

  const flexFormat = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' };

 useEffect(() => {
  fetch(`http://${config.server_host}:${config.server_port}/people`)
          .then(res => res.json())
          .then(resJson => setAllPeople(resJson));
      }, []);
    
  const search = () => {
    if (name.trim() === '') {
      alert('Please enter a name to search');
      return;
    }
        fetch(`http://${config.server_host}:${config.server_port}/search_people?name=${name}`)
          .then(res => res.json())
          .then(resJson => setAllPeople(resJson));
      }
      const handleChangePage = (page) => {
        setCurrentPage(page);}

  const imageStyle = {
    maxWidth: "200px", // Set the maximum width
    maxHeight: "200px", // Set the maximum height
    objectFit: "contain", // Ensures the image maintains aspect ratio
  };
  // { width: '120%', height: '400px' } 
  return (
    // TODO (TASK 22): replace the empty object {} in the Container attribute sx with flexFormat. Observe the change to the Albums page. Then uncomment the code to display the cover image and once again observe the change, i.e. what happens to the layout now that each album card has a fixed width?
// consile.log
    <Container style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: '50px', display: "flex", flexDirection: "column" }}>
       <Box
        component="form"
        sx={{
          '& > :not(style)': { m: 1, minwidth: '25ch' },
          display: 'flex',
          flexWrap: 'nowrap',
          justifyContent: 'flex-end',
          alignItems: 'center',
          width:'100%'
        }}
        noValidate
        autoComplete="off"
        >
           <TextField
          
          label="Search by name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          variant="outlined"
          sx={{ marginRight: 1 }}
        />
        <Button onClick={() => search()} >
          Search
        </Button>
      </Box>
      {currentPeople && currentPeople.length > 0 ? (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '30px' }}>
          {currentPeople.map(people => (
            <Box key={people.imdb_name_id} sx={{ width: 'calc(20% - 10px)', minWidth: '150px' }}>
              <NavLink to={`/people/${people.imdb_name_id}`}>
                <img src={people.photo_url} alt={people.name} style={{ height: '300px', width: '210px' }} />
              </NavLink>
              <Typography variant="h2" sx={{ marginTop: '5px', textAlign: 'center', fontSize: '12px' }}>
                {people.name}
              </Typography>
            </Box>
          ))}
        </Box>
      ) : (
        <Box sx={{ fontSize: 24 }}>No people found</Box>
      )}
      
      <div className="people-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '40px 0' }}>
<Pagination
      count={totalPages}
      currentPage={currentPage}
      onChangePage={handleChangePage}
      sx={{ '& .MuiPaginationItem-root': { fontSize: '1.8rem', padding: '8px' } }}
       />
     </div>
    </Container>
   
  );
}

