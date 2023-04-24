import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Paper, Typography } from '@mui/material';

const oscarData = [
  { name: 'Nomination 1', nominations: 5, wins: 2 },
  { name: 'Nomination 2', nominations: 7, wins: 1 },
  { name: 'Nomination 3', nominations: 3, wins: 0 },
  // Add more data entries as needed
];

const OscarBarChart = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleMouseOver = (data, index) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom> Oscar Nominations and Wins </Typography>
      <BarChart width={600} height={300} data={oscarData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="nominations"
          fill="#8884d8"
          onMouseOver={handleMouseOver}
          onMouseLeave={handleMouseLeave}
          opacity={activeIndex !== null && activeIndex !== undefined ? (activeIndex === 0 ? 1 : 0.5) : 1}
        />
        <Bar
          dataKey="wins"
          fill="#82ca9d"
          onMouseOver={handleMouseOver}
          onMouseLeave={handleMouseLeave}
          opacity={activeIndex !== null && activeIndex !== undefined ? (activeIndex === 1 ? 1 : 0.5) : 1}
        />
      </BarChart>
    </Paper>
  );
}

export default OscarBarChart;
