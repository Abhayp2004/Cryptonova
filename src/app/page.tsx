import React from "react"
import Chatbot from "../components/chatbot"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Chatbot Integration Demo</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            This chatbot can be easily integrated into any React website. Users can input their own OpenRouter API key
            to access various LLM models.
          </p>
        </div>

        <Chatbot
          title="My Custom Assistant"
          placeholder="Ask me anything..."
          model="deepseek/deepseek-chat-v3-0324"
          siteUrl="https://yourwebsite.com"
          siteName="Your Website Name"
        />

        <div className="mt-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Integration Instructions</h2>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold mb-2">1. Install Dependencies</h3>
            <code className="block bg-gray-100 p-2 rounded mb-4 text-sm">
              npm install lucide-react class-variance-authority @radix-ui/react-scroll-area
            </code>

            <h3 className="font-semibold mb-2">2. Copy the Chatbot Component</h3>
            <p className="text-sm text-gray-600 mb-4">
              Copy the <code>chatbot.tsx</code> component and required UI components to your project.
            </p>

            <h3 className="font-semibold mb-2">3. Use in Your App</h3>
            <code className="block bg-gray-100 p-2 rounded text-sm">
              {`import Chatbot from './components/chatbot';

function App() {
  return (
    <div>
      <Chatbot 
        title="AI Assistant"
        model="deepseek/deepseek-chat-v3-0324"
        siteUrl="https://yoursite.com"
        siteName="Your Site"
      />
    </div>
  );
}`}
            </code>
          </div>
        </div>
      </div>
    </div>
  )
}
