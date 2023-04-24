import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TablePagination, TableHead, TableRow, Tooltip, Avatar, Rating } from '@mui/material';

const config = require('../config.json');

function ActressesTable(props) {
    const { fetchUrl, defaultPageSize, rowsPerPageOptions } = props;
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
                {/* <TableCell align="left">Oscar Movie Participation</TableCell>
                <TableCell align="left">Total Movies Participation</TableCell> */}
                <TableCell align="left">Maximum Age at Oscar Nomination</TableCell>
                <TableCell align="left">Maximum Age for Acting in Movies</TableCell>
                <TableCell align="left">Average Age for Acting in Movies</TableCell>
                <TableCell align="left">Average Ratings of Oscar Movies</TableCell>
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
                  {/* <TableCell align="center">{actress.oscar_freq}</TableCell>
                  <TableCell align="center">{actress.total_movies}</TableCell> */}
                  <TableCell align="center">{actress.max_oscar_age}</TableCell>
                  <TableCell align="center">{actress.max_age}</TableCell>
                  <TableCell align="center">{actress.average_age}</TableCell>
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