import React from 'react';
import millify from 'millify';
import {Link} from 'react-router-dom';
import { Typography, Row, Col, Statistic } from 'antd';
import { useGetCryptosQuery } from '../services/cryptoApi';
import Cryptocurrencies from './Cryptocurrencies';
import News from './News';

const { Title } = Typography;

function Homepage() {
  const { data, isFetching, error } = useGetCryptosQuery(10);
  const globalStats = data?.data?.stats;
  const hasRapidApiKey = Boolean(
    import.meta.env.VITE_RAPIDAPI_COINRANKING_KEY ||
    import.meta.env.VITE_RAPIDAPI_KEY_COINRANKING ||
    import.meta.env.VITE_RAPIDAPI_KEY
  );

  console.log("Homepage - API response:", { data, isFetching, error, globalStats });

  if (isFetching) {
    return (
      <div className="loading-container animate-fade-in-up">
        <div className="loading-spinner"></div>
        <Title level={3} style={{ marginLeft: '1rem', color: 'var(--text-secondary)' }}>
          Loading global stats...
        </Title>
      </div>
    );
  }

  if (error) {
    console.error("Error in Homepage:", error);
    return (
      <div className="loading-container animate-fade-in-up">
        <Title level={3} style={{ color: 'var(--danger)' }}>
          Error loading data from RapidAPI. Please verify your API key and try again.
        </Title>
      </div>
    );
  }

  if (!globalStats) {
    return (
      <div className="loading-container animate-fade-in-up">
        <Title level={3} style={{ color: 'var(--warning)' }}>
          {hasRapidApiKey
            ? 'No market data available right now. Please refresh in a moment.'
            : 'RapidAPI key is missing. Add it in `.env` (e.g. `VITE_RAPIDAPI_KEY=...`) and restart the app.'}
        </Title>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <div className="home-heading-container animate-fade-in-up">
        <Title level={2} className='home-title gradient-text'>
          🌟 Crypto Global Stats
        </Title>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Real-time cryptocurrency market overview
        </p>
      </div>
      
      <Row gutter={[24, 24]} className="animate-fade-in-up animate-delay-1">
        <Col xs={24} sm={12} lg={8}>
          <Statistic 
            title="Total Cryptocurrencies" 
            value={millify(globalStats.total)} 
            className="hover-lift glow-effect"
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Statistic 
            title="Total Exchanges" 
            value={millify(globalStats.totalExchanges)} 
            className="hover-lift glow-effect"
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Statistic 
            title="Total Market Cap" 
            value={millify(globalStats.totalMarketCap)} 
            className="hover-lift glow-effect"
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Statistic 
            title="Total 24h Volume" 
            value={millify(globalStats.total24hVolume)} 
            className="hover-lift glow-effect"
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Statistic 
            title="Total Markets" 
            value={millify(globalStats.totalMarkets)} 
            className="hover-lift glow-effect"
          />
        </Col>
      </Row>
      
      <div className='home-heading-container animate-fade-in-up animate-delay-2'>
        <Title level={2} className='home-title gradient-text'>
          🚀 Top 10 Cryptocurrencies in the World
        </Title>
        <Title level={3} className='show-more'>
          <Link to='/cryptocurrencies'>Show more →</Link>
        </Title>
      </div>
      <div className="animate-fade-in-up animate-delay-3">
        <Cryptocurrencies simplified={true} />
      </div>

      <div className='home-heading-container animate-fade-in-up animate-delay-4'>
        <Title level={2} className='home-title gradient-text'>
          📰 Latest Crypto News
        </Title>
        <Title level={3} className='show-more'>
          <Link to='/news'>Show more →</Link>
        </Title>
      </div>
      <div className="animate-fade-in-up animate-delay-5">
        <News simplified/>
      </div>
    </div>
  );
}

export default Homepage;
