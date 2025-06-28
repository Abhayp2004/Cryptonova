import React, { useState } from 'react'
import HTMLReactParser from 'html-react-parser';
import { useParams } from 'react-router-dom';
import millify from 'millify';
import { Col, Row, Typography, Select, Card } from 'antd'
import { MoneyCollectOutlined, DollarCircleOutlined, FundOutlined, ExclamationCircleOutlined, StopOutlined, TrophyOutlined, ThunderboltOutlined, NumberOutlined, CheckOutlined } from '@ant-design/icons';
import { useGetCryptoDetailsQuery, useGetCryptoHistoryQuery } from '../services/cryptoApi';
import LineChart from './lineChart';
const { Title, Text } = Typography;
const { Option } = Select;

function CryptoDetails() {
  const [timePeriod, setTimePeriod] = useState('7d');
  const { coinId } = useParams()
  const { data, isFetching } = useGetCryptoDetailsQuery(coinId);
  const { data: coinHistory } = useGetCryptoHistoryQuery({ coinId, timePeriod });

  const cryptoDetails = data?.data?.coin;

  if (isFetching) {
    return (
      <div className="loading-container animate-fade-in-up">
        <div className="loading-spinner"></div>
        <Title level={3} style={{ marginLeft: '1rem', color: 'var(--text-secondary)' }}>
          Loading cryptocurrency details...
        </Title>
      </div>
    );
  }

  if (!cryptoDetails) {
    return (
      <div className="loading-container animate-fade-in-up">
        <Title level={3} style={{ color: 'var(--danger)' }}>
          Cryptocurrency details not found.
        </Title>
      </div>
    );
  }

  const time = ['3h', '24h', '7d', '30d', '1y', '3m', '3y', '5y'];

  const stats = [
    { title: 'Price to USD', value: `$ ${cryptoDetails?.price && millify(cryptoDetails?.price)}`, icon: <DollarCircleOutlined /> },
    { title: 'Rank', value: cryptoDetails?.rank, icon: <NumberOutlined /> },
    { title: '24h Volume', value: `$ ${cryptoDetails?.volume && millify(cryptoDetails?.volume)}`, icon: <ThunderboltOutlined /> },
    { title: 'Market Cap', value: `$ ${cryptoDetails?.marketCap && millify(cryptoDetails?.marketCap)}`, icon: <DollarCircleOutlined /> },
    { title: 'All-time-high(daily avg.)', value: `$ ${cryptoDetails?.allTimeHigh?.price && millify(cryptoDetails?.allTimeHigh?.price)}`, icon: <TrophyOutlined /> },
  ];

  const genericStats = [
    { title: 'Number Of Markets', value: cryptoDetails?.numberOfMarkets, icon: <FundOutlined /> },
    { title: 'Number Of Exchanges', value: cryptoDetails?.numberOfExchanges, icon: <MoneyCollectOutlined /> },
    { title: 'Approved Supply', value: cryptoDetails?.supply?.confirmed ? <CheckOutlined /> : <StopOutlined />, icon: <ExclamationCircleOutlined /> },
    { title: 'Total Supply', value: `$ ${cryptoDetails?.supply?.total && millify(cryptoDetails?.supply?.total)}`, icon: <ExclamationCircleOutlined /> },
    { title: 'Circulating Supply', value: `$ ${cryptoDetails?.supply?.circulating && millify(cryptoDetails?.supply?.circulating)}`, icon: <ExclamationCircleOutlined /> },
  ];

  return (
    <div className="animate-fade-in-up">
      <Col className='coin-detail-container'>
        <Col className='coin-heading-container animate-fade-in-up'>
          <Title level={2} className='coin-name gradient-text'>
            {cryptoDetails?.name} ({cryptoDetails?.symbol}) 💎
          </Title>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', textAlign: 'center' }}>
            {cryptoDetails?.name} live price in US Dollars. View value statistics, market cap and supply.
          </p>
        </Col>

        <div className="animate-fade-in-up animate-delay-1">
          <Select
            defaultValue="7d"
            className="select-time-period"
            placeholder="Select time period"
            onChange={(value) => setTimePeriod(value)}
          >
            {time.map((date) => (
              <Option key={date}>{date}</Option>
            ))}
          </Select>
        </div>

        <div className="animate-fade-in-up animate-delay-2">
          <LineChart coinHistory={coinHistory} currentPrice={cryptoDetails.price} timePeriod={timePeriod} coinName={cryptoDetails.name} />
        </div>

        <Col className="stats-container animate-fade-in-up animate-delay-3">
          <Col className="coin-value-statistics">
            <Col className="coin-value-statistics-heading">
              <Title level={3} className="coin-details-heading gradient-text">
                📊 {cryptoDetails?.name} Value Statistics
              </Title>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                An overview showing details of {cryptoDetails?.name}
              </p>
            </Col>
            {stats.map(({ icon, title, value }, index) => (
              <Col className="coin-stats hover-lift" key={title} style={{ animationDelay: `${index * 0.1}s` }}>
                <Col className="coin-stats-name">
                  <Text style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>{icon}</Text>
                  <Text style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{title}</Text>
                </Col>
                <Text className="stats" style={{ color: 'var(--success)', fontWeight: '700' }}>{value}</Text>
              </Col>
            ))}
          </Col>
          <Col className="other-stats-info">
            <Col className="coin-value-statistics-heading">
              <Title level={3} className="coin-details-heading gradient-text">
                🔍 Other Statistics
              </Title>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                An overview showing other details of {cryptoDetails?.name}
              </p>
            </Col>
            {genericStats.map(({ icon, title, value }, index) => (
              <Col className="coin-stats hover-lift" key={title} style={{ animationDelay: `${index * 0.1}s` }}>
                <Col className="coin-stats-name">
                  <Text style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>{icon}</Text>
                  <Text style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{title}</Text>
                </Col>
                <Text className="stats" style={{ color: 'var(--text-primary)', fontWeight: '700' }}>{value}</Text>
              </Col>
            ))}
          </Col>
        </Col>

        <Col className="coin-desc-link animate-fade-in-up animate-delay-4">
          <Row className="coin-desc">
            <Title level={3} className="coin-details-heading gradient-text">
              🤔 What is {cryptoDetails?.name}?
            </Title>
            <div style={{ 
              color: 'var(--text-secondary)', 
              lineHeight: '1.8', 
              fontSize: '1rem',
              marginTop: '1rem'
            }}>
              {HTMLReactParser(cryptoDetails?.description || "")}
            </div>
          </Row>
          <Col className="coin-links">
            <Title level={3} className="coin-details-heading gradient-text">
              🔗 {cryptoDetails.name} Links
            </Title>
            {cryptoDetails.links.map((link, index) => (
              <Row className="coin-link hover-lift" key={link.name} style={{ animationDelay: `${index * 0.1}s` }}>
                <Title level={5} className="link-name" style={{ color: 'var(--text-primary)' }}>
                  {link.type}
                </Title>
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ 
                    color: 'var(--primary)', 
                    fontWeight: '600',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--secondary)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--primary)'}
                >
                  {link.name}
                </a>
              </Row>
            ))}
          </Col>
        </Col>
      </Col>
    </div>
  );
}

export default CryptoDetails;

