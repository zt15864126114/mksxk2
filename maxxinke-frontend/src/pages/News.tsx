import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Spin, Pagination, Empty, Input, Select, Space, Tag, Divider, Skeleton } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { newsService, News, NewsType } from '../services/newsService';
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

// Simplified StyledCardProps for now
interface StyledCardProps {}

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
const HeaderSection = styled(motion.section)`
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
const StatItem = styled(motion.div)`
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
    color: white;
  }
  
  .stat-label {
    font-size: 14px;
    opacity: 0.8;
    margin-top: 5px;
    color: white;
  }
`;

// 新闻列表项容器
const NewsListItem = styled(motion.div)`
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  gap: 24px;
  cursor: pointer;
  transform-origin: center left;
  perspective: 1000px;
  transition: box-shadow 0.3s ease;
`;

// 新闻图片容器
const NewsImage = styled(motion.div)`
  flex: 0 0 280px;
  height: 180px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  transform-origin: center center;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.2) 100%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  ${NewsListItem}:hover &::after {
    opacity: 1;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

// 新闻内容容器
const NewsContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

// 新闻标题
const NewsTitle = styled(motion.h3)`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #1a1a1a;
  transition: color 0.3s ease;

  ${NewsListItem}:hover & {
    color: #1890ff;
  }
`;

// 新闻摘要
const NewsSummary = styled(motion.p)`
  color: #666;
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-grow: 1;
`;

// 新闻信息
const NewsInfo = styled(motion.div)`
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
    gap: 16px;

    span {
      display: flex;
      align-items: center;

      .anticon {
        margin-right: 8px;
        font-size: 16px;
        color: #1890ff;
      }
    }
  }
`;

// 查看详情按钮
const ViewDetail = styled(motion.span)`
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
const NewsTag = styled(motion(Tag))`
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
    margin-bottom: 24px;
    font-size: 18px;
    font-weight: 600;
    color: #1a1a1a;
    
    .anticon {
      margin-right: 10px;
      color: #1890ff;
      font-size: 20px;
    }
  }
  
  .filter-row {
    display: flex;
    align-items: center;
    gap: 24px;
    
    .filter-col {
      flex: 1;
      
      .type-title {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        font-weight: 500;
        color: #555;
        font-size: 15px;
        
        .anticon {
          margin-right: 8px;
          color: #1890ff;
        }
      }
    }
  }
  
  .ant-select, 
  .ant-input-search {
    width: 100%;
  }

  .ant-input-search {
    .ant-input-group-wrapper {
       vertical-align: middle;
    }
    .ant-input-search-button {
      height: 40px;
      border-radius: 0 8px 8px 0 !important;
      background: #1890ff !important;
      border-color: #1890ff !important;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &:hover {
        background: #40a9ff !important;
        border-color: #40a9ff !important;
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
  hidden: { 
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      // 移除 staggerChildren 和 delayChildren，因为动画由滚动触发
      // staggerChildren: 0.15,
      // delayChildren: 0.5
    }
  }
};

// 更新动画变体
const itemVariants = {
  hidden: (i: number) => ({
    opacity: 0,
    x: i % 2 === 0 ? -100 : 100, // 保持左右交替
    scale: 0.9,
    filter: "blur(5px)"
  }),
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 15,
      mass: 0.8
      // 移除 delay，因为触发由滚动决定
      // delay: i * 0.05
    }
  },
  hover: {
    scale: 1.03,
    y: -10,
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  },
  tap: {
    scale: 0.97,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
};

const imageVariants = {
  hidden: { 
    opacity: 0,
    scale: 0.8,
    rotate: -5
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  },
  hover: {
    scale: 1.1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

// 更新页面容器动画
const pageVariants = {
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.3
    }
  },
  hidden: {
    opacity: 0,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.2
    }
  }
};

// 更新头部区域动画
const headerVariants = {
  hidden: { 
    opacity: 0,
    y: -100,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      mass: 1,
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// 更新标题动画
const titleVariants = {
  hidden: { 
    opacity: 0,
    y: -50,
    scale: 0.8
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20
    }
  }
};

// 更新副标题动画
const subtitleVariants = {
  hidden: { 
    opacity: 0,
    y: 30
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 15,
      delay: 0.2
    }
  }
};

// 更新统计数字动画
const statsVariants = {
  hidden: { 
    opacity: 0,
    scale: 0.5
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
      delay: 0.4,
      staggerChildren: 0.1
    }
  }
};

const statItemVariants = {
  hidden: { 
    opacity: 0,
    y: 20,
    scale: 0.8
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15
    }
  }
};

// 更新筛选容器动画
const filterVariants = {
  hidden: { 
    opacity: 0,
    y: 50,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 15,
      delay: 0.6
    }
  }
};

