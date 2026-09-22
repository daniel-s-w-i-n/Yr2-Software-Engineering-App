import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function BarChart({ chartData }) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Custom Bar Chart',
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
          display: true,
        },
      },
    },
    animation: {
      tension: {
        duration: 1000,
        easing: 'linear',
        from: 1,
        to: 0,
        loop: true,
      },
    },
  };

  chartData.datasets.forEach(dataset => {
    dataset.backgroundColor = 'rgba(255, 99, 132, 0.2)';
    dataset.borderColor = 'rgba(255, 99, 132, 1)';
    dataset.borderWidth = 1;
  });

  return <Bar data={chartData} options={options} />;
}

export default BarChart;
