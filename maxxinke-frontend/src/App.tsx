import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import NewsDetail from './pages/NewsDetail';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import './styles/global.css';

// 临时页面组件
const TempPage: React.FC<{ title: string }> = ({ title }) => (
  <div style={{ padding: '100px 20px 20px', textAlign: 'center' }}>
    <h1>{title}</h1>
    <p>页面建设中...</p>
  </div>
);

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<TempPage title="关于我们" />} />
          <Route path="/products" element={<TempPage title="产品中心" />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/news" element={<TempPage title="新闻动态" />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/contact" element={<TempPage title="联系我们" />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
};

export default App;
