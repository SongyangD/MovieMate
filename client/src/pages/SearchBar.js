import React, { useState, useEffect } from 'react';

const SearchBar = () => {

  const [allPeople, setAllPeople] = useState([]);
  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/allPeople`)
      .then(res => res.json())
      .then(resJson => setAllPeople(resJson));
  }, []);

  const [searchValue, setSearchValue] = useState('');

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };
const performSearch = () => {
  const results = allPeople.filter(actor =>
    actor.name.toLowerCase().includes(searchValue.toLowerCase())
  );
  setSearchResults(results);
};

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log(`Search query: ${searchValue}`);
  };

  return (
    <div>
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          value={searchValue}
          onChange={handleInputChange}
          placeholder="Search..."
        />
        <button type="submit">Search</button>
      </form>
      <div>
        {searchResults.map((actor, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <img src={actor.photo_url} alt={actor.name} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
            <p>{actor.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
  
};

export default SearchBar;
