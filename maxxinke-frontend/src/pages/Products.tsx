import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Spin, Pagination, Empty } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { productService, Product } from '../services/productService';
import { ArrowLeftOutlined } from '@ant-design/icons';

const ProductsWrapper = styled.section`
  padding: 80px 0;
  background: #f8f9fa;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const PageTitle = styled.h1`
  text-align: center;
  font-size: 36px;
  font-weight: 600;
  margin-bottom: 40px;
  color: #1a1a1a;
  position: relative;
  
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
`;

const BackButton = styled(Button)`
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  
  .anticon {
    margin-right: 8px;
  }
`;

const ProductCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 12px;
  overflow: hidden;
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  }

  .ant-card-cover {
    height: 240px;
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
    padding: 24px;
  }
`;

const ProductTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #1a1a1a;
  transition: color 0.3s ease;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  &:hover {
    color: #1890ff;
  }
`;

const ProductDescription = styled.p`
  color: #666;
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 76px;
`;

const ProductCategory = styled.div`
  color: #999;
  font-size: 14px;
  margin-top: 8px;
`;

const PaginationWrapper = styled.div`
  text-align: center;
  margin-top: 40px;
  
  .ant-pagination-item {
    border-radius: 4px;
    margin: 0 4px;
    
    &-active {
      background: #1890ff;
      border-color: #1890ff;
      
      a {
        color: #fff;
      }
    }
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
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 9;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getProducts({
          page: currentPage,
          pageSize,
          status: 1
        });
        setProducts(response.content);
        setTotal(response.totalElements);
      } catch (error) {
        console.error('获取产品列表失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <ProductsWrapper>
        <Container>
          <PageTitle>产品中心</PageTitle>
          <LoadingContainer>
            <Spin size="large" />
          </LoadingContainer>
        </Container>
      </ProductsWrapper>
    );
  }

  return (
    <ProductsWrapper>
      <Container>
        <PageTitle>产品中心</PageTitle>
        {/*<BackButton icon={<ArrowLeftOutlined />} onClick={handleBack}>*/}
        {/*  返回首页*/}
        {/*</BackButton>*/}
        
        {products.length > 0 ? (
          <>
            <Row gutter={[24, 24]}>
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
                      <ProductTitle>{product.name}</ProductTitle>
                      <ProductDescription>{product.description}</ProductDescription>
                      <ProductCategory>分类：{product.category}</ProductCategory>
                    </ProductCard>
                  </Link>
                </Col>
              ))}
            </Row>
            
            <PaginationWrapper>
              <Pagination
                current={currentPage}
                total={total}
                pageSize={pageSize}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </PaginationWrapper>
          </>
        ) : (
          <Empty description="暂无产品" />
        )}
      </Container>
    </ProductsWrapper>
  );
};

export default Products;