// 修改组件实现
const NewsPage: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [newsTypes, setNewsTypes] = useState<NewsType[]>([]);
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
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={pageVariants}
    >
      <HeaderSection
        as={motion.section}
        variants={headerVariants}
      >
        <Container>
          <HeaderTitle
            as={motion.h1}
            variants={titleVariants}
          >
            新闻动态
          </HeaderTitle>
          <HeaderSubtitle
            as={motion.p}
            variants={subtitleVariants}
          >
            了解最新的公司动态和行业资讯，保持与我们同步
          </HeaderSubtitle>
          
          <StatsContainer
            as={motion.div}
            variants={statsVariants}
          >
            <StatItem as={motion.div} variants={statItemVariants}>
              <motion.div 
                className="stat-value"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  transition: { 
                    type: "spring",
                    delay: 0.6,
                    duration: 0.8 
                  }
                }}
              >
                {total}
              </motion.div>
              <div className="stat-label">新闻总数</div>
            </StatItem>
            <StatItem as={motion.div} variants={statItemVariants}>
              <motion.div 
                className="stat-value"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  transition: { 
                    type: "spring",
                    delay: 0.7,
                    duration: 0.8 
                  }
                }}
              >
                {newsTypes.length}
              </motion.div>
              <div className="stat-label">新闻类别</div>
            </StatItem>
            <StatItem as={motion.div} variants={statItemVariants}>
              <motion.div 
                className="stat-value"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  transition: { 
                    type: "spring",
                    delay: 0.8,
                    duration: 0.8 
                  }
                }}
              >
                {latestNews}
              </motion.div>
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
            <BackButton 
              as={motion.div}
              initial={{ opacity: 0, x: -30 }}
              animate={{ 
                opacity: 1, 
                x: 0,
                transition: {
                  type: "spring",
                  delay: 0.8
                }
              }}
            >
              <Button type="link" onClick={handleBack} className="btn">
                <ArrowLeftOutlined /> 返回首页
              </Button>
            </BackButton>
            
            <FilterContainer
              as={motion.div}
              variants={filterVariants}
            >
              <motion.div 
                className="filter-title"
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    delay: 0.9
                  }
                }}
              >
                <SearchOutlined /> 新闻搜索与筛选
              </motion.div>
              
              <motion.div 
                className="filter-row"
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    delay: 1
                  }
                }}
              >
                <div className="filter-col">
                  <div className="type-title">
                    <TagOutlined /> 新闻类型
                  </div>
                  <Select
                    placeholder="选择新闻类型"
                    allowClear
                    onChange={handleTypeChange}
                    value={selectedType || undefined}
                    size="large"
                  >
                    {newsTypes.map((type) => (
                      <Option key={type.id} value={type.name}>
                        {type.name}
                      </Option>
                    ))}
                  </Select>
                </div>
                
                <div className="filter-col">
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
                </div>
              </motion.div>
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
                  {Array.from({ length: 5 }).map((_, index) => (
                    <NewsListItem key={`skeleton-${index}`}>
                      <Skeleton.Image style={{ width: 280, height: 180, borderRadius: 8 }} />
                      <div style={{ flex: 1 }}>
                        <Skeleton active paragraph={{ rows: 3 }} />
                      </div>
                    </NewsListItem>
                  ))}
                </motion.div>
              ) : news.length > 0 ? (
                <motion.div
                  key="news"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {news.map((item, index) => (
                    <NewsListItem
                      key={item.id}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.2 }}
                      variants={itemVariants}
                      whileHover="hover"
                      whileTap="tap"
                      custom={index}
                      onClick={() => navigate(`/news/${item.id}`)}
                      layoutId={`news-${item.id}`}
                    >
                      <NewsImage variants={imageVariants}>
                        <motion.img
                          alt={item.title}
                          src={item.image || '/placeholder.png'}
                          initial={{ scale: 1.2 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.6 }}
                        />
                        {item.type && (
                          <NewsTag
                            color="blue"
                            initial={{ opacity: 0, y: -20, scale: 0.8 }}
                            animate={{ 
                              opacity: 1, 
                              y: 0, 
                              scale: 1,
                              transition: {
                                type: "spring",
                                stiffness: 500,
                                damping: 15
                              }
                            }}
                            whileHover={{ scale: 1.05 }}
                          >
                            {item.type}
                          </NewsTag>
                        )}
                      </NewsImage>
                      <NewsContent>
                        <NewsTitle
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          {item.title}
                        </NewsTitle>
                        <NewsSummary
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          {item.summary}
                        </NewsSummary>
                        <NewsInfo
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <div className="news-meta">
                            <motion.span
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.4 }}
                            >
                              <CalendarOutlined />{dayjs(item.createTime).format('YYYY-MM-DD')}
                            </motion.span>
                            <motion.span
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.5 }}
                            >
                              <EyeOutlined />{item.views}
                            </motion.span>
                          </div>
                          <ViewDetail
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                            whileHover={{
                              x: 5,
                              transition: { duration: 0.2 }
                            }}
                          >
                            阅读全文 <RightOutlined />
                          </ViewDetail>
                        </NewsInfo>
                      </NewsContent>
                    </NewsListItem>
                  ))}
                  <PaginationWrapper
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0, 
                      scale: 1,
                      transition: {
                        type: "spring",
                        stiffness: 100,
                        damping: 15,
                        delay: 0.8
                      }
                    }}
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
                </motion.div>
              ) : (
                <EmptyContainer
                  key="empty"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    y: 0,
                    transition: {
                      type: "spring",
                      stiffness: 100,
                      damping: 15,
                      delay: 0.2
                    }
                  }}
                >
                  <ReadOutlined className="empty-icon" />
                  <div className="empty-text">
                    {searchKeyword || selectedType ? 
                      `没有找到${selectedType ? `类型为"${selectedType}"的` : ''}${searchKeyword ? `包含"${searchKeyword}"的` : ''}新闻` : 
                      '暂无新闻数据'}
                  </div>
                </EmptyContainer>
              )}
            </AnimatePresence>
          </motion.div>
        </Container>
      </NewsWrapper>
    </motion.div>
  );
};

export default NewsPage; 