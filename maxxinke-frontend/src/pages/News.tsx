import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Spin, Pagination, Empty, Input, Select, Space, Tag, Divider } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { newsService, News } from '../services/newsService';
import { 
  ArrowLeftOutlined,
  CalendarOutlined, 
  EyeOutlined, 
  SearchOutlined, 
  FileTextOutlined, 
  TagOutlined, 
  ReadOutlined,
  RightOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { motion, AnimatePresence } from 'framer-motion';

const { Search } = Input;
const { Option } = Select;

// 页面容器
const NewsWrapper = styled.section`
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

// 头部区域
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

// 新闻卡片包装器
const NewsCardWrapper = styled(motion.div)`
  height: 100%;
  margin-bottom: 24px;
`;

// 新闻卡片
const NewsCard = styled(Card)`
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

// 新闻标题
const NewsTitle = styled.h3`
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

// 新闻摘要
const NewsSummary = styled.p`
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

// 新闻信息
const NewsInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #999;
  font-size: 14px;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;

  .news-meta {
    display: flex;
    align-items: center;
    
    span {
      display: flex;
      align-items: center;
      margin-right: 16px;

      .anticon {
        margin-right: 8px;
        font-size: 16px;
        color: #1890ff;
      }
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

// 新闻标签
const NewsTag = styled(Tag)`
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 5;
  font-size: 12px;
  padding: 4px 12px;
  border: none;
  border-radius: 20px;
  background: rgba(24, 144, 255, 0.8);
  color: white;
  box-shadow: 0 2px 6px rgba(24, 144, 255, 0.3);
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
const LoadingContainer = styled.div`
  text-align: center;
  padding: 80px 0;

  .ant-spin {
    .ant-spin-dot-item {
      background-color: #1890ff;
    }
  }
`;

// 筛选容器
const FilterContainer = styled(motion.div)`
  margin-bottom: 40px;
  padding: 28px 32px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(149, 157, 165, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 12px 30px rgba(149, 157, 165, 0.15);
  }
  
  .filter-title {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    font-size: 18px;
    font-weight: 600;
    color: #1a1a1a;
    
    .anticon {
      margin-right: 10px;
      color: #1890ff;
      font-size: 20px;
    }
  }
  
  .filter-divider {
    margin: 20px 0;
  }
  
  .ant-input-search {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    border-radius: 8px;
    overflow: hidden;
    
    .ant-input {
      padding: 12px 16px;
      height: 48px;
      font-size: 15px;
    }
    
    .ant-btn {
      height: 48px;
      width: 60px;
    }
  }
  
  .filter-types {
    .type-title {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      font-weight: 500;
      color: #555;
      font-size: 15px;
      
      .anticon {
        margin-right: 8px;
        color: #1890ff;
      }
    }
    
    .ant-select {
      width: 100%;
      
      .ant-select-selector {
        border-radius: 8px;
        padding: 5px 15px;
        height: 46px;
        display: flex;
        align-items: center;
        font-size: 15px;
      }
    }
  }
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

// 动画变体
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
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
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      delay: 0.2,
      stiffness: 100
    }
  }
};

const subtitleVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      delay: 0.4,
      stiffness: 100
    }
  }
};

const statsVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      delay: 0.6,
      stiffness: 100
    }
  }
};

const filterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      delay: 0.6,
      stiffness: 100
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      delay: 0.1 * i,
      stiffness: 100,
      damping: 15
    }
  }),
  exit: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.3
    }
  }
};

const paginationVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.8,
      duration: 0.5
    }
  }
};

const emptyVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

