import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Row, Col, Spin, Typography, Tag, Divider } from 'antd';
import styled from 'styled-components';
import { productService, Product } from '../services/productService';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const { Title, Paragraph } = Typography;

const ProductDetailWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 80px 0;
  background: #f5f5f5;
`;

const ProductContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const ProductImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const ProductInfo = styled.div`
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  .ant-typography {
    margin-bottom: 20px;
  }
  
  .ant-tag {
    margin-right: 10px;
  }
`;

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (id) {
          const data = await productService.getProductById(parseInt(id));
          setProduct(data);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <ProductDetailWrapper>
        <Header />
        <MainContent>
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <Spin size="large" />
          </div>
        </MainContent>
        <Footer />
      </ProductDetailWrapper>
    );
  }

  if (!product) {
    return (
      <ProductDetailWrapper>
        <Header />
        <MainContent>
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <Title level={2}>产品不存在</Title>
          </div>
        </MainContent>
        <Footer />
      </ProductDetailWrapper>
    );
  }

  return (
    <ProductDetailWrapper>
      <Header />
      <MainContent>
        <ProductContainer>
          <Row gutter={[40, 40]}>
            <Col xs={24} md={12}>
              <ProductImage src={product.image} alt={product.title} />
            </Col>
            <Col xs={24} md={12}>
              <ProductInfo>
                <Title level={2}>{product.title}</Title>
                <Tag color="blue">{product.category}</Tag>
                <Divider />
                <Paragraph>{product.description}</Paragraph>
                <div>
                  <strong>创建时间：</strong>
                  {new Date(product.createTime).toLocaleDateString()}
                </div>
                <div>
                  <strong>更新时间：</strong>
                  {new Date(product.updateTime).toLocaleDateString()}
                </div>
              </ProductInfo>
            </Col>
          </Row>
        </ProductContainer>
      </MainContent>
      <Footer />
    </ProductDetailWrapper>
  );
};

export default ProductDetail; 