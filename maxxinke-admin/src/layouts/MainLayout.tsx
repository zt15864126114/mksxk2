import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Layout, Menu, theme, Typography, Avatar, Dropdown, message } from 'antd';
import type { MenuProps } from 'antd';
import {
  DashboardOutlined,
  ShopOutlined,
  FileTextOutlined,
  MessageOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  InfoCircleOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import ChangePasswordModal from '../components/ChangePasswordModal';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: string,
  icon?: React.ReactNode,
  children?: MenuItem[],
  onClick?: () => void,
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    onClick,
  } as MenuItem;
}

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useUserStore();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') return 'dashboard';
    if (path === '/about-us') return 'about-us';
    if (path === '/products') return 'products';
    if (path === '/products/categories') return 'product-categories';
    if (path === '/news') return 'news'; 
    if (path === '/messages') return 'messages';
    if (path === '/settings/contact') return 'settings-contact';
    return '';
  };

  const menuItems: MenuItem[] = [
    getItem('仪表盘', 'dashboard', <DashboardOutlined />, undefined, () => navigate('/dashboard')),
    getItem('产品管理', 'products-group', <ShopOutlined />, [
      getItem('产品列表', 'products', undefined, undefined, () => navigate('/products')),
      getItem('产品分类', 'product-categories', undefined, undefined, () => navigate('/products/categories')),
    ]),
    getItem('新闻管理', 'news', <FileTextOutlined />, undefined, () => navigate('/news')),
    getItem('消息管理', 'messages', <MessageOutlined />, undefined, () => navigate('/messages')),
    getItem('关于我们', 'about-us', <InfoCircleOutlined />, undefined, () => navigate('/about-us')),
    // getItem('系统设置', 'settings-group',  [
    //   getItem('联系方式', 'settings-contact', undefined, undefined, () => navigate('/settings/contact')),
    // ]),
    getItem('联系方式管理', 'settings-contact', <SettingOutlined />,undefined, () => navigate('/settings/contact')),
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

  const handleOpenChangePasswordModal = () => {
    setChangePasswordModalVisible(true);
  };

  const userMenuItems = [
    {
      key: '1',
      icon: <UserOutlined />,
      label: '管理员账号',
      disabled: true,
    },
    {
      key: 'change-password',
      icon: <SettingOutlined />,
      label: '修改密码',
      onClick: handleOpenChangePasswordModal,
    },
    {
      key: '2', 
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  const getOpenKeys = () => {
    const path = location.pathname;
    if (path.startsWith('/products')) return ['products-group'];
    if (path.startsWith('/settings')) return ['settings-group'];
    return [];
  };

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
          defaultOpenKeys={getOpenKeys()}
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
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
      <ChangePasswordModal
        open={changePasswordModalVisible}
        onClose={() => setChangePasswordModalVisible(false)}
      />
    </Layout>
  );
};

export default MainLayout; 