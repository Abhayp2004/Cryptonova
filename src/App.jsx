import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {Routes,Route,Link} from 'react-router-dom'
import {Layout,Typography,Space} from 'antd'
import Navbar from './components/Navbar'
import Homepage from './components/Homepage'
import Exchanges from './components/Exchanges'
import Cryptocurrencies from './components/Cryptocurrencies'
import CryptoDetails from './components/CryptoDetails'
import News from './components/News'
import Chatbot from './components/chatbot';
import LiquidGlass from './components/LiquidGlass';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='app'>
        <div className='navbar'>
          <Navbar />
        </div>
        <div className='main'>
          <div className="routes">
            <Routes>
              <Route path='/' element={<Homepage />} />
              <Route path='/exchanges' element={<Exchanges />} />
              <Route path='/cryptocurrencies' element={<Cryptocurrencies />} />
              <Route path='/crypto/:coinId' element={<CryptoDetails />} />
              <Route path='/news' element={<News />} />
            </Routes>
            <div> <Chatbot title="AI Assistant" model="deepseek/deepseek-chat-v3-0324" siteUrl="https://yoursite.com" siteName="Your Site" /> </div> 
          </div>
        </div>
        <LiquidGlass />
      </div>
    </>
  )
}

export default App
