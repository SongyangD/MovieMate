import { useEffect, useState } from 'react';
import { Box, Button, ButtonGroup, Link, Modal } from '@mui/material';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { NavLink } from 'react-router-dom';

import { formatDuration } from '../helpers/formatter';
const config = require('../config.json');

export default function PeopleCard(props) {
  const {name,date_of_birth,date_of_death,place_of_birth,bio,photo_url,avgVote} = props;

  return (
    <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '16px', border: '30px solid #ccc', 
    borderRadius: '8px', padding: '8px' }}>
    <img
      src={photo_url}
      alt={`${name}}`}
      style={{ width: '300px', height: 'auto', marginRight: '16px', borderRadius: '4px' }}
    />
    <div>
      <h2>{name}</h2>
      <p>Average Rating: {avgVote}</p>
      <p>Date of Birth: {date_of_birth}</p>
      <p>Place of Birth: {place_of_birth}</p>
      <p>Date of Death:{date_of_death}</p>
   
      <div
        style={{
          whiteSpace: 'normal',
          overflow: 'auto',
          maxHeight: '200px'
        }}
      > Bio: {bio}
      </div>
    </div>
   
  </div>
);
}