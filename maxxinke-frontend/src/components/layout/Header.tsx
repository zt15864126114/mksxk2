import React, { useState } from 'react';
import { Layout, Menu, Button, Drawer } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const { Header: AntHeader } = Layout;

const StyledHeader = styled(AntHeader)`
  position: fixed;
  width: 100%;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 50px;
  height: 80px;

  .logo {
    height: 50px;
    margin-right: 40px;
    cursor: pointer;
  }

  .menu {
    flex: 1;
    border: none;
    background: transparent;
    line-height: 78px;
    
    .ant-menu-item {
      padding: 0 20px;
      font-size: 16px;
      
      a {
        color: rgba(0, 0, 0, 0.85);
        &:hover {
          color: #1890ff;
        }
      }
    }
  }

  .contact-btn {
    margin-left: 20px;
    height: 40px;
    padding: 0 24px;
    font-size: 16px;
    display: flex;
    align-items: center;
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    padding: 0 20px;
    
    .menu {
      display: none;
    }
  }
`;

const MobileMenu = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const StyledDrawer = styled(Drawer)`
  .ant-drawer-body {
    padding: 0;
  }
  
  .ant-menu {
    border: none;
  }
`;

const Header: React.FC = () => {
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { key: '/', label: '首页' },
    { key: '/about', label: '关于我们' },
    { key: '/products', label: '产品中心' },
    { key: '/news', label: '新闻动态' },
    { key: '/contact', label: '联系我们' },
  ];

  const handleMenuClick = (path: string) => {
    navigate(path);
    setMobileMenuVisible(false);
  };

  return (
    <StyledHeader>
      <img 
        src="/logo.png" 
        alt="Logo" 
        className="logo" 
        onClick={() => navigate('/')}
      />
      <Menu
        mode="horizontal"
        selectedKeys={[location.pathname]}
        className="menu"
        items={menuItems.map(item => ({
          key: item.key,
          label: <Link to={item.key}>{item.label}</Link>
        }))}
      />
      <Link to="/contact">
        <Button type="primary" className="contact-btn">
          联系我们
        </Button>
      </Link>
      <MobileMenu>
        <Button
          icon={<MenuOutlined />}
          onClick={() => setMobileMenuVisible(true)}
        />
      </MobileMenu>
      <StyledDrawer
        title="导航菜单"
        placement="right"
        onClose={() => setMobileMenuVisible(false)}
        open={mobileMenuVisible}
      >
        <Menu
          mode="vertical"
          selectedKeys={[location.pathname]}
          items={menuItems.map(item => ({
            key: item.key,
            label: item.label,
            onClick: () => handleMenuClick(item.key)
          }))}
        />
      </StyledDrawer>
    </StyledHeader>
  );
};

export default Header; 