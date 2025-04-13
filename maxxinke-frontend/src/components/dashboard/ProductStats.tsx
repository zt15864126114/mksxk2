import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, List } from 'antd';
import { Line, Column } from '@ant-design/plots';
import { 
  ShoppingOutlined, 
  RiseOutlined, 
  EyeOutlined 
} from '@ant-design/icons';
import { 
  ProductStats, 
  CategoryStat, 
  ProductTrend,
  productStatsService 
} from '../../services/productStatsService';

const ProductStatsComponent: React.FC = () => {
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
  const [trends, setTrends] = useState<ProductTrend[]>([]);
  const [hotProducts, setHotProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, categoryData, trendsData, hotData] = await Promise.all([
          productStatsService.getProductStats(),
          productStatsService.getCategoryStats(),
          productStatsService.getProductTrends(),
          productStatsService.getHotProducts(5)
        ]);

        setStats(statsData);
        setCategoryStats(categoryData);
        setTrends(trendsData);
        setHotProducts(hotData);
      } catch (error) {
        console.error('获取统计数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="product-stats">
      {/* 统计卡片 */}
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card loading={loading}>
            <Statistic
              title="产品总数"
              value={stats?.total || 0}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card loading={loading}>
            <Statistic
              title="本月新增"
              value={stats?.monthNew || 0}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card loading={loading}>
            <Statistic
              title="总访问量"
              value={stats?.totalViews || 0}
              prefix={<EyeOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 趋势图表 */}
      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col span={12}>
          <Card title="产品新增趋势" loading={loading}>
            <Line
              data={trends}
              xField="month"
              yField="count"
              point={{
                size: 5,
                shape: 'diamond',
              }}
              label={{
                style: {
                  fill: '#aaa',
                },
              }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="产品分类统计" loading={loading}>
            <Column
              data={categoryStats}
              xField="category"
              yField="count"
              label={{
                position: 'middle',
                style: {
                  fill: '#FFFFFF',
                  opacity: 0.6,
                },
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* 热门产品列表 */}
      <Row style={{ marginTop: '20px' }}>
        <Col span={24}>
          <Card title="热门产品" loading={loading}>
            <List
              dataSource={hotProducts}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={item.name}
                    description={`访问量: ${item.views}`}
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

export default ProductStatsComponent; 