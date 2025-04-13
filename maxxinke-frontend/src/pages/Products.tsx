import React from 'react';
import styled from 'styled-components';
import { Card, Row, Col, Typography } from 'antd';

const { Title } = Typography;

const Container = styled.div`
  padding: 100px 50px 50px;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageTitle = styled(Title)`
  text-align: center;
  margin-bottom: 40px !important;
`;

const ProductCard = styled(Card)`
  margin-bottom: 24px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-4px);
  }

  .ant-card-cover img {
    height: 200px;
    object-fit: cover;
  }
`;

const Products: React.FC = () => {
  const products = [
    {
      id: 1,
      title: '工业自动化控制系统',
      description: '先进的自动化控制解决方案，提高生产效率',
      image: 'https://via.placeholder.com/300x200?text=Product+1'
    },
    {
      id: 2,
      title: '智能传感器系统',
      description: '高精度传感器，实时监测生产数据',
      image: 'https://via.placeholder.com/300x200?text=Product+2'
    },
    {
      id: 3,
      title: '机器人控制系统',
      description: '智能机器人控制系统，实现精准操作',
      image: 'https://via.placeholder.com/300x200?text=Product+3'
    },
    {
      id: 4,
      title: '工业物联网平台',
      description: '全方位物联网解决方案，数据实时监控',
      image: 'https://via.placeholder.com/300x200?text=Product+4'
    }
  ];

  return (
    <Container>
      <PageTitle level={2}>产品中心</PageTitle>
      <Row gutter={[24, 24]}>
        {products.map(product => (
          <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
            <ProductCard
              hoverable
              cover={<img alt={product.title} src={product.image} />}
            >
              <Card.Meta
                title={product.title}
                description={product.description}
              />
            </ProductCard>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Products;