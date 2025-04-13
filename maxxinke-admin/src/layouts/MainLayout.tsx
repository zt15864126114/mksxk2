import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Layout, Menu, theme, Typography, Avatar, Dropdown, message } from 'antd';
import {
  DashboardOutlined,
  ShopOutlined,
  FileTextOutlined,
  MessageOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useUserStore();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // 确定当前选中的菜单项
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'dashboard';
    if (path.includes('/products')) return 'products';
    if (path.includes('/news')) return 'news'; 
    if (path.includes('/messages')) return 'messages';
    return 'dashboard';
  };

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '仪表盘',
      onClick: () => navigate('/dashboard'),
    },
    {
      key: 'products',
      icon: <ShopOutlined />,
      label: '产品管理',
      onClick: () => navigate('/products'),
    },
    {
      key: 'news',
      icon: <FileTextOutlined />,
      label: '新闻管理',
      onClick: () => navigate('/news'),
    },
    {
      key: 'messages',
      icon: <MessageOutlined />,
      label: '消息管理',
      onClick: () => navigate('/messages'),
    },
  ];

  const handleLogout = () => {
    try {
      logout();
      message.success('已退出登录');
    } catch (error) {
      console.error('退出登录时发生错误:', error);
      message.error('退出登录时发生错误');
    }
  };

  const userMenuItems = [
    {
      key: '1',
      icon: <UserOutlined />,
      label: '管理员账号',
      disabled: true,
    },
    {
      key: '2', 
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="dark">
        <div style={{ height: 64, margin: '16px 0', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Title level={5} style={{ color: 'white', margin: 0, textAlign: 'center' }}>
            {collapsed ? 'MX' : '麦克斯鑫科管理系统'}
          </Title>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 16px', background: colorBgContainer, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
              style: { fontSize: '18px', cursor: 'pointer' },
            })}
          </div>
          <div>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Avatar 
                icon={<UserOutlined />} 
                style={{ cursor: 'pointer', backgroundColor: '#1677ff' }}
              />
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            minHeight: 280,
            overflow: 'auto', // 添加滚动条，防止内容溢出
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 