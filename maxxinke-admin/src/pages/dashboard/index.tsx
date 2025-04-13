import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, List, Tag, Button, Spin, message } from 'antd';
import { Line, Column } from '@ant-design/plots';
import {
  ShoppingOutlined,
  FileTextOutlined,
  MessageOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { dashboardAPI } from '@/services/dashboardService';
import type { 
  DashboardStats, 
  VisitData, 
  CategoryData, 
  RecentMessage, 
  RecentNews 
} from '@/services/dashboardService';

const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [visitData, setVisitData] = useState<VisitData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);
  const [recentNews, setRecentNews] = useState<RecentNews[]>([]);

  // 获取所有仪表盘数据
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [
        statsData,
        visitData,
        categoryData,
        messagesData,
        newsData
      ] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getVisitData(),
        dashboardAPI.getCategoryData(),
        dashboardAPI.getRecentMessages(),
        dashboardAPI.getRecentNews()
      ]);

      setStats(statsData);
      setVisitData(visitData);
      setCategoryData(categoryData);
      setRecentMessages(messagesData);
      setRecentNews(newsData);
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

  if (loading || !stats) {
    return (
      <div style={{ 
        height: 'calc(100vh - 100px)', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* 统计卡片 */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="产品总数"
              value={stats.totalProducts}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#1890ff' }}
              suffix={
                <Tag color={stats.productGrowth >= 0 ? 'blue' : 'red'}>
                  {stats.productGrowth >= 0 ? '+' : ''}{stats.productGrowth}%
                </Tag>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="新闻数量"
              value={stats.totalNews}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#52c41a' }}
              suffix={
                <Tag color={stats.newsGrowth >= 0 ? 'green' : 'red'}>
                  {stats.newsGrowth >= 0 ? '+' : ''}{stats.newsGrowth}%
                </Tag>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="消息数量"
              value={stats.totalMessages}
              prefix={<MessageOutlined />}
              valueStyle={{ color: '#faad14' }}
              suffix={
                <Tag color={stats.messageGrowth >= 0 ? 'orange' : 'red'}>
                  {stats.messageGrowth >= 0 ? '+' : ''}{stats.messageGrowth}%
                </Tag>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="总访问量"
              value={stats.totalViews}
              prefix={<EyeOutlined />}
              valueStyle={{ color: '#722ed1' }}
              suffix={
                <Tag color={stats.viewsGrowth >= 0 ? 'purple' : 'red'}>
                  {stats.viewsGrowth >= 0 ? '+' : ''}{stats.viewsGrowth}%
                </Tag>
              }
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col xs={24} lg={16}>
          <Card title="访问量趋势" bordered={false}>
            <Line
              data={visitData}
              xField="date"
              yField="value"
              smooth
              point={{
                size: 5,
                shape: 'diamond',
              }}
              color="#1890ff"
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="产品分类统计" bordered={false}>
            <Column
              data={categoryData}
              xField="category"
              yField="count"
              color="#52c41a"
              label={{
                position: 'top',
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* 列表区域 */}
      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col xs={24} lg={12}>
          <Card 
            title="最近消息" 
            bordered={false}
            extra={<Button type="link" onClick={() => window.location.href = '/messages'}>查看全部</Button>}
          >
            <List
              dataSource={recentMessages}
              renderItem={item => (
                <List.Item
                  extra={
                    <Tag color={item.status === '未回复' ? 'red' : 'green'}>
                      {item.status}
                    </Tag>
                  }
                >
                  <List.Item.Meta
                    title={item.title}
                    description={dayjs(item.time).format('YYYY-MM-DD HH:mm:ss')}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card 
            title="最新新闻" 
            bordered={false}
            extra={<Button type="link" onClick={() => window.location.href = '/news'}>查看全部</Button>}
          >
            <List
              dataSource={recentNews}
              renderItem={item => (
                <List.Item
                  extra={
                    <Tag color={item.type === '公司动态' ? 'blue' : 'cyan'}>
                      {item.type}
                    </Tag>
                  }
                >
                  <List.Item.Meta
                    title={item.title}
                    description={dayjs(item.time).format('YYYY-MM-DD')}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage; 