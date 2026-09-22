import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function LineChart({ chartData }) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Custom Chart Title',
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          borderDash: [5, 5],
        },
        beginAtZero: true,
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 5,
        hoverRadius: 8,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgb(75, 192, 192)',
      },
    },
    hover: {
      mode: 'nearest',
      intersect: true,
    },
    tooltips: {
      mode: 'index',
      intersect: false,
    },
  };

  return <Line options={options} data={chartData} />;
}

export default LineChart;