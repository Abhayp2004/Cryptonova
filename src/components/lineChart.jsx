import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Col, Row, Typography } from 'antd';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const { Title: AntTitle } = Typography;

function LineChart({ coinHistory, currentPrice, coinName }) {
  // Add null checks for coinHistory
  if (!coinHistory?.data?.history) {
    return <div>No chart data available</div>;
  }

  const coinPrice = [];
  const coinTimeStamp = [];

  for (let i = 0; i < coinHistory.data.history.length; i++) {
    coinPrice.push(coinHistory.data.history[i].price);
    coinTimeStamp.push(
      new Date(coinHistory.data.history[i].timestamp * 1000).toLocaleDateString()
    );
  }

  // Optional: Reverse if needed
  coinPrice.reverse();
  coinTimeStamp.reverse();

  const data = {
    labels: coinTimeStamp,
    datasets: [
      {
        label: 'Price in USD',
        data: coinPrice,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${coinName} Price Chart`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <Row className="chart-header">
        <AntTitle level={2} className="chart-title">
          {coinName} Price Chart
        </AntTitle>
        <Col className="price-container">
          <AntTitle level={5} className="price-change">
            {coinHistory?.data?.change}%
          </AntTitle>
          <AntTitle level={5} className="current-price">
            Current {coinName} Price: ${currentPrice}
          </AntTitle>
        </Col>
      </Row>
      <Line data={data} options={options} />
    </div>
  );
}

export default LineChart;
