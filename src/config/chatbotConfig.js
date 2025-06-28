// Chatbot Configuration File
// Update this file to customize your chatbot's knowledge about your website

export const chatbotConfig = {
  // Website Information
  website: {
    name: "Cryptonova",
    description: "A comprehensive cryptocurrency tracking and analysis platform",
    url: "https://cryptonova.com", // Update with your actual URL
    purpose: "Cryptocurrency tracking, analysis, and news platform"
  },

  // API Configuration
  api: {
    // Pre-configured API key for all users (set this once and it's available for everyone)
    // Leave empty to require users to enter their own key
    preConfiguredKey: "", // Add your OpenRouter API key here: "sk-or-..."
    
    // Alternative: Use environment variable (more secure for production)
    // preConfiguredKey: process.env.REACT_APP_OPENROUTER_API_KEY || "",
    
    // Model to use for the chatbot
    model: "deepseek/deepseek-chat-v3-0324",
    
    // Whether to allow users to override the pre-configured key
    allowUserOverride: true,
    
    // Whether to show API key settings to users
    showApiKeySettings: true
  },

  // Available Features
  features: {
    homepage: {
      path: "/",
      description: "Global cryptocurrency statistics and overview",
      capabilities: [
        "Global cryptocurrency statistics",
        "Top 10 cryptocurrencies overview", 
        "Latest crypto news preview",
        "Market cap and volume data"
      ]
    },
    cryptocurrencies: {
      path: "/cryptocurrencies",
      description: "Complete list of cryptocurrencies with real-time data",
      capabilities: [
        "100+ cryptocurrencies list",
        "Real-time price data",
        "Market cap information",
        "24h price changes",
        "Search functionality",
        "Individual coin details pages"
      ]
    },
    cryptoDetails: {
      path: "/crypto/:coinId",
      description: "Detailed coin information and analytics",
      capabilities: [
        "Detailed coin information",
        "Price charts with multiple timeframes (3h, 24h, 7d, 30d, 1y, 3m, 3y, 5y)",
        "Historical price data",
        "Market statistics",
        "Supply information",
        "Coin description and links"
      ]
    },
    exchanges: {
      path: "/exchanges",
      description: "Top cryptocurrency exchanges information",
      capabilities: [
        "Top cryptocurrency exchanges",
        "Trading volume data",
        "Number of markets",
        "Market share information",
        "Exchange descriptions"
      ]
    },
    news: {
      path: "/news",
      description: "Latest cryptocurrency news and updates",
      capabilities: [
        "Latest cryptocurrency news",
        "Real-time news updates",
        "News source information",
        "Publication dates"
      ]
    }
  },

  // Technical Information
  technical: {
    apis: [
      "CoinRanking API for cryptocurrency data",
      "CryptoNews API for news updates"
    ],
    features: [
      "Real-time API integration",
      "Interactive price charts using Chart.js",
      "Responsive design with modern UI",
      "Dark theme with glass morphism effects",
      "Search and filtering capabilities",
      "Mobile-friendly interface"
    ],
    dataSources: [
      "Real-time price feeds",
      "Historical market data",
      "Live news updates"
    ]
  },

  // Common Questions and Answers
  faq: [
    {
      question: "How do I find a specific cryptocurrency?",
      answer: "Go to the Cryptocurrencies page and use the search bar to find any coin by name or symbol."
    },
    {
      question: "How do I view price charts?",
      answer: "Click on any cryptocurrency from the list to view detailed price charts with multiple timeframes."
    },
    {
      question: "Where can I see the latest news?",
      answer: "Visit the News page to see the most recent cryptocurrency news and updates."
    },
    {
      question: "How often is the data updated?",
      answer: "All cryptocurrency data is updated in real-time from reliable APIs."
    }
  ],

  // Help Topics
  helpTopics: [
    "Finding specific cryptocurrencies",
    "Understanding market trends", 
    "Explaining crypto concepts",
    "Navigating website features",
    "Providing market insights",
    "Answering questions about crypto trading",
    "Explaining technical indicators",
    "Helping with price analysis"
  ],

  // Welcome Message
  welcomeMessage: "🚀 Welcome to Cryptonova AI Assistant! I'm here to help you with cryptocurrency information, market data, and navigating our platform. What would you like to know about cryptocurrencies or the website features?",

  // Suggested Questions
  suggestedQuestions: [
    "What cryptocurrencies are trending?",
    "How do I use the price charts?",
    "What's the latest crypto news?",
    "How do I find Bitcoin information?",
    "What are the top exchanges?",
    "How do I search for a specific coin?"
  ]
};

// Function to get the API key (prioritizes pre-configured key)
export const getApiKey = () => {
  // First check for pre-configured key
  if (chatbotConfig.api.preConfiguredKey) {
    return chatbotConfig.api.preConfiguredKey;
  }
  
  // Fall back to user's stored key
  return localStorage.getItem("openrouter_api_key") || "";
};

// Function to check if API key is available
export const hasApiKey = () => {
  return !!(getApiKey());
};

// Function to generate context from config
export const generateContext = (cryptoData = [], newsData = []) => {
  const { website, features, technical, faq, helpTopics } = chatbotConfig;
  
  let context = `You are an AI assistant for ${website.name}, ${website.description}. Here's what you should know about the website:

WEBSITE INFORMATION:
- Name: ${website.name}
- Purpose: ${website.purpose}
- Features: Real-time crypto prices, market data, news, exchanges, and detailed coin analytics

AVAILABLE PAGES AND FEATURES:`;

  // Add features
  Object.entries(features).forEach(([key, feature]) => {
    context += `\n${key.charAt(0).toUpperCase() + key.slice(1)} (${feature.path}):\n`;
    feature.capabilities.forEach(cap => {
      context += `   - ${cap}\n`;
    });
  });

  context += `\nTECHNICAL FEATURES:\n`;
  technical.features.forEach(feature => {
    context += `- ${feature}\n`;
  });

  context += `\nDATA SOURCES:\n`;
  technical.apis.forEach(api => {
    context += `- ${api}\n`;
  });

  // Add current crypto data if available
  if (cryptoData.length > 0) {
    const topCoins = cryptoData.slice(0, 5).map(coin => ({
      name: coin.name,
      symbol: coin.symbol,
      price: coin.price,
      change24h: coin.change,
      marketCap: coin.marketCap
    }));
    
    context += `\nCURRENT MARKET DATA (Top 5 Cryptocurrencies):\n${JSON.stringify(topCoins, null, 2)}`;
  }
  
  // Add current news if available
  if (newsData.length > 0) {
    const recentNews = newsData.map(news => ({
      title: news.title,
      source: news.source,
      publishedAt: news.publishedAt
    }));
    
    context += `\nLATEST CRYPTO NEWS:\n${JSON.stringify(recentNews, null, 2)}`;
  }

  context += `\nYou can help users with:\n`;
  helpTopics.forEach(topic => {
    context += `- ${topic}\n`;
  });

  context += `\nAlways be helpful, accurate, and provide relevant information about cryptocurrencies and the ${website.name} platform.`;

  return context;
};

export default chatbotConfig; 