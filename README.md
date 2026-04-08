# 🚀 Cryptonova - Modern Cryptocurrency Platform

A cutting-edge cryptocurrency tracking and analysis platform featuring Apple-inspired liquid glass effects, real-time market data, and an intelligent AI chatbot assistant.

![Cryptonova Preview](https://img.shields.io/badge/Cryptonova-Crypto%20Platform-blue?style=for-the-badge&logo=bitcoin)
![React](https://img.shields.io/badge/React-18.0.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Ant Design](https://img.shields.io/badge/Ant%20Design-5.0-blue?style=for-the-badge&logo=ant-design)

## ✨ Features

### 🎨 **Apple-Inspired Liquid Glass Design**
- **Glass Morphism Effects**: Translucent backgrounds with blur effects
- **Smooth Animations**: Fluid transitions and hover effects
- **Modern Dark Theme**: Elegant dark interface with gradient accents
- **Responsive Design**: Perfect on all devices
- **Floating Elements**: Dynamic UI components with depth

### 🤖 **AI-Powered Chatbot Assistant**
- **Intelligent Responses**: Powered by OpenRouter AI models
- **Website Knowledge**: Fully aware of all platform features
- **Real-time Help**: Instant assistance with cryptocurrency queries
- **Pre-configured Setup**: Ready-to-use with shared API key
- **Secure**: API keys are masked and protected

### 📊 **Comprehensive Crypto Data**
- **Real-time Prices**: Live cryptocurrency market data
- **Interactive Charts**: Multi-timeframe price analysis
- **Market Statistics**: Global crypto market overview
- **Top Exchanges**: Leading trading platform information
- **Latest News**: Real-time cryptocurrency news updates

### 🔍 **Advanced Features**
- **Search & Filter**: Find specific cryptocurrencies easily
- **Detailed Analytics**: Comprehensive coin information
- **Historical Data**: Price history and trends
- **Mobile Optimized**: Perfect mobile experience
- **Fast Performance**: Optimized for speed

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **UI Framework**: Ant Design 5.0
- **Styling**: CSS3 with Custom Properties
- **Charts**: Chart.js with React integration
- **Data APIs**: CoinRanking + CryptoNews APIs
- **Build Tool**: Vite
- **Icons**: Lucide React

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/cryptonova.git
cd cryptonova

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup

Create a `.env` file in the root directory:

```env
# Required: RapidAPI keys
VITE_RAPIDAPI_COINRANKING_KEY=your_coinranking_rapidapi_key
VITE_RAPIDAPI_CRYPTONEWS_KEY=your_cryptonews_rapidapi_key

# Optional: For pre-configured chatbot API key
API_KEY=sk-or-your-api-key-here
```

You can copy from `.env.example` and fill in your real keys.

## 🤖 AI Chatbot Setup

### Option 1: Pre-configured API Key (Recommended)
Edit `src/config/chatbotConfig.js`:

```javascript
api: {
  preConfiguredKey: "sk-or-your-actual-api-key-here",
  allowUserOverride: true,
  showApiKeySettings: true
}
```

### Option 2: User-provided Keys
Leave the pre-configured key empty and users will enter their own API keys.


## 🎨 Design System

### Liquid Glass Effects
The platform features Apple-inspired liquid glass morphism:

```css
/* Glass morphism background */
background: var(--bg-glass);
backdrop-filter: blur(15px);
border: 1px solid var(--border-light);
```

### Color Scheme
- **Primary**: Modern blue gradients
- **Background**: Dark theme with glass effects
- **Text**: High contrast for readability
- **Accents**: Subtle highlights and shadows

### Animations
- Smooth hover effects
- Floating element animations
- Gradient text animations
- Responsive transitions

## 📱 Pages & Features

### 🏠 Homepage
- Global cryptocurrency statistics
- Top 10 cryptocurrencies overview
- Latest news preview
- Market cap and volume data

### 💰 Cryptocurrencies
- Complete list of 100+ cryptocurrencies
- Real-time price data
- Market cap information
- 24h price changes
- Advanced search and filtering

### 📈 Crypto Details
- Detailed coin information
- Interactive price charts (3h, 24h, 7d, 30d, 1y, 3m, 3y, 5y)
- Historical price data
- Market statistics
- Supply information

### 🏦 Exchanges
- Top cryptocurrency exchanges
- Trading volume data
- Number of markets
- Market share information

### 📰 News
- Latest cryptocurrency news
- Real-time updates
- News source information
- Publication dates

