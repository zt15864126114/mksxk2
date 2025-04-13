import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Spin, Image, Typography, Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import api from '../services/api';

const { Title, Paragraph } = Typography;

interface Product {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  content: string;
  createTime: string;
  updateTime: string;
}

const PageWrapper = styled.div`
  padding: 100px 20px 50px;
  max-width: 1200px;
  margin: 0 auto;
`;

const StyledBreadcrumb = styled(Breadcrumb)`
  margin-bottom: 24px;
`;

const ProductImage = styled(Image)`
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 8px;
`;

const ContentWrapper = styled.div`
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
        
        // 记录产品访问量
        await api.post(`/product-stats/${id}/increment-views`);
      } catch (error) {
        console.error('获取产品详情失败:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <PageWrapper>
        <LoadingWrapper>
          <Spin size="large" />
        </LoadingWrapper>
      </PageWrapper>
    );
  }

  if (!product) {
    return (
      <PageWrapper>
        <Title level={3}>产品不存在</Title>
        <Link to="/products">返回产品列表</Link>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <StyledBreadcrumb>
        <Breadcrumb.Item>
          <Link to="/">首页</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/products">产品中心</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{product.title}</Breadcrumb.Item>
      </StyledBreadcrumb>

      <Row gutter={[32, 32]}>
        <Col xs={24} md={12}>
          <ProductImage
            src={product.image || '/default-product.jpg'}
            alt={product.title}
            fallback="/default-product.jpg"
          />
        </Col>
        <Col xs={24} md={12}>
          <ContentWrapper>
            <Title level={2}>{product.title}</Title>
            <Paragraph type="secondary">
              分类：{product.category}
            </Paragraph>
            <Paragraph strong>
              产品描述：
            </Paragraph>
            <Paragraph>{product.description}</Paragraph>
            <Title level={3}>产品详情</Title>
            <div dangerouslySetInnerHTML={{ __html: product.content }} />
          </ContentWrapper>
        </Col>
      </Row>
    </PageWrapper>
  );
};

export default ProductDetail; 