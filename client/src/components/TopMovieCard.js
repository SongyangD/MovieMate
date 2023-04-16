import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Link from '@mui/material/Link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FiberManualRecordOutlinedIcon from '@mui/icons-material/FiberManualRecordOutlined';
const config = require('../config.json');

export default function TopTabs(props) {
  const {tabList, fetchUrl, defaultTab,tabType} = props;
  
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [results, setResults] = useState([]);
  const [dropdownAnchorEl, setDropdownAnchorEl] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageResults, setCurrentPageResults] = useState([]);
  const [numPages, setNumPages] = useState(0);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/${fetchUrl}/${activeTab}`)
      .then(res => res.json())
      .then(resJson => {
        setResults(resJson);
        setCurrentPage(1);
      });
  }, [activeTab]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * 10;
    setCurrentPageResults(results.slice(startIndex, startIndex + 10));
  }, [currentPage, results]);

  useEffect(() => {
    setNumPages(Math.ceil(results.length / 10));
  }, [results]);

  const displayedTabs = tabList.slice(0, 10);
  const remainingTabs = tabList.filter(tab => !displayedTabs.includes(tab));

  const handleDropdownOpen = event => {
    setDropdownAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setDropdownAnchorEl(null);
  };

  const handleDropdownItemClick = tab => {
    setActiveTab(tab);
    handleDropdownClose();
  };

  return (
    <Box sx={{ borderRadius: "0px 0px 25px 25px" }}>
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px', padding: '10px' }}>
        {tabList.slice(0, 10).map(tab => (
          <Button
            key={tab}
            variant={activeTab === tab ? 'contained' : 'outlined'}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </Button>
        ))}
        {remainingTabs.length > 0 && (
          <>
            <IconButton
              aria-label={`more ${tabType}s`}
              aria-controls={`${tabType}-dropdown`}
              aria-haspopup="true"
              onClick={handleDropdownOpen}
            >
              ...
            </IconButton>
            <Menu
              id={`${tabType}-dropdown`}
              anchorEl={dropdownAnchorEl}
              open={Boolean(dropdownAnchorEl)}
              onClose={handleDropdownClose}
            >
              {remainingTabs.map(tab => (
                <MenuItem key={tab} onClick={() => handleDropdownItemClick(tab)}>
                  {tab}
                </MenuItem>
              ))}
            </Menu>
          </>
        )}
      </Box>
      <Box sx={{ margin: '10px' }}>
        {results.length > 0 ? (
          <>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {currentPageResults.map(movie => (
                <Box key={movie.id} sx={{ width: 'calc(20% - 10px)', minWidth: '150px' }}>
                  <a href="https://example.com">
                    <img src={movie.poster_url} alt={movie.title} style={{ width: '100%', height: 'auto' }} />
                  </a>
                  <Link href="https://example.com" underline="none">
                    <Typography variant="body2" sx={{ marginTop: '5px', textAlign: 'center', fontSize: '14px' }}>
                      {movie.title}
                    </Typography>
                  </Link>
                </Box>
              ))}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
              <IconButton
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                sx={{ color: '#3f51b5' }}
              >
                <ArrowBackIcon />
              </IconButton>
              {Array.from({ length: numPages }, (_, i) => (
                <IconButton
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  variant={currentPage === i + 1 ? 'contained' : 'outlined'}
                  sx={{ padding: 0 }}
                >
                  <FiberManualRecordOutlinedIcon style={{ color: '#3f51b5' }} />
                </IconButton>
              ))}
              <IconButton
                disabled={currentPage === numPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                sx={{ color: '#3f51b5' }}
              >
                <ArrowForwardIcon />
              </IconButton>
            </Box>
          </>
        ) : (
          <div className="noResults">No results for {activeTab}</div>
        )}
      </Box>
    </Box>
  );
}
