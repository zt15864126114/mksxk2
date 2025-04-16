import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import NewsPage from './pages/News';
import Contact from './pages/Contact';
import NewsDetail from './pages/NewsDetail';
import ProductDetail from './pages/ProductDetail';
import './styles/global.css';
// Import framer-motion components
import { AnimatePresence, motion } from 'framer-motion';

// 添加滚动到顶部的组件
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

// Define page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20 // Start slightly down
  },
  in: {
    opacity: 1,
    y: 0
  },
  out: {
    opacity: 0,
    y: -20 // Exit slightly up
  }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate", // Or "easeInOut"
  duration: 0.5
};

// Wrap Routes with AnimatePresence and add motion wrapper to each route element
const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><Home /></motion.div>} />
        <Route path="/about" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><About /></motion.div>} />
        <Route path="/products" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><Products /></motion.div>} />
        <Route path="/products/:id" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><ProductDetail /></motion.div>} />
        <Route path="/news" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><NewsPage /></motion.div>} />
        <Route path="/news/:id" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><NewsDetail /></motion.div>} />
        <Route path="/contact" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><Contact /></motion.div>} />
      </Routes>
    </AnimatePresence>
  );
}

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <AntApp>
        <Router>
          <ScrollToTop />
          <Layout>
            {/* Use AnimatedRoutes instead of Routes directly */}
            <AnimatedRoutes />
          </Layout>
        </Router>
      </AntApp>
    </ConfigProvider>
  );
};

export default App;
