import React from 'react';
import Pagination from '@mui/material/Pagination';

const Pages = ({ count, currentPage, onChangePage }) => {
  const handlePageChange = (event, value) => {
    onChangePage(value);
  };

  return (
    <div className="pagination-container">
      <Pagination
        count={count}
        page={currentPage}
        onChange={handlePageChange}
        showFirstButton
        showLastButton
      />
    </div>
  );
};

export default Pages;
