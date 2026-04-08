import React, { useState, useEffect } from 'react';
import millify from 'millify';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Input, Typography } from 'antd';
import { useGetCryptosQuery } from '../services/cryptoApi';

const { Title } = Typography;

function Cryptocurrencies({ simplified }) {
  const count = simplified ? 10 : 100;
  const { data: cryptoList, isFetching, error } = useGetCryptosQuery(count);
  const [cryptos, setCryptos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const hasRapidApiKey = Boolean(
    import.meta.env.VITE_RAPIDAPI_COINRANKING_KEY ||
    import.meta.env.VITE_RAPIDAPI_KEY_COINRANKING ||
    import.meta.env.VITE_RAPIDAPI_KEY
  );

  // Update state when API data is available
  useEffect(() => {
    if (cryptoList?.data?.coins) {
      const filteredData = cryptoList.data.coins.filter((coin) =>
        coin.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
      console.log("Cryptocurrencies loaded:", filteredData.length);
      setCryptos(filteredData);
    }
  }, [cryptoList, searchTerm]);
  

  if (error) {
    console.error("Error fetching cryptocurrencies:", error);
    return (
      <div className="loading-container animate-fade-in-up">
        <Title level={3} style={{ color: 'var(--danger)' }}>
          Error loading cryptocurrencies. Please try again later.
        </Title>
      </div>
    );
  }

  if (isFetching) {
    return (
      <div className="loading-container animate-fade-in-up">
        <div className="loading-spinner"></div>
        <Title level={3} style={{ marginLeft: '1rem', color: 'var(--text-secondary)' }}>
          Loading cryptocurrencies...
        </Title>
      </div>
    );
  }

  if (!cryptos.length) {
    return (
      <div className="loading-container animate-fade-in-up">
        <Title level={3} style={{ color: 'var(--warning)' }}>
          {hasRapidApiKey
            ? 'No cryptocurrencies returned from RapidAPI yet. Please try again shortly.'
            : 'RapidAPI key is missing. Add `VITE_RAPIDAPI_KEY` in `.env` and restart the app.'}
        </Title>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      {!simplified && (
        <div className="search-crypto animate-fade-in-up">
          <Input 
            placeholder='🔍 Search Cryptocurrency' 
            onChange={(e) => setSearchTerm(e.target.value)}
            size="large"
            prefix={<span style={{ color: 'var(--primary)' }}>🔍</span>}
          />
        </div>
      )}
   
      <div className='crypto-card-container'>
        {cryptos.map((currency, index) => (
          <div 
            className='crypto-card animate-fade-in-up' 
            key={currency.uuid}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <Link to={`/crypto/${currency.uuid}`}>
              <Card
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>#{currency.rank}</span>
                    <span style={{ fontWeight: 600 }}>{currency.name}</span>
                  </div>
                }
                extra={
                  <img 
                    className='crypto-image' 
                    src={currency.iconUrl} 
                    alt={currency.name} 
                  />
                }
                hoverable
                className="hover-lift glow-effect"
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <p style={{ 
                    color: 'var(--text-primary)', 
                    fontWeight: 600,
                    fontSize: '1.1rem'
                  }}>
                    💰 Price: <span style={{ color: 'var(--success)' }}>${millify(currency.price)}</span>
                  </p>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    📊 Market Cap: {millify(currency.marketCap)}
                  </p>
                  <p style={{ 
                    color: currency.change >= 0 ? 'var(--success)' : 'var(--danger)',
                    fontWeight: 600
                  }}>
                    📈 Daily Change: {currency.change >= 0 ? '+' : ''}{millify(currency.change)}%
                  </p>
                </div>
              </Card>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Cryptocurrencies;