// 组件实现
const NewsPage: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [newsTypes, setNewsTypes] = useState<string[]>([]);
  const navigate = useNavigate();
  const pageSize = 9;

  // 获取新闻类别
  useEffect(() => {
    const fetchNewsTypes = async () => {
      try {
        const response = await newsService.getNewsTypes();
        setNewsTypes(response);
      } catch (error) {
        console.error('获取新闻类别失败:', error);
      }
    };

    fetchNewsTypes();
  }, []);

  // 获取新闻列表
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await newsService.getNews({
          page: currentPage,
          pageSize,
          keyword: searchKeyword,
          type: selectedType,
          status: 1
        });
        setNews(response.content);
        setTotal(response.totalElements);
      } catch (error) {
        console.error('获取新闻列表失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [currentPage, searchKeyword, selectedType]);

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    setCurrentPage(1);
  };

  // 处理类型变更
  const handleTypeChange = (value: string) => {
    setSelectedType(value);
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

  // 统计数据
  const latestNews = news.length > 0 ? dayjs(news[0].createTime).format('YYYY-MM-DD') : '--';
  
  return (
    <>
      <HeaderSection>
        <Container>
          <HeaderTitle
            initial="hidden"
            animate="visible"
            variants={headerVariants}
          >
            新闻动态
          </HeaderTitle>
          <HeaderSubtitle
            initial="hidden"
            animate="visible"
            variants={subtitleVariants}
          >
            了解最新的公司动态和行业资讯，保持与我们同步
          </HeaderSubtitle>
          
          <StatsContainer
            initial="hidden"
            animate="visible"
            variants={statsVariants}
          >
            <StatItem>
              <div className="stat-value">{total}</div>
              <div className="stat-label">新闻总数</div>
            </StatItem>
            <StatItem>
              <div className="stat-value">{newsTypes.length}</div>
              <div className="stat-label">新闻类别</div>
            </StatItem>
            <StatItem>
              <div className="stat-value">{latestNews}</div>
              <div className="stat-label">最新发布</div>
            </StatItem>
          </StatsContainer>
        </Container>
      </HeaderSection>
      
      <NewsWrapper>
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
                <SearchOutlined /> 新闻搜索与筛选
              </div>
              
              <Row gutter={[24, 16]}>
                <Col xs={24} md={12}>
                  <div className="filter-types">
                    <div className="type-title">
                      <TagOutlined /> 新闻类型
                    </div>
                    <Select
                      placeholder="选择新闻类型"
                      allowClear
                      style={{ width: '100%' }}
                      onChange={handleTypeChange}
                      size="large"
                      value={selectedType || undefined}
                    >
                      {newsTypes.map((type) => (
                        <Option key={type} value={type}>
                          {type}
                        </Option>
                      ))}
                    </Select>
                  </div>
                </Col>
                
                <Col xs={24} md={12}>
                  <div className="type-title">
                    <FileTextOutlined /> 关键词搜索
                  </div>
                  <Search
                    placeholder="输入关键词搜索新闻"
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
            
            {loading ? (
              <LoadingContainer>
                <Spin size="large" tip="正在加载新闻..." />
              </LoadingContainer>
            ) : news.length > 0 ? (
              <>
                <AnimatePresence>
                  <Row gutter={[24, 24]}>
                    {news.map((item, index) => (
                      <Col key={item.id} xs={24} sm={12} md={8}>
                        <NewsCardWrapper
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          variants={cardVariants}
                          custom={index}
                          layoutId={`news-${item.id}`}
                          whileHover={{ scale: 1.02 }}
                        >
                          <Link to={`/news/${item.id}`}>
                            <NewsCard
                              hoverable
                              cover={
                                <div style={{ position: 'relative' }}>
                                  <img
                                    alt={item.title}
                                    src={item.image || '/placeholder.png'}
                                  />
                                  {item.type && (
                                    <NewsTag color="blue">{item.type}</NewsTag>
                                  )}
                                </div>
                              }
                            >
                              <NewsTitle>{item.title}</NewsTitle>
                              <NewsSummary>{item.summary}</NewsSummary>
                              <NewsInfo>
                                <div className="news-meta">
                                  <span>
                                    <CalendarOutlined />
                                    {dayjs(item.createTime).format('YYYY-MM-DD')}
                                  </span>
                                  <span>
                                    <EyeOutlined />
                                    {item.views}
                                  </span>
                                </div>
                                <ViewDetail>
                                  阅读全文 <RightOutlined />
                                </ViewDetail>
                              </NewsInfo>
                            </NewsCard>
                          </Link>
                        </NewsCardWrapper>
                      </Col>
                    ))}
                  </Row>
                </AnimatePresence>
                
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
                    showTotal={(total) => `共 ${total} 条新闻`}
                  />
                </PaginationWrapper>
              </>
            ) : (
              <EmptyContainer
                initial="hidden"
                animate="visible"
                variants={emptyVariants}
              >
                <ReadOutlined className="empty-icon" />
                <div className="empty-text">
                  {searchKeyword || selectedType ? 
                    `没有找到${selectedType ? `类型为"${selectedType}"的` : ''}${searchKeyword ? `包含"${searchKeyword}"的` : ''}新闻` : 
                    '暂无新闻数据'}
                </div>
              </EmptyContainer>
            )}
          </motion.div>
        </Container>
      </NewsWrapper>
    </>
  );
};

export default NewsPage; 