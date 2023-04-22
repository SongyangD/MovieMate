import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TablePagination, TableHead, TableRow ,Tooltip,Avatar,Rating } from '@mui/material';

const config = require('../config.json');

function ActressesTable(props) {
  const { fetchUrl,defaultPageSize,rowsPerPageOptions } = props;
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1); 
  const [pageSize, setPageSize] = useState(defaultPageSize ?? 10);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/${fetchUrl}?page=${page}&page_size=${pageSize}`)
      .then(res => res.json())
      .then(resJson => {
        setData(resJson);
      });
  }, [page, pageSize]);

  const handleChangePage = (e, newPage) => {
    if (newPage < page || data.length === pageSize) {
      setPage(newPage + 1);
    }
  }

  const handleChangePageSize = (e) => {
    const newPageSize = e.target.value;
    setPageSize(newPageSize);
    setPage(1);
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell align="left"><div style={{ display: 'flex', flexDirection: 'column' }}>
                <div>Max Age at Oscar Noms</div>
                <div>Max Age for Acting in Movies</div>
                <div>Average Age for Acting in Movies</div>
                
            </div></TableCell>
            <TableCell align="left">Average Oscar Movie Rating</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((actress) => (
            <TableRow key={actress.imdb_name_id}>
              <TableCell>
                <Tooltip title={
                  <React.Fragment>
                    <div>Oscar Movie Participation: {actress.oscar_freq}</div>
                    <div>Total Movies Participation: {actress.total_movies}</div>
                  </React.Fragment>
                }>
                  <Avatar alt={actress.name} src={actress.photo_url} sx={{ width: 66, height: 66 }} />
                </Tooltip>
              </TableCell>
              <TableCell>
                <Link to={`/people/${actress.imdb_name_id}`}>
                  {actress.name}
                </Link>
              </TableCell>
              <TableCell align="left" style={{ display: 'flex', flexDirection: 'column' }}>
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <div style={{ backgroundColor: '#9fa8da', height: 10, flexGrow: 1, marginRight: 5 }}>
      <div style={{ backgroundColor: '#5c6bc0', height: 10, width: `${(actress.max_oscar_age / 100) * 100}%` }}></div>
    </div>
    <span style={{ minWidth: 40 }}>{actress.max_oscar_age}</span>
  </div>
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <div style={{ backgroundColor: '#9fa8da', height: 10, flexGrow: 1, marginRight: 5 }}>
      <div style={{ backgroundColor: '#3f51b5', height: 10, width: `${(actress.max_age / 100) * 100}%` }}></div>
    </div>
    <span style={{ minWidth: 40 }}>{actress.max_age}</span>
  </div>
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <div style={{ backgroundColor: '#9fa8da', height: 10, flexGrow: 1, marginRight: 5 }}>
      <div style={{ backgroundColor: '#283593', height: 10, width: `${(actress.average_age / 100) * 100}%` }}></div>
    </div>
    <span style={{ minWidth: 40 }}>{actress.average_age}</span>
  </div>
</TableCell>
<TableCell align="left">
                <div style={{ display: "flex", alignItems: "center" }}>
                <Rating value={actress.avg_rating / 2 + 0} precision={0.25} max={5} readOnly />
                <span style={{ marginLeft: "5px" }}>{actress.avg_rating.toFixed(1)}</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions ?? [5, 10, 25]}
          count={-1}
          rowsPerPage={pageSize}
          page={page - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangePageSize}
        />
      </Table>
    </TableContainer>
  );  
}

export default ActressesTable;
