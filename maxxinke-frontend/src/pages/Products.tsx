import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Card, Button, Spin, Pagination, Empty, Input, Select, Space, Tag, Divider, Skeleton } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { productService, Product, CategoryStat } from '../services/productService';
import { 
  ArrowLeftOutlined, 
  SearchOutlined, 
  AppstoreOutlined, 
  FilterOutlined,
  ShoppingOutlined,
  RightOutlined,
  ArrowUpOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';

const { Search } = Input;
const { Option } = Select;

// 页面容器
const ProductsWrapper = styled.section`
  padding: 80px 0;
  background: linear-gradient(to bottom, #f8f9fa, #f0f2f5);
  min-height: 100vh;
`;

// 内容容器
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

// 页面标题
const PageTitle = styled(motion.h1)`
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

// 返回按钮
const BackButton = styled(motion.div)`
  margin-bottom: 24px;
  
  .btn {
    display: flex;
    align-items: center;
    border-radius: 20px;
    padding: 6px 16px;
    color: #555;
    transition: all 0.3s ease;
    
    &:hover {
      color: #1890ff;
      background: rgba(24, 144, 255, 0.1);
    }
    
    .anticon {
      margin-right: 8px;
    }
  }
`;

// 产品卡片容器
const ProductCardWrapper = styled(motion.div)`
  height: 100%;
  .ant-card {
    height: 100%;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
    
    .ant-card-cover {
      overflow: hidden;
      height: 200px;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    }
  }
`;

// 产品卡片
const ProductCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 16px;
  overflow: hidden;
  border: none;
  box-shadow: 0 8px 24px rgba(149, 157, 165, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 16px 32px rgba(149, 157, 165, 0.2);
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
    padding: 28px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
`;

// 产品标题
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

// 产品描述
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

// 产品底部信息
const ProductFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
`;

// 产品分类标签
const ProductCategory = styled.div`
  display: inline-block;
  
  .ant-tag {
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 14px;
    border: none;
    background-color: #e6f7ff;
    color: #1890ff;
    transition: all 0.3s ease;
    margin-right: 8px;
    
    &:hover {
      background-color: #1890ff;
      color: white;
    }
  }
`;

// 查看详情按钮
const ViewDetail = styled.span`
  color: #1890ff;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  .anticon {
    margin-left: 4px;
    font-size: 12px;
    transition: transform 0.3s ease;
  }
  
  &:hover {
    color: #40a9ff;
    
    .anticon {
      transform: translateX(4px);
    }
  }
`;

// 分页容器
const PaginationWrapper = styled(motion.div)`
  text-align: center;
  margin-top: 60px;
  
  .ant-pagination-item {
    border-radius: 8px;
    margin: 0 4px;
    
    &-active {
      background: #1890ff;
      border-color: #1890ff;
      
      a {
        color: #fff;
      }
    }
  }
  
  .ant-pagination-prev,
  .ant-pagination-next {
    .ant-pagination-item-link {
      border-radius: 8px;
    }
  }
`;

// 加载容器
const LoadingContainer = styled(motion.div)`
  .ant-skeleton {
    margin-bottom: 24px;
    
    .ant-skeleton-image {
      height: 200px;
      border-radius: 12px;
    }
  }
`;

// 筛选容器
const FilterContainer = styled(motion.div)`
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 32px;
  
  .filter-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 24px;
    color: #1a1a1a;
    
    .anticon {
      margin-right: 8px;
      color: #1890ff;
    }
  }
  
  .category-title {
    font-size: 16px;
    margin-bottom: 12px;
    color: #4a4a4a;
    
    .anticon {
      margin-right: 8px;
      color: #1890ff;
    }
  }
