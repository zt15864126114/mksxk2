import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Tabs, Spin, Empty } from 'antd';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import api from '../services/api';

const { TabPane } = Tabs;

interface Product {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  content?: string;
  createTime?: string;
  updateTime?: string;
  status?: number;
  sort?: number;
}

const PageWrapper = styled.div`
  padding: 100px 20px 50px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 36px;
  margin-bottom: 50px;
`;

const ProductCard = styled(Card)`
  margin-bottom: 24px;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  }
  
  .ant-card-cover {
    height: 200px;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
      
      &:hover {
        transform: scale(1.1);
      }
    }
  }
  
  .ant-card-meta-title {
    font-size: 18px;
    margin-bottom: 10px;
  }
  
  .ant-card-meta-description {
    color: #666;
  }
`;

const Products: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('水处理产品');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products', {
          params: {
            status: 1, // 获取已上架的产品
            category: activeCategory
          }
        });
        setProducts(response.data.content || []);
      } catch (error) {
        console.error('获取产品列表失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory]);

  const categories = ['水处理产品', '水泥外加剂'];

  const renderProducts = (products: Product[]) => {
    if (loading) {
      return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <Empty
          description="暂无产品"
          style={{ margin: '50px 0' }}
        />
      );
    }

    return (
      <Row gutter={[24, 24]}>
        {products.map(product => (
          <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
            <Link to={`/products/${product.id}`}>
              <ProductCard
                hoverable
                cover={<img alt={product.title} src={product.image || '/default-product.jpg'} />}
              >
                <Card.Meta
                  title={product.title}
                  description={product.description}
                />
              </ProductCard>
            </Link>
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <PageWrapper>
      <Title>产品中心</Title>
      <Tabs
        centered
        activeKey={activeCategory}
        onChange={setActiveCategory}
      >
        {categories.map(category => (
          <TabPane tab={category} key={category}>
            {renderProducts(products)}
          </TabPane>
        ))}
      </Tabs>
    </PageWrapper>
  );
};

export default Products;