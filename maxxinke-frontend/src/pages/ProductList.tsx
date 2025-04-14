import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Select, Pagination, Empty, Spin } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { productService, CategoryStat } from '../services/productService';

const { Option } = Select;

const ProductListWrapper = styled.div`
  padding: 40px 0;
  background-color: #f5f5f5;
  min-height: calc(100vh - 64px - 200px); // 减去头部和底部的高度
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const FilterBar = styled.div`
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProductCard = styled(Card)`
  margin-bottom: 24px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  .ant-card-cover {
    height: 200px;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }
  }

  &:hover .ant-card-cover img {
    transform: scale(1.05);
  }
`;

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<CategoryStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Number(searchParams.get('page')) || 1;
  const currentCategory = searchParams.get('category') || 'all';
  const pageSize = 12;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productService.getCategories();
        setCategories(response);
      } catch (error) {
        console.error('获取分类失败:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getProducts({
          page: currentPage,
          pageSize,
          category: currentCategory === 'all' ? undefined : currentCategory,
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
  }, [currentPage, currentCategory]);

  const handleCategoryChange = (value: string) => {
    setSearchParams({ category: value, page: '1' });
  };

  const handlePageChange = (page: number) => {
    setSearchParams({ category: currentCategory, page: String(page) });
  };

  const handleProductClick = (id: number) => {
    navigate(`/products/${id}`);
  };

  return (
    <ProductListWrapper>
      <Container>
        <FilterBar>
          <Select
            value={currentCategory}
            onChange={handleCategoryChange}
            style={{ width: 200 }}
          >
            <Option value="all">全部分类</Option>
            {categories.map(cat => (
              <Option key={cat.category} value={cat.category}>{cat.category}</Option>
            ))}
          </Select>
        </FilterBar>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" />
          </div>
        ) : products.length > 0 ? (
          <>
            <Row gutter={[24, 24]}>
              {products.map(product => (
                <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                  <ProductCard
                    hoverable
                    cover={<img alt={product.name} src={product.image} />}
                    onClick={() => handleProductClick(product.id)}
                  >
                    <Card.Meta
                      title={product.name}
                      description={product.category}
                    />
                  </ProductCard>
                </Col>
              ))}
            </Row>
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <Pagination
                current={currentPage}
                total={total}
                pageSize={pageSize}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>
          </>
        ) : (
          <Empty description="暂无产品" />
        )}
      </Container>
    </ProductListWrapper>
  );
};

export default ProductList; 