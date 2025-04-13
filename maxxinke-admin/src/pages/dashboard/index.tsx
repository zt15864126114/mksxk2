import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, List, Typography, Spin, message } from 'antd';
import { 
  ShoppingOutlined, 
  FileTextOutlined, 
  MessageOutlined, 
  UserOutlined 
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface Stat {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

interface Message {
  id: number;
  name: string;
  content: string;
  createTime: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stat[]>([]);
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // 获取统计数据
      const statsResponse = await fetch('/api/dashboard/stats');
      const statsData = await statsResponse.json();
      
      if (statsData) {
        setStats([
          {
            title: '产品总数',
            value: statsData.productCount || 0,
            icon: <ShoppingOutlined />,
            color: '#1890ff',
          },
          {
            title: '新闻总数',
            value: statsData.newsCount || 0,
            icon: <FileTextOutlined />,
            color: '#52c41a',
          },
          {
            title: '消息总数',
            value: statsData.messageCount || 0,
            icon: <MessageOutlined />,
            color: '#faad14',
          },
          {
            title: '用户总数',
            value: statsData.userCount || 0,
            icon: <UserOutlined />,
            color: '#722ed1',
          },
        ]);
      }
      
      // 获取最近消息
      const messagesResponse = await fetch('/api/messages/recent');
      const messagesData = await messagesResponse.json();
      
      if (messagesData && Array.isArray(messagesData)) {
        setRecentMessages(messagesData);
      }
    } catch (error) {
      console.error('获取仪表盘数据失败:', error);
      message.error('获取仪表盘数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Title level={2}>仪表盘</Title>
      
      <Row gutter={16} style={{ marginBottom: 24 }}>
        {stats.map((stat, index) => (
          <Col span={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.icon}
                valueStyle={{ color: stat.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>
      
      <Row gutter={16}>
        <Col span={12}>
          <Card title="最近消息">
            <List
              dataSource={recentMessages}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.name}
                    description={item.content}
                  />
                  <Text type="secondary">{new Date(item.createTime).toLocaleString()}</Text>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="系统信息">
            <p>欢迎使用麦克斯鑫科管理系统</p>
            <p>当前版本: 1.0.0</p>
            <p>上次更新: 2023-12-01</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 