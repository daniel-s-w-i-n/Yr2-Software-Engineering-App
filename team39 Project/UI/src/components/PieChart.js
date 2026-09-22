import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart({ chartData }) {
  const options = {
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 20,
          padding: 20,
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
      tooltip: {
        bodyFont: {
          size: 14,
        },
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleFont: {
          size: 16,
          weight: 'bold',
        },
        bodySpacing: 5,
        padding: 15,
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
    },
    borderWidth: 2,
    cutout: '50%',
    radius: '90%',
  };

  if (chartData.datasets && chartData.datasets.length) {
    chartData.datasets[0].backgroundColor = [
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
      '#4BC0C0',
      '#9966FF',
    ];
    chartData.datasets[0].hoverBackgroundColor = [
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
      '#4BC0C0',
      '#9966FF',
    ];
    chartData.datasets[0].borderColor = 'rgba(255, 255, 255, 0.6)';
    chartData.datasets[0].borderWidth = 2;
  }

  return <Pie data={chartData} options={options} />;
}

export default PieChart;
