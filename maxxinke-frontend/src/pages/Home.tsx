import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import Banner from '../components/home/Banner';
import StatsSection from '../components/home/StatsSection';
import AdvantagesSection from '../components/home/AdvantagesSection';
import Products from '../components/home/Products';
import News from '../components/home/News';
import api from '../services/api';

const HomeWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`;

const MainContent = styled.main`
  flex: 1;
`;

const Home: React.FC = () => {
  const hasRecorded = useRef(false);

  useEffect(() => {
    // 页面加载时记录访问
    const recordPageView = async () => {
      // 防止在严格模式下重复记录
      if (hasRecorded.current) {
        return;
      }

      try {
        // 只记录前台页面的访问
        const currentPath = window.location.pathname;
        // 如果是前台页面，才记录访问
        if (!currentPath.startsWith('/admin') && !currentPath.startsWith('/dashboard')) {
          await api.get('/dashboard/visits/record', {
            params: {
              path: currentPath,
              title: document.title
            }
          });
          hasRecorded.current = true;
        }
      } catch (error) {
        console.error('Failed to record visit:', error);
      }
    };

    recordPageView();
    
    // 确保页面滚动到顶部
    window.scrollTo(0, 0);
  }, []); // 空依赖数组表示只在组件挂载时执行一次

  return (
    <HomeWrapper>
      <MainContent>
        <Banner />
        <StatsSection />
        <AdvantagesSection />
        <Products />
        <News />
      </MainContent>
    </HomeWrapper>
  );
};

export default Home;