import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Contact from './pages/Contact';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import './styles/global.css';

const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <Header />
    <main style={{ flex: 1 }}>{children}</main>
    <Footer />
  </div>
);

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <Routes>
          <Route path="/" element={<PageLayout><Home /></PageLayout>} />
          <Route path="/about" element={<PageLayout><About /></PageLayout>} />
          <Route path="/products" element={<PageLayout><Products /></PageLayout>} />
          <Route path="/products/:id" element={<PageLayout><ProductDetail /></PageLayout>} />
          <Route path="/news" element={<PageLayout><News /></PageLayout>} />
          <Route path="/news/:id" element={<PageLayout><NewsDetail /></PageLayout>} />
          <Route path="/contact" element={<PageLayout><Contact /></PageLayout>} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
};

export default App;
