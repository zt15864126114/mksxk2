import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';

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
  }

  .contact-btn {
    margin-left: 20px;
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

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  // 根据当前路径获取选中的菜单项
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    return path.split('/')[1] || 'home';
  };

  const menuItems = [
    { key: 'home', label: '首页', path: '/' },
    { key: 'about', label: '关于我们', path: '/about' },
    { key: 'products', label: '产品中心', path: '/products' },
    { key: 'news', label: '新闻动态', path: '/news' },
    { key: 'contact', label: '联系我们', path: '/contact' },
  ];

  const handleMenuClick = (path: string) => {
    navigate(path);
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
        selectedKeys={[getSelectedKey()]}
        items={menuItems.map(item => ({
          key: item.key,
          label: item.label,
          onClick: () => handleMenuClick(item.path)
        }))}
        className="menu"
      />
      <Button 
        type="primary" 
        className="contact-btn"
        onClick={() => navigate('/contact')}
      >
        联系我们
      </Button>
      <MobileMenu>
        <Button
          icon={<MenuOutlined />}
          onClick={() => setMobileMenuVisible(!mobileMenuVisible)}
        />
      </MobileMenu>
    </StyledHeader>
  );
};

export default Header; 