`;

// 新增滚动到顶部按钮样式
const ScrollToTop = styled(motion.div)`
  position: fixed;
  bottom: 40px;
  right: 40px;
  z-index: 1000;
  cursor: pointer;
  background: #1890ff;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;

  &:hover {
    background: #40a9ff;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

// 新增骨架屏样式
const SkeletonCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 16px;
  overflow: hidden;
  border: none;
  box-shadow: 0 8px 24px rgba(149, 157, 165, 0.1);
  height: 440px;

  .ant-skeleton {
    padding: 28px;
  }

  .ant-skeleton-image {
    width: 100% !important;
    height: 240px !important;
    border-radius: 0 !important;
  }

  .ant-skeleton-content {
    padding-top: 28px;
    .ant-skeleton-title {
      margin-bottom: 16px !important;
    }
    .ant-skeleton-paragraph {
      margin-top: 16px !important;
    }
  }
`;

// 修改HeaderSection移除视差效果
const HeaderSection = styled.div`
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  padding: 80px 0 140px;
  margin-bottom: -90px;
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

// 头部标题
const HeaderTitle = styled(motion.h1)`
  text-align: center;
  font-size: 46px;
  font-weight: 700;
  color: white;
  margin-bottom: 20px;
  position: relative;
  z-index: 3;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

// 头部副标题
const HeaderSubtitle = styled(motion.p)`
  text-align: center;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  max-width: 700px;
  margin: 0 auto;
  position: relative;
  z-index: 3;
  line-height: 1.6;
`;

// 空状态容器
const EmptyContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  
  .empty-icon {
    font-size: 60px;
    color: #d9d9d9;
    margin-bottom: 24px;
  }
  
  .empty-text {
    font-size: 16px;
    color: #999;
  }
`;

// 统计信息容器
const StatsContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  margin-top: 40px;
  position: relative;
  z-index: 3;
`;

// 统计项
const StatItem = styled.div`
  text-align: center;
  margin: 0 20px;
  padding: 0 20px;
  color: white;
  position: relative;
  
  &:not(:last-child):after {
    content: '';
    position: absolute;
    right: -20px;
    top: 50%;
    transform: translateY(-50%);
    height: 40px;
    width: 1px;
    background: rgba(255, 255, 255, 0.2);
  }
  
  .stat-value {
    font-size: 30px;
    font-weight: 700;
  }
  
  .stat-label {
    font-size: 14px;
    opacity: 0.8;
    margin-top: 5px;
  }
`;

// 动画变体
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

const headerVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      delay: 0.2
    }
  }
};

const subtitleVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      delay: 0.3
    }
  }
};

const statsVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      delay: 0.4
    }
  }
};

const statItemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const filterVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      delay: 0.3
    }
  }
};

const cardVariants = {
  hidden: (i: number) => ({
    opacity: 0,
    y: 50,
    scale: 0.9,
    x: i % 2 === 0 ? -30 : 30
  }),
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

const paginationVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.5,
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const emptyVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      delay: 0.2
    }
  }
};

// 组件实现
const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState<CategoryStat[]>([]);
  const navigate = useNavigate();
  const pageSize = 9;

  const { scrollY } = useScroll();
  const [showScrollTop, setShowScrollTop] = useState(false);

  // 监听滚动显示/隐藏回到顶部按钮
  useEffect(() => {
    const unsubscribe = scrollY.onChange(latest => {
      setShowScrollTop(latest > 500);
    });
    return () => unsubscribe();
  }, [scrollY]);

  // 获取类别数据
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productService.getCategories();
        setCategories(response);
      } catch (error) {
        console.error('获取产品类别失败:', error);
      }
    };

    fetchCategories();
  }, []);

  // 获取产品数据
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getProducts({
          page: currentPage,
          pageSize,
          keyword: searchKeyword,
          category: selectedCategory,
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
  }, [currentPage, searchKeyword, selectedCategory]);

  // 使用 useCallback 和 setTimeout 实现防抖
  const debouncedSearch = useCallback((value: string) => {
    const timer = setTimeout(() => {
      setSearchKeyword(value);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // 处理搜索
  const handleSearch = (value: string) => {
    debouncedSearch(value);
  };

  // 处理类别变更
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  // 处理分页变更
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 返回首页
  const handleBack = () => {
    navigate('/');
  };

  // 计算类别总数
  const totalProducts = categories.reduce((acc, curr) => acc + curr.count, 0);

  // 滚动到顶部
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <HeaderSection>
        <Container>
          <HeaderTitle
            initial="hidden"
            animate="visible"
            variants={headerVariants}
          >
            产品中心
          </HeaderTitle>
          <HeaderSubtitle
            initial="hidden"
            animate="visible"
            variants={subtitleVariants}
          >
            专业的水处理产品和水泥添加剂解决方案，为您提供全面的水处理技术支持
          </HeaderSubtitle>
          
          <StatsContainer
            initial="hidden"
            animate="visible"
            variants={statsVariants}
          >
            <motion.div variants={statItemVariants}>
              <StatItem>
                <div className="stat-value">{totalProducts}</div>
                <div className="stat-label">产品总数</div>
              </StatItem>
            </motion.div>
            <motion.div variants={statItemVariants}>
              <StatItem>
                <div className="stat-value">{categories.length}</div>
                <div className="stat-label">产品类别</div>
              </StatItem>
            </motion.div>
            <motion.div variants={statItemVariants}>
              <StatItem>
                <div className="stat-value">100%</div>
                <div className="stat-label">品质保证</div>
              </StatItem>
            </motion.div>
          </StatsContainer>
        </Container>
      </HeaderSection>
      
      <ProductsWrapper>
        <Container>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <BackButton variants={itemVariants}>
              <Button type="link" onClick={handleBack} className="btn">
                <ArrowLeftOutlined /> 返回首页
              </Button>
            </BackButton>
            
            <FilterContainer
              initial="hidden"
              animate="visible"
              variants={filterVariants}
            >
              <div className="filter-title">
                <FilterOutlined /> 产品搜索与筛选
              </div>
              
              <Row gutter={[24, 16]}>
                <Col xs={24} md={12}>
                  <div className="filter-categories">
                    <div className="category-title">
                      <AppstoreOutlined /> 产品类别
                    </div>
                    <Select
                      placeholder="选择产品类别"
                      allowClear
                      style={{ width: '100%' }}
                      onChange={handleCategoryChange}
                      size="large"
                      value={selectedCategory || undefined}
                    >
                      {categories.map((category) => (
                        <Option key={category.category} value={category.category}>
                          {category.category} ({category.count})
                        </Option>
                      ))}
                    </Select>
                  </div>
                </Col>
                
                <Col xs={24} md={12}>
                  <div className="category-title">
                    <SearchOutlined /> 关键词搜索
                  </div>
                  <Search
                    placeholder="输入产品名称或关键词"
                    allowClear
                    enterButton={<SearchOutlined />}
                    size="large"
                    onSearch={handleSearch}
                    value={searchKeyword}
                    onChange={(e) => {
                      if (e.target.value === '') {
                        handleSearch('');
                      }
                    }}
                  />
                </Col>
              </Row>
            </FilterContainer>
            
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  key="skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Row gutter={[24, 24]}>
                    {Array.from({ length: pageSize }).map((_, index) => (
                      <Col key={`skeleton-${index}`} xs={24} sm={12} md={8}>
                        <SkeletonCard>
                          <Skeleton 
                            active 
                            avatar={{ shape: 'square', size: 240 }} 
                            paragraph={{ rows: 3 }} 
                          />
                        </SkeletonCard>
                      </Col>
                    ))}
                  </Row>
                </motion.div>
              ) : products.length > 0 ? (
                <motion.div 
                  key="products"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Row gutter={[24, 24]}>
                    {products.map((item, index) => (
                      <Col key={item.id} xs={24} sm={12} md={8}>
                        <ProductCardWrapper
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true, amount: 0.2 }}
                          variants={cardVariants}
                          custom={index}
                          whileHover="hover"
                        >
                          <Link to={`/products/${item.id}`}>
                            <ProductCard
                              hoverable
                              cover={
                                <img
                                  alt={item.name}
                                  src={item.image || '/placeholder.png'}
                                />
                              }
                            >
                              <ProductTitle>{item.name}</ProductTitle>
                              <ProductDescription>{item.description}</ProductDescription>
                              <ProductFooter>
                                <ProductCategory>
                                  <Tag icon={<AppstoreOutlined />}>{item.category || '未分类'}</Tag>
                                </ProductCategory>
                                <ViewDetail>
                                  查看详情 <RightOutlined />
                                </ViewDetail>
                              </ProductFooter>
                            </ProductCard>
                          </Link>
                        </ProductCardWrapper>
                      </Col>
                    ))}
                  </Row>
                  <PaginationWrapper 
                    initial="hidden"
                    animate="visible"
                    variants={paginationVariants}
                  >
                    <Pagination
                      current={currentPage}
                      total={total}
                      pageSize={pageSize}
                      onChange={handlePageChange}
                      showSizeChanger={false}
                      showTotal={(total) => `共 ${total} 条产品`}
                    />
                  </PaginationWrapper>
                </motion.div>
              ) : (
                <EmptyContainer 
                  key="empty"
                  initial="hidden"
                  animate="visible"
                  variants={emptyVariants}
                >
                  <ShoppingOutlined className="empty-icon" />
                  <div className="empty-text">
                    {searchKeyword || selectedCategory ? 
                      `没有找到${selectedCategory ? `分类为"${selectedCategory}"的` : ''}${searchKeyword ? `包含"${searchKeyword}"的` : ''}产品` : 
                      '暂无产品数据'}
                  </div>
                </EmptyContainer>
              )}
            </AnimatePresence>
          </motion.div>
        </Container>
      </ProductsWrapper>

      <AnimatePresence>
        {showScrollTop && (
          <ScrollToTop
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={scrollToTop}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowUpOutlined />
          </ScrollToTop>
        )}
      </AnimatePresence>
    </>
  );
};

export default Products;