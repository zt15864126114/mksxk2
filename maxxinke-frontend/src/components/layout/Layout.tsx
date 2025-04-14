import React from 'react';
import { Layout as AntLayout } from 'antd';
import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';

const { Content } = AntLayout;

const StyledLayout = styled(AntLayout)`
  min-height: 100vh;
  
  .ant-layout {
    background: #fff;
  }
`;

const MainContent = styled(Content)`
  margin-top: 80px; // 为固定header预留空间
  min-height: calc(100vh - 80px); // 减去header高度
  background: #fff;
  position: relative;
`;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <StyledLayout>
      <Header />
      <MainContent>
        {children}
      </MainContent>
      <Footer />
    </StyledLayout>
  );
};

export default Layout;