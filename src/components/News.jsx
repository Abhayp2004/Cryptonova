import React from 'react'
import { Link } from 'react-router-dom'
import { useGetCryptoNewsQuery } from '../services/cryptoNewsApi';
import { Select, Typography, Row, Col, Avatar, Card } from 'antd';
import moment from 'moment';

const { Text, Title } = Typography;
const { Option } = Select;

function News({ simplified }) {
  const { data: cryptoNews, error, isLoading } = useGetCryptoNewsQuery();
  console.log('cryptoNews:', cryptoNews, 'error:', error, 'isLoading:', isLoading);

  if (isLoading) {
    return (
      <div className="loading-container animate-fade-in-up">
        <div className="loading-spinner"></div>
        <Title level={3} style={{ marginLeft: '1rem', color: 'var(--text-secondary)' }}>
          Loading latest news...
        </Title>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading-container animate-fade-in-up">
        <Title level={3} style={{ color: 'var(--danger)' }}>
          Error fetching news: {error.error}
        </Title>
      </div>
    );
  }

  const newsToShow = simplified ? 6 : 12;

  return (
    <div className="animate-fade-in-up">
      {!simplified && (
        <div className="home-heading-container animate-fade-in-up">
          <Title level={2} className='home-title gradient-text'>
            📰 Latest Cryptocurrency News
          </Title>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Stay updated with the latest developments in the crypto world
          </p>
        </div>
      )}

      <div className="animate-fade-in-up animate-delay-1">
        {Array.isArray(cryptoNews?.data) && cryptoNews.data.slice(0, newsToShow).map((news, index) => (
          <div 
            key={index} 
            className="news-card animate-fade-in-up hover-lift glow-effect"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="news-image-container">
              <div style={{ flex: 1 }}>
                <Title level={4} className="news-title">
                  {news.title}
                </Title>
                <Text style={{ 
                  color: 'var(--text-secondary)',
                  lineHeight: '1.6',
                  fontSize: '1rem'
                }}>
                  {news.description}
                </Text>
                <div style={{ 
                  marginTop: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  color: 'var(--text-muted)',
                  fontSize: '0.9rem'
                }}>
                  <span>📅 {moment(news.publishedAt).format('MMM DD, YYYY')}</span>
                  {news.source && <span>📰 {news.source}</span>}
                </div>
              </div>
              {news.urlToImage && (
                <img 
                  src={news.urlToImage} 
                  alt={news.title}
                  className="img"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {!Array.isArray(cryptoNews?.data) && (
        <div className="loading-container animate-fade-in-up">
          <Title level={3} style={{ color: 'var(--warning)' }}>
            No news available at the moment. Please try again later.
          </Title>
        </div>
      )}
    </div>
  );
}

export default News;
