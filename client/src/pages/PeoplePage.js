import { useEffect, useState } from 'react';
import { Box, Container } from '@mui/material';
import { NavLink } from 'react-router-dom';
import SearchBar from './SearchBar';
import Pagination from '../components/Pagination';
import Typography from '@mui/material/Typography';


const config = require('../config.json');
export default function PeoplePage() {
  const [allPeople, setAllPeople] = useState([]);
  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/people`)
      .then(res => res.json())
      .then(resJson => setAllPeople(resJson));
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
      const peoplePerPage = 30;
      const totalPeople = allPeople.length;
      const totalPages = Math.ceil(totalPeople / peoplePerPage);              
      const indexOfLastPeople = currentPage * peoplePerPage;
      const indexOfFirstPeople = indexOfLastPeople - peoplePerPage;
      const currentPeople = allPeople.slice(indexOfFirstPeople, indexOfLastPeople);
    
      const handleChangePage = (page) => {
        setCurrentPage(page);
       
      };


  // flexFormat provides the formatting options for a "flexbox" layout that enables the album cards to
  // be displayed side-by-side and wrap to the next line when the screen is too narrow. Flexboxes are
  // incredibly powerful. You can learn more on MDN web docs linked below (or many other online resources)
  // https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox
  const flexFormat = {display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: '50px'};
 
  
  return (
    // TODO (TASK 22): replace the empty object {} in the Container attribute sx with flexFormat. Observe the change to the Albums page. Then uncomment the code to display the cover image and once again observe the change, i.e. what happens to the layout now that each album card has a fixed width?

    <Container style={flexFormat}>
       <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      {currentPeople.map((people) =>
        <Box
          key={people.imdb_name_id}
          sx={{ width: 'calc(20% - 10px)', minWidth: '150px' }}
          // p={10}
          m={3}
          // style={{ background: 'white', borderRadius: '6px' }}
        >
          {
          <img
            style={{ width: '120%', height: '400px' }}
            src= {people.photo_url}
            alt={`${people.name}`}
          />
          }
          <h4><NavLink to={`/people/${people.imdb_name_id}`}>{people.name}</NavLink></h4>
          
        </Box>
      )}
      </Box>
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

