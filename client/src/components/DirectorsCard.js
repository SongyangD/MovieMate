import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow ,Tooltip,Avatar,Rating } from '@mui/material';
import { Star, StarBorder } from '@mui/icons-material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const config = require('../config.json');

function DirectorsTable(props) {
  const { fetchUrl } = props;
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/${fetchUrl}`)
      .then(res => res.json())
      .then(resJson => {
        setData(resJson);
      });
  }, []);

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell align="left">Direction Nominations</TableCell>
            <TableCell align="left">Direction Wins</TableCell>
            <TableCell align="left">Picture Nominations</TableCell>
            <TableCell align="left">Picture Wins</TableCell>
            <TableCell align="left">Average Rating</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((director) => (
            <TableRow key={director.imdb_name_id}>
              
              <TableCell>
                <Tooltip title={`Direction Wins: ${director.num_direction_wins}; Picture Wins: ${director.num_picture_wins}`}>
                    <Avatar alt={director.name} src={director.photo_url} sx={{ width: 66, height: 66 }} />
                </Tooltip>
                </TableCell>

              <TableCell>
                <Link to={`/people/${director.imdb_name_id}`}>
                  {director.name}
                </Link>
              </TableCell>
              <TableCell align="center">{director.num_direction_nominations}</TableCell>
              <TableCell align="left">
                {director.num_direction_wins > 0 ?
                    Array.from(Array(director.num_direction_wins), (_, index) => (
                    <EmojiEventsIcon key={index} fontSize="small" htmlColor="#FFD700" />
                    )) :
                    <StarBorder fontSize="small" htmlColor="#FFD700" />
                }
              </TableCell>
              <TableCell align="center">{director.num_picture_nominations}</TableCell>
              <TableCell align="left">
                {director.num_picture_wins > 0 ?
                    Array.from(Array(director.num_picture_wins), (_, index) => (
                    <EmojiEventsIcon key={index} fontSize="small" htmlColor="#FFD700" />
                    )) :
                    <StarBorder fontSize="small" htmlColor="#FFD700" />
                }
              </TableCell>
              <TableCell align="left">
              {/* <div>
                {Array.from(Array(Math.min(Math.round(director.avg_rating/2), 5)), (_, index) => (
                    <Star key={index} fontSize="small" htmlColor="#FFD700" />
                ))}
                {Array.from(Array(Math.min(Math.round(5 - director.avg_rating/2), 5)), (_, index) => (
                    <StarBorder key={index} fontSize="small" htmlColor="#FFD700" />
                ))}
                <span style={{ marginLeft: "5px" }}>{director.avg_rating.toFixed(1)}</span>
                </div> */}
                <div style={{ display: "flex", alignItems: "center" }}>
                <Rating value={director.avg_rating / 2 + 0} precision={0.25} max={5} readOnly />
                <span style={{ marginLeft: "5px" }}>{director.avg_rating.toFixed(1)}</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default DirectorsTable;
