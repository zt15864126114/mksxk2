import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, List, Tag, Button, Spin, App, Radio, Tabs } from 'antd';
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

// 格式化百分比数字，限制小数位数为2位
const formatPercentage = (value: number): string => {
  // 处理异常情况
  if (value > 1000) return '+999%';
  if (value < -1000) return '-999%';
  
  // 四舍五入到2位小数
  const formattedValue = Math.round(value * 100) / 100;
  return formattedValue >= 0 ? `+${formattedValue}%` : `${formattedValue}%`;
};

// 确定百分比显示的颜色
const getTagColor = (value: number): string => {
  if (value === 0) return 'blue'; // 零增长
  return value > 0 ? 'green' : 'red'; // 正增长为绿色，负增长为红色
};

// 访问时间类型
type TimeRangeType = 'day' | 'month' | 'year';

const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [visitData, setVisitData] = useState<VisitData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);
  const [recentNews, setRecentNews] = useState<RecentNews[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRangeType>('month');
  const { message } = App.useApp();

  // 根据选定的时间范围处理访问数据
  const processVisitData = (data: VisitData[]): VisitData[] => {
    if (!data || data.length === 0) return [];
    
    // 过滤掉value为null或undefined的数据，并确保日期有值
    return data
      .filter(item => item.value !== null && item.value !== undefined && item.date && item.date !== 'null')
      .map(item => ({
        date: item.date || '无数据',
        value: typeof item.value === 'number' ? item.value : 0
      }));
  };

  // 获取所有仪表盘数据
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [
        statsData,
        categoryData,
        messagesData,
        newsData
      ] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getCategoryData(),
        dashboardAPI.getRecentMessages(),
        dashboardAPI.getRecentNews()
      ]);

      setStats(statsData);
      setCategoryData(categoryData);
      setRecentMessages(messagesData);
      setRecentNews(newsData);
      
      // 根据当前选择的时间范围获取相应的访问数据
      await fetchVisitData(timeRange);
    } catch (error) {
      console.error('获取仪表盘数据失败:', error);
      message.error('获取仪表盘数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取访问数据
  const fetchVisitData = async (type: TimeRangeType) => {
    try {
      let data;
      switch (type) {
        case 'day':
          data = await dashboardAPI.getDailyVisitData();
          break;
        case 'year':
          data = await dashboardAPI.getYearlyVisitData();
          break;
        default:
          data = await dashboardAPI.getVisitData();
          break;
      }
      setVisitData(data);
    } catch (error) {
      console.error(`获取${type}访问数据失败:`, error);
      message.error(`获取${type}访问数据失败`);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // 处理时间范围切换
  const handleTimeRangeChange = (e: any) => {
    const newTimeRange = e.target.value as TimeRangeType;
    setTimeRange(newTimeRange);
    fetchVisitData(newTimeRange);
  };

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

  // 获取处理后的访问数据
  const processedVisitData = processVisitData(visitData);

  return (
    <div style={{ padding: '24px', overflowY: 'auto', height: 'calc(100vh - 64px)' }}>
      {/* 统计卡片 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8} xl={4}>
          <Card variant="borderless" hoverable>
            <Statistic
              title="产品总数"
              value={stats.totalProducts}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#1890ff' }}
              suffix={
                <Tag color={getTagColor(stats.productGrowth)}>
                  {formatPercentage(stats.productGrowth)}
                </Tag>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8} xl={4}>
          <Card variant="borderless" hoverable>
            <Statistic
              title="新闻数量"
              value={stats.totalNews}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#52c41a' }}
              suffix={
                <Tag color={getTagColor(stats.newsGrowth)}>
                  {formatPercentage(stats.newsGrowth)}
                </Tag>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8} xl={4}>
          <Card variant="borderless" hoverable>
            <Statistic
              title="消息数量"
              value={stats.totalMessages}
              prefix={<MessageOutlined />}
              valueStyle={{ color: '#faad14' }}
              suffix={
                <Tag color={getTagColor(stats.messageGrowth)}>
                  {formatPercentage(stats.messageGrowth)}
                </Tag>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8} xl={6}>
          <Card variant="borderless" hoverable>
            <Statistic
              title="总访问量"
              value={stats.totalAllViews || 0}
              prefix={<EyeOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8} xl={6}>
          <Card variant="borderless" hoverable>
            <Statistic
              title="今日访问量"
              value={stats.totalViews}
              prefix={<EyeOutlined style={{ transform: 'rotate(45deg)' }} />}
              valueStyle={{ color: '#13c2c2' }}
              suffix={
                <Tag color={getTagColor(stats.viewsGrowth)}>
                  {formatPercentage(stats.viewsGrowth)}
                </Tag>
              }
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col xs={24} lg={16}>
          <Card 
            title="访问量趋势" 
            variant="borderless"
            extra={
              <Radio.Group 
                value={timeRange} 
                onChange={handleTimeRangeChange}
                optionType="button" 
                buttonStyle="solid"
                size="small"
              >
                <Radio.Button value="day">日</Radio.Button>
                <Radio.Button value="month">月</Radio.Button>
                <Radio.Button value="year">年</Radio.Button>
              </Radio.Group>
            }
          >
            <Line
              data={processedVisitData.map(item => ({
                ...item,
                访问量: item.value  // 添加中文字段
              }))}
              xField="date"
              yField="value"
              smooth
              point={{
                size: 5,
                shape: 'diamond',
              }}
              color="#1890ff"
              meta={{
                date: {
                  alias: '日期',  // 添加日期的中文别名
                },
                value: {
                  alias: '访问量',  // 添加值的中文别名
                }
              }}
              yAxis={{
                min: 0
              }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="产品分类统计" variant="borderless">
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
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col xs={24} lg={12}>
          <Card 
            title="最近消息" 
            variant="borderless"
            extra={<Button type="link" onClick={() => window.location.href = '/messages'}>查看全部</Button>}
          >
            <List
              dataSource={recentMessages}
              renderItem={item => (
                <List.Item
                  extra={
                    <Tag color={item.status === '未读' ? 'red' : 'green'}>
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
            variant="borderless"
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