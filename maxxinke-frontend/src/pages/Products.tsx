import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Spin, Pagination, Empty, Input, Select, Space } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { productService, Product, CategoryStat } from '../services/productService';
import { ArrowLeftOutlined, SearchOutlined, ExperimentOutlined, AppstoreOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;

const ProductsWrapper = styled.section`
  padding: 80px 0;
  background: linear-gradient(to bottom, #f8f9fa, #f0f2f5);
  min-height: 100vh;
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
  margin-bottom: 50px;
  color: #1a1a1a;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -15px;
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
  height: 100%;
  display: flex;
  flex-direction: column;

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
    flex-grow: 1;
    display: flex;
    flex-direction: column;
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
  line-height: 1.4;

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
  flex-grow: 1;
`;

const ProductCategory = styled.div`
  color: #999;
  font-size: 14px;
  margin-top: 8px;
  display: inline-block;
  background-color: #f5f5f5;
  padding: 4px 12px;
  border-radius: 16px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #e6f7ff;
    color: #1890ff;
  }
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

const FilterContainer = styled.div`
  margin-bottom: 40px;
  padding: 24px 30px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
  
  .ant-input-group-wrapper {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    border-radius: 8px;
    overflow: hidden;
  }
  
  .ant-select {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    border-radius: 8px;
    overflow: hidden;
  }
`;

const HeaderSection = styled.div`
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  padding: 60px 0 120px;
  margin-bottom: -70px;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 20%),
                      radial-gradient(circle at 90% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 20%);
    z-index: 1;
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: -50px;
    left: 0;
    right: 0;
    height: 100px;
    background: #f8f9fa;
    transform: skewY(-2deg);
    z-index: 2;
  }
`;

const HeaderTitle = styled.h1`
  text-align: center;
  font-size: 42px;
  font-weight: 700;
  color: white;
  margin-bottom: 16px;
  position: relative;
  z-index: 3;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const HeaderSubtitle = styled.p`
  text-align: center;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  z-index: 3;
`;

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState<CategoryStat[]>([]);
  const pageSize = 9;
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const response = await productService.getCategories();
      setCategories(response);
    } catch (error) {
      console.error('获取产品分类失败:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getProducts({
          page: currentPage,
          pageSize,
          status: 1,
          category: selectedCategory || undefined,
          keyword: searchKeyword || undefined
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
  }, [currentPage, selectedCategory, searchKeyword]);

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    setCurrentPage(1); // 重置到第一页
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1); // 重置到第一页
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <>
      <HeaderSection>
        <Container>
          <HeaderTitle>产品中心</HeaderTitle>
          <HeaderSubtitle>探索麦克斯鑫科的高品质产品，为您的项目提供专业解决方案</HeaderSubtitle>
        </Container>
      </HeaderSection>
      
      <ProductsWrapper>
        <Container>
          <FilterContainer>
            <Row gutter={[24, 16]} align="middle">
              <Col xs={24} md={12}>
                <Search
                  placeholder="搜索产品名称或描述"
                  allowClear
                  enterButton={<><SearchOutlined /> 搜索</>}
                  size="large"
                  onSearch={handleSearch}
                />
              </Col>
              <Col xs={24} md={12}>
                <Select
                  placeholder="按产品分类筛选"
                  style={{ width: '100%' }}
                  size="large"
                  allowClear
                  onChange={handleCategoryChange}
                  value={selectedCategory}
                  dropdownStyle={{ padding: '8px 4px' }}
                >
                  {categories.map(category => (
                    <Option key={category.category} value={category.category}>
                      <Space>
                        <AppstoreOutlined />
                        {category.category} ({category.count})
                      </Space>
                    </Option>
                  ))}
                </Select>
              </Col>
            </Row>
          </FilterContainer>
          
          {loading ? (
            <LoadingContainer>
              <Spin size="large" />
            </LoadingContainer>
          ) : products.length > 0 ? (
            <>
              <Row gutter={[32, 32]}>
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
                        <ProductCategory>
                          <ExperimentOutlined style={{ marginRight: '6px' }} />
                          {product.category}
                        </ProductCategory>
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
                  showTotal={(total) => `共 ${total} 个产品`}
                />
              </PaginationWrapper>
            </>
          ) : (
            <Empty 
              description={
                <span>
                  暂无产品
                  {searchKeyword && `与"${searchKeyword}"相关`}
                  {selectedCategory && `在"${selectedCategory}"分类下`}
                </span>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE} 
            />
          )}
        </Container>
      </ProductsWrapper>
    </>
  );
};

export default Products;