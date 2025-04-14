import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Spin } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { productService, Product } from '../../services/productService';

const ProductsWrapper = styled.section`
  padding: 100px 0;
  background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 200px;
    background: linear-gradient(180deg, rgba(248,249,250,0.8) 0%, rgba(255,255,255,0) 100%);
    pointer-events: none;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 1;
`;

const SectionTitle = styled.div`
  text-align: center;
  margin-bottom: 80px;

  h2 {
    font-size: 42px;
    font-weight: 600;
    margin-bottom: 24px;
    color: #1a1a1a;
    position: relative;
    display: inline-block;

    &:after {
      content: '';
      position: absolute;
      bottom: -12px;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 4px;
      background: linear-gradient(90deg, #1890ff 0%, #69c0ff 100%);
      border-radius: 2px;
    }
  }

  p {
    color: #666;
    font-size: 18px;
    max-width: 700px;
    margin: 0 auto;
    line-height: 1.8;
  }
`;

const ProductCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 16px;
  overflow: hidden;
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  }

  .ant-card-cover {
    height: 280px;
    overflow: hidden;
    position: relative;

    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.03) 100%);
      transition: all 0.4s ease;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }
  }

  &:hover .ant-card-cover {
    &:after {
      background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.15) 100%);
    }
    
    img {
      transform: scale(1.1);
    }
  }

  .ant-card-body {
    padding: 28px;
  }

  .ant-card-meta-title {
    font-size: 22px;
    margin-bottom: 16px;
    color: #1a1a1a;
    font-weight: 600;
    transition: color 0.3s ease;
  }

  .ant-card-meta-description {
    height: 48px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    color: #666;
    font-size: 16px;
    line-height: 1.6;
  }

  &:hover .ant-card-meta-title {
    color: #1890ff;
  }
`;

const ViewMoreButton = styled(Button)`
  margin-top: 60px;
  padding: 0 48px;
  height: 48px;
  font-size: 18px;
  border-radius: 24px;
  font-weight: 500;
  box-shadow: 0 6px 16px rgba(24, 144, 255, 0.25);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(24, 144, 255, 0.35);
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 80px 0;

  .ant-spin {
    .ant-spin-dot-item {
      background-color: #1890ff;
    }
  }
`;

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getProducts({
          page: 1,
          pageSize: 3,
          status: 1
        });
        setProducts(response.content);
      } catch (error) {
        console.error('获取产品列表失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleViewMore = () => {
    navigate('/products');
    window.scrollTo(0, 0);
  };

  return (
    <ProductsWrapper>
      <Container>
        <SectionTitle>
          <h2>产品中心</h2>
          <p>专业的水处理产品和水泥添加剂解决方案</p>
        </SectionTitle>
        {loading ? (
          <LoadingContainer>
            <Spin size="large" />
          </LoadingContainer>
        ) : (
          <>
            <Row gutter={[32, 32]} justify="center">
              {products.map(product => (
                <Col key={product.id} xs={24} sm={12} md={8}>
                  <Link to={`/products/${product.id}`}>
                    <ProductCard
                      hoverable
                      cover={
                        <img
                          alt={product.name}
                          src={product.image || '/placeholder.png'}
                        />
                      }
                    >
                      <Card.Meta
                        title={product.name}
                        description={product.description}
                      />
                    </ProductCard>
                  </Link>
                </Col>
              ))}
            </Row>
            <div style={{ textAlign: 'center' }}>
              <ViewMoreButton type="primary" onClick={handleViewMore}>
                查看更多产品
              </ViewMoreButton>
            </div>
          </>
        )}
      </Container>
    </ProductsWrapper>
  );
};

export default Products; 