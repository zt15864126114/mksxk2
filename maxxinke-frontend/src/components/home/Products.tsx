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
      title: '工业自动化控制系统',
      description: '采用先进的控制算法，提供高精度、高可靠性的自动化控制解决方案',
      image: '/product1.jpg',
      category: '自动化控制'
    },
    {
      id: 2,
      title: '智能传感器系统',
      description: '高精度传感器，实时监测，数据采集与分析',
      image: '/product2.jpg',
      category: '传感器'
    },
    {
      id: 3,
      title: '工业机器人',
      description: '六轴机器人，适用于各类工业自动化场景',
      image: '/product3.jpg',
      category: '机器人'
    },
    {
      id: 4,
      title: '数据采集系统',
      description: '工业大数据采集与分析平台，助力智能制造',
      image: '/product4.jpg',
      category: '数据采集'
    }
  ];

  return (
    <ProductsWrapper>
      <div className="section-title">
        <h2>产品中心</h2>
        <p>为您提供专业的工业自动化解决方案</p>
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