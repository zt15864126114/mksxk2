import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Spin, Pagination, Empty, Input, Select, Space } from 'antd';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { newsService, News } from '../services/newsService';
import { CalendarOutlined, EyeOutlined, SearchOutlined, FileTextOutlined, TagOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;

const NewsWrapper = styled.section`
  padding: 80px 0;
  background: linear-gradient(to bottom, #f8f9fa, #f0f2f5);
  min-height: 100vh;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
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

const NewsCard = styled(Card)`
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

const NewsInfo = styled.div`
  display: flex;
  align-items: center;
  color: #999;
  font-size: 14px;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;

  span {
    display: flex;
    align-items: center;
    margin-right: 24px;

    .anticon {
      margin-right: 8px;
      font-size: 16px;
      color: #1890ff;
    }
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

const NewsPage: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [newsTypes, setNewsTypes] = useState<string[]>([]);
  const pageSize = 9;

  const fetchNewsTypes = async () => {
    try {
      const types = await newsService.getNewsTypes();
      setNewsTypes(types);
    } catch (error) {
      console.error('获取新闻类型失败:', error);
    }
  };

  useEffect(() => {
    fetchNewsTypes();
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await newsService.getNews({
          page: currentPage,
          pageSize,
          status: 1,
          type: selectedType || undefined,
          keyword: searchKeyword || undefined
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
  }, [currentPage, selectedType, searchKeyword]);

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    setCurrentPage(1); // 重置到第一页
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    setCurrentPage(1); // 重置到第一页
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <HeaderSection>
        <Container>
          <HeaderTitle>新闻动态</HeaderTitle>
          <HeaderSubtitle>了解麦克斯鑫科的最新动态、行业资讯和技术分享</HeaderSubtitle>
        </Container>
      </HeaderSection>
      
      <NewsWrapper>
        <Container>
          <FilterContainer>
            <Row gutter={[24, 16]} align="middle">
              <Col xs={24} md={12}>
                <Search
                  placeholder="搜索新闻标题或内容"
                  allowClear
                  enterButton={<><SearchOutlined /> 搜索</>}
                  size="large"
                  onSearch={handleSearch}
                />
              </Col>
              <Col xs={24} md={12}>
                <Select
                  placeholder="按新闻类型筛选"
                  style={{ width: '100%' }}
                  size="large"
                  allowClear
                  onChange={handleTypeChange}
                  value={selectedType}
                  dropdownStyle={{ padding: '8px 4px' }}
                >
                  {newsTypes.map(type => (
                    <Option key={type} value={type}>
                      <Space>
                        <TagOutlined />
                        {type}
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
          ) : news.length > 0 ? (
            <>
              <Row gutter={[32, 32]}>
                {news.map(item => (
                  <Col key={item.id} xs={24} sm={12} md={8}>
                    <Link to={`/news/${item.id}`}>
                      <NewsCard
                        hoverable
                        cover={
                          <img
                            alt={item.title}
                            src={item.image || '/placeholder.png'}
                          />
                        }
                      >
                        <NewsTitle>{item.title}</NewsTitle>
                        <NewsSummary>{item.summary}</NewsSummary>
                        <NewsInfo>
                          <span>
                            <CalendarOutlined />
                            {dayjs(item.createTime).format('YYYY-MM-DD')}
                          </span>
                          <span>
                            <EyeOutlined />
                            {item.views} 浏览
                          </span>
                        </NewsInfo>
                      </NewsCard>
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
                  showTotal={(total) => `共 ${total} 条新闻`}
                />
              </PaginationWrapper>
            </>
          ) : (
            <Empty 
              description={
                <span>
                  暂无新闻
                  {searchKeyword && `与"${searchKeyword}"相关`}
                  {selectedType && `在"${selectedType}"分类下`}
                </span>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE} 
            />
          )}
        </Container>
      </NewsWrapper>
    </>
  );
};

export default NewsPage; 