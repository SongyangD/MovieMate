import { useEffect, useState } from 'react';
import { Box, Container } from '@mui/material';
import { NavLink } from 'react-router-dom';
import SearchBar from './SearchBar';

export default function PeoplePage() {
  const [allPeople, setAllPeople] = useState([]);
 

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/allPeople`)
      .then(res => res.json())
      .then(resJson => setAllPeople(resJson));
  }, []);

  // flexFormat provides the formatting options for a "flexbox" layout that enables the album cards to
  // be displayed side-by-side and wrap to the next line when the screen is too narrow. Flexboxes are
  // incredibly powerful. You can learn more on MDN web docs linked below (or many other online resources)
  // https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox
  const flexFormat = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' };

  return (
    // TODO (TASK 22): replace the empty object {} in the Container attribute sx with flexFormat. Observe the change to the Albums page. Then uncomment the code to display the cover image and once again observe the change, i.e. what happens to the layout now that each album card has a fixed width?
    <React.Fragment>
      <div>
        <SearchBar/>
      </div>
    <Container style={flexFormat}>
      {allPeople.map((people) =>
        <Box
          key={people.imdb_name_id}
          p={3}
          m={2}
          style={{ background: 'white', borderRadius: '16px', border: '2px solid #000' }}
        >
          {
          <img
            src={people.photo_url}
            alt={`${people.name}`}
          />
          }
          <h4><NavLink to={`/allPeople/${people.imdb_name_id}`}>{people.name}</NavLink></h4>
        </Box>
      )}
    </Container>
    </React.Fragment>
  );
}