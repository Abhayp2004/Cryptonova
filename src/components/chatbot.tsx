"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Input,
  Card,
  Badge,
  Space,
  Typography,
  Divider,
} from "antd";
import { Settings, Send, Bot, User, Key } from "lucide-react";
import { generateContext, chatbotConfig, getApiKey, hasApiKey } from "../config/chatbotConfig";

// Message type
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Crypto data
interface CryptoData {
  name: string;
  symbol: string;
  price: string;
  change: string;
  marketCap: string;
}

// News data
interface NewsData {
  title: string;
  source: string;
  publishedAt: string;
}

// Props
interface ChatbotProps {
  title?: string;
  placeholder?: string;
  model?: string;
  siteUrl?: string;
  siteName?: string;
  className?: string;
  maxHeight?: string;
}

// Mock crypto/news data
const fetchCryptoData = async () => {
  console.log("Crypto data fetching disabled for security.");
  return [];
};

const fetchCryptoNews = async () => {
  console.log("News fetching disabled for security.");
  return [];
};

export default function Chatbot({
  title = `${chatbotConfig.website.name} AI Assistant`,
  placeholder = "Ask me about cryptocurrencies, market data, or website features...",
  model = chatbotConfig.api.model,
  siteUrl = chatbotConfig.website.url,
  siteName = chatbotConfig.website.name,
  className = "",
  maxHeight = "600px",
}: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [tempApiKey, setTempApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [newsData, setNewsData] = useState<NewsData[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load API key on mount (prioritizes pre-configured key)
  useEffect(() => {
    const key = getApiKey();
    if (key) {
      setApiKey(key);
      console.log("API key loaded:", hasApiKey() ? "Pre-configured" : "User key");
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const crypto = await fetchCryptoData();
      const news = await fetchCryptoNews();
      setCryptoData(crypto);
      setNewsData(news);
    };
    loadData();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const maskApiKey = (key: string) => {
    return key.length < 8 ? "***" : key.substring(0, 4) + "***" + key.slice(-4);
  };

  const handleApiKeySubmit = () => {
    const trimmedKey = tempApiKey.trim();
    if (!trimmedKey) return alert("Please enter a valid API key");

    if (!trimmedKey.startsWith("sk-or-")) {
      const confirmUse = confirm("This doesn't look like a valid OpenRouter API key. Use anyway?");
      if (!confirmUse) return;
    }

    setApiKey(trimmedKey);
    localStorage.setItem("openrouter_api_key", trimmedKey);
    setShowSettings(false);
    setMessages([
      {
        id: Date.now().toString(),
        role: "assistant",
        content: chatbotConfig.welcomeMessage,
        timestamp: new Date(),
      },
    ]);
  };

  const clearApiKey = () => {
    if (!confirm("Clear your API key?")) return;
    setApiKey("");
    setTempApiKey("");
    localStorage.removeItem("openrouter_api_key");
    setMessages([]);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    // Get current API key (prioritizes pre-configured)
    const currentApiKey = getApiKey();
    
    if (!currentApiKey) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Please configure your API key first.",
          timestamp: new Date(),
        },
      ]);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const context = generateContext(cryptoData, newsData);

      const systemMessage = { role: "system" as const, content: context };
      const apiMessages = [
        systemMessage,
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: "user" as const, content: input },
      ];

      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${currentApiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": siteUrl,
          "X-Title": siteName,
        },
        body: JSON.stringify({ model, messages: apiMessages, stream: false }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        let msg = "An error occurred.";
        if (res.status === 401) msg = "Invalid API key.";
        else if (res.status === 402) msg = "Insufficient credits.";
        else if (res.status === 429) msg = "Rate limit exceeded.";
        else try {
          const data = JSON.parse(errorText);
          msg = data?.error?.message || msg;
        } catch {
          msg = errorText;
        }
        throw new Error(msg);
      }

      const data = await res.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.choices?.[0]?.message?.content || "No response.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: err.message || "Unexpected error occurred.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const clearChat = () => setMessages([]);
  const toggleSettings = () => {
    setTempApiKey("");
    setShowSettings((s) => !s);
  };

  // Check if we have an API key (either pre-configured or user-provided)
  const hasValidApiKey = hasApiKey();

  return (
    <Card
      className={className}
      style={{
        maxWidth: "800px",
        maxHeight,
        margin: "0 auto",
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 1000,
        boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
        background: "var(--bg-glass)",
        backdropFilter: "blur(15px)",
        border: "1px solid var(--border-light)",
      }}
      title={
        <Space>
          <Bot />
          <Typography.Text strong>{title}</Typography.Text>
        </Space>
      }
      extra={
        <Space>
          {hasValidApiKey && <Badge status="success" text="Connected" />}
          {chatbotConfig.api.showApiKeySettings && !chatbotConfig.api.preConfiguredKey && (
            <Button type="text" icon={<Settings />} onClick={toggleSettings} />
          )}
        </Space>
      }
    >
      {showSettings && chatbotConfig.api.showApiKeySettings && (
        <div style={{ marginBottom: 16 }}>
          <Typography.Text strong>API Key Settings</Typography.Text>
          
          {chatbotConfig.api.preConfiguredKey ? (
            <div style={{ marginTop: 8 }}>
              <Typography.Text type="secondary">
                Using pre-configured API key: {maskApiKey(chatbotConfig.api.preConfiguredKey)}
              </Typography.Text>
              {chatbotConfig.api.allowUserOverride && (
                <>
                  <Input.Password
                    placeholder="Override with your own API key (optional)"
                    value={tempApiKey}
                    onChange={(e) => setTempApiKey(e.target.value)}
                    style={{ marginTop: 8 }}
                  />
                  <Space style={{ marginTop: 8 }}>
                    <Button type="primary" onClick={handleApiKeySubmit}>
                      Override
                    </Button>
                    <Button onClick={clearApiKey}>Clear Override</Button>
                  </Space>
                </>
              )}
            </div>
          ) : (
            <>
              <Input.Password
                placeholder="Enter API key"
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                style={{ marginTop: 8 }}
              />
              <Space style={{ marginTop: 8 }}>
                <Button type="primary" onClick={handleApiKeySubmit}>
                  Save
                </Button>
                <Button onClick={clearApiKey}>Clear</Button>
              </Space>
            </>
          )}
          
          
          <Divider />
        </div>
      )}

      <div style={{ height: "400px", overflowY: "auto", padding: "8px 0" }}>
        {!hasValidApiKey ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <Bot size={48} style={{ marginBottom: 16 }} />
            <Typography.Title level={4}>Welcome to Cryptonova AI</Typography.Title>
            <Typography.Text>Enter your API key to start</Typography.Text>
            <br />
            {chatbotConfig.api.showApiKeySettings && (
              <Button icon={<Key />} type="primary" onClick={toggleSettings} style={{ marginTop: 16 }}>
                Configure API Key
              </Button>
            )}
          </div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <Bot size={48} style={{ marginBottom: 16 }} />
            <Typography.Title level={4}>Ready to help with crypto!</Typography.Title>
            <Typography.Text>
              Try: "{chatbotConfig.suggestedQuestions[0]}" or "{chatbotConfig.suggestedQuestions[1]}"
            </Typography.Text>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  marginBottom: 16,
                }}
              >
                {msg.role === "assistant" && <Bot style={{ marginRight: 8 }} />}
                <div
                  style={{
                    maxWidth: "80%",
                    background: msg.role === "user" ? "var(--primary)" : "var(--bg-tertiary)",
                    color: msg.role === "user" ? "#fff" : "var(--text-primary)",
                    padding: 12,
                    borderRadius: 8,
                    border: msg.role === "assistant" ? "1px solid var(--border-light)" : "none",
                  }}
                >
                  <Typography.Text style={{ whiteSpace: "pre-wrap" }}>
                    {msg.content}
                  </Typography.Text>
                  <div style={{ fontSize: 12, opacity: 0.6 }}>
                    {msg.timestamp.toLocaleTimeString()}
                  </div>
                </div>
                {msg.role === "user" && <User style={{ marginLeft: 8 }} />}
              </div>
            ))}
            {isLoading && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Bot />
                <Typography.Text>Typing...</Typography.Text>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {hasValidApiKey && (
        <form onSubmit={handleSubmit} style={{ display: "flex", marginTop: 12, gap: 8 }}>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
          />
          <Button htmlType="submit" type="primary" disabled={!input.trim() || isLoading} icon={<Send />} />
        </form>
      )}
      {messages.length > 0 && (
        <Button style={{ marginTop: 8 }} onClick={clearChat}>
          Clear Chat
        </Button>
      )}
    </Card>
  );
}
