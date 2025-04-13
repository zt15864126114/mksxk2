import React from 'react';
import { Card, Row, Col } from 'antd';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const ProductsWrapper = styled.section`
  padding: 80px 0;
  background: #f5f5f5;
  
  .section-title {
    text-align: center;
    margin-bottom: 50px;
    
    h2 {
      font-size: 36px;
      margin-bottom: 20px;
    }
    
    p {
      font-size: 16px;
      color: #666;
    }
  }
`;

const ProductCard = styled(Card)`
  margin-bottom: 30px;
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
  const products = [
    {
      id: 1,
      title: '高效絮凝剂',
      description: '高效去除水中悬浮物，适用于各类工业废水处理',
      image: '/product1.jpg',
      category: '水处理产品'
    },
    {
      id: 2,
      title: '水泥减水剂',
      description: '提高水泥性能，有效减少用水量，改善施工性能',
      image: '/product2.jpg',
      category: '水泥外加剂'
    },
    {
      id: 3,
      title: 'COD去除剂',
      description: '专业处理高COD废水，提高出水水质',
      image: '/product3.jpg',
      category: '水处理产品'
    },
    {
      id: 4,
      title: '水泥抑尘剂',
      description: '有效抑制粉尘，改善工作环境，提高生产效率',
      image: '/product4.jpg',
      category: '水泥外加剂'
    }
  ];

  return (
    <ProductsWrapper>
      <div className="section-title">
        <h2>产品中心</h2>
        <p>专业的水处理产品与水泥外加剂解决方案</p>
      </div>
      <Row gutter={[30, 30]}>
        {products.map(product => (
          <Col xs={24} sm={12} md={6} key={product.id}>
            <Link to={`/products/${product.id}`}>
              <ProductCard
                cover={<img alt={product.title} src={product.image} />}
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
    </ProductsWrapper>
  );
};

export default Products; 