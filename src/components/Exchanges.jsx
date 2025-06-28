import React from 'react';
import millify from 'millify';
import { Collapse, Row, Col, Typography, Avatar, Alert } from 'antd';
import HTMLReactParser from 'html-react-parser';

const { Text, Title } = Typography;
const { Panel } = Collapse;

// Mock exchanges data since the API endpoint might not be available
const mockExchanges = [
  {
    uuid: '1',
    rank: 1,
    name: 'Binance',
    iconUrl: 'https://cdn.coinranking.com/mDTKbqkqk/binance.svg',
    volume: 1234567890123,
    numberOfMarkets: 1500,
    marketShare: 25.5,
    description: 'Binance is one of the largest cryptocurrency exchanges globally, offering a wide range of trading pairs and services.'
  },
  {
    uuid: '2',
    rank: 2,
    name: 'Coinbase',
    iconUrl: 'https://cdn.coinranking.com/mDTKbqkqk/coinbase.svg',
    volume: 987654321098,
    numberOfMarkets: 800,
    marketShare: 18.2,
    description: 'Coinbase is a leading cryptocurrency exchange platform that provides a secure and user-friendly trading experience.'
  },
  {
    uuid: '3',
    rank: 3,
    name: 'Kraken',
    iconUrl: 'https://cdn.coinranking.com/mDTKbqkqk/kraken.svg',
    volume: 654321098765,
    numberOfMarkets: 600,
    marketShare: 12.8,
    description: 'Kraken is a well-established cryptocurrency exchange known for its security features and advanced trading options.'
  },
  {
    uuid: '4',
    rank: 4,
    name: 'KuCoin',
    iconUrl: 'https://cdn.coinranking.com/mDTKbqkqk/kucoin.svg',
    volume: 543210987654,
    numberOfMarkets: 1200,
    marketShare: 10.5,
    description: 'KuCoin is a global cryptocurrency exchange that offers a wide variety of trading pairs and innovative features.'
  },
  {
    uuid: '5',
    rank: 5,
    name: 'OKX',
    iconUrl: 'https://cdn.coinranking.com/mDTKbqkqk/okx.svg',
    volume: 432109876543,
    numberOfMarkets: 900,
    marketShare: 8.9,
    description: 'OKX is a comprehensive cryptocurrency exchange platform offering spot, futures, and options trading.'
  }
];

const Exchanges = () => {
  // Using mock data instead of API call
  const exchangesList = mockExchanges;

  return (
    <div className="animate-fade-in-up">
      <div className="home-heading-container animate-fade-in-up">
        <Title level={2} className='home-title gradient-text'>
          🏦 Top Cryptocurrency Exchanges
        </Title>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Discover the leading platforms for cryptocurrency trading
        </p>
      </div>

      <div className="animate-fade-in-up animate-delay-1">
        <Row style={{ 
          fontWeight: 'bold', 
          marginBottom: '2rem',
          padding: '1rem 1.5rem',
          background: 'var(--bg-glass)',
          backdropFilter: 'blur(15px)',
          borderRadius: '15px',
          border: '1px solid var(--border-light)'
        }}>
          <Col span={6} style={{ color: 'var(--text-primary)' }}>🏆 Exchanges</Col>
          <Col span={6} style={{ color: 'var(--text-primary)' }}>💰 24h Trade Volume</Col>
          <Col span={6} style={{ color: 'var(--text-primary)' }}>📊 Markets</Col>
          <Col span={6} style={{ color: 'var(--text-primary)' }}>📈 Market Share</Col>
        </Row>

        <Collapse accordion>
          {exchangesList.map((exchange, index) => (
            <Panel
              key={exchange.uuid}
              showArrow={false}
              header={(
                <Row style={{ alignItems: 'center' }}>
                  <Col span={6}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Text style={{ 
                        color: 'var(--text-secondary)', 
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                      }}>
                        #{exchange.rank}
                      </Text>
                      <Avatar
                        className="exchange-image"
                        src={exchange.iconUrl}
                        alt={exchange.name}
                        size={40}
                      />
                      <Text style={{ 
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                      }}>
                        {exchange.name}
                      </Text>
                    </div>
                  </Col>
                  <Col span={6}>
                    <Text style={{ 
                      color: 'var(--success)',
                      fontWeight: '600',
                      fontSize: '1rem'
                    }}>
                      ${millify(exchange.volume)}
                    </Text>
                  </Col>
                  <Col span={6}>
                    <Text style={{ 
                      color: 'var(--text-primary)',
                      fontWeight: '600',
                      fontSize: '1rem'
                    }}>
                      {millify(exchange.numberOfMarkets)}
                    </Text>
                  </Col>
                  <Col span={6}>
                    <Text style={{ 
                      color: 'var(--primary)',
                      fontWeight: '600',
                      fontSize: '1rem'
                    }}>
                      {exchange.marketShare}%
                    </Text>
                  </Col>
                </Row>
              )}
              style={{ 
                animationDelay: `${index * 0.1}s`,
                animation: 'fadeInUp 0.6s ease-out'
              }}
            >
              <div style={{ 
                color: 'var(--text-secondary)',
                lineHeight: '1.6',
                fontSize: '1rem'
              }}>
                {exchange.description ? HTMLReactParser(exchange.description) : 'No description available.'}
              </div>
            </Panel>
          ))}
        </Collapse>
      </div>
    </div>
  );
};

export default Exchanges;
