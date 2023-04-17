import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
const config = require('../config.json');

const MyChart = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Fetch data from API and set state
    const fetchData = async () => {
      try {
        const response = await fetch(`http://${config.server_host}:${config.server_port}/stats`);
        const data = await response.json();
        setChartData(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <BarChart
      width={600}
      height={300}
      data={chartData}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="decade" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="num_nominations" fill="#8884d8" />
    </BarChart>
  );
};

export default MyChart;
