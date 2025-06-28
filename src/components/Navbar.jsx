import React from 'react';
import { Button, Menu, Typography, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import { HomeOutlined, MoneyCollectOutlined, BulbOutlined, FundOutlined } from '@ant-design/icons';
import icon from '../images/cryptocurrency.png';

function Navbar() {
  const menuItems = [
    {
      key: 'home',
      icon: <HomeOutlined style={{ fontSize: '1.2rem' }} />,
      label: <Link to="/">🏠 Home</Link>,
    },
    {
      key: 'cryptocurrencies',
      icon: <FundOutlined style={{ fontSize: '1.2rem' }} />,
      label: <Link to="/cryptocurrencies">💎 Cryptocurrencies</Link>,
    },
    {
      key: 'exchanges',
      icon: <MoneyCollectOutlined style={{ fontSize: '1.2rem' }} />,
      label: <Link to="/exchanges">🏦 Exchanges</Link>,
    },
    {
      key: 'news',
      icon: <BulbOutlined style={{ fontSize: '1.2rem' }} />,
      label: <Link to="/news">📰 News</Link>,
    },
  ];

  return (
    <div className="nav-container animate-fade-in-up">
      <div className="logo-container">
        <Avatar 
          src={icon} 
          size="large" 
          className="animate-float"
          style={{ 
            border: '2px solid var(--primary)',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)'
          }}
        />
        <Typography.Title level={2} className="logo">
          <Link to="/">Cryptonova</Link>
        </Typography.Title>
      </div>
      <Menu 
        theme="dark" 
        items={menuItems} 
        mode="horizontal"
        style={{
          background: 'transparent',
          border: 'none',
          fontSize: '1rem',
          fontWeight: '500'
        }}
        className="animate-fade-in-up animate-delay-1"
      />
    </div>
  );
}

export default Navbar;
