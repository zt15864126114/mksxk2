import React, { useState, useEffect } from 'react';
import { List, Card, Pagination, Empty, Spin } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { newsService } from '../services/newsService';

const NewsListWrapper = styled.div`
  padding: 40px 0;
  background-color: #f5f5f5;
  min-height: calc(100vh - 64px - 200px);
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const NewsCard = styled(Card)`
  margin-bottom: 24px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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

  .news-meta {
    margin-top: 16px;
    color: #999;
    font-size: 14px;
  }
`;

const NewsList: React.FC = () => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Number(searchParams.get('page')) || 1;
  const pageSize = 10;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await newsService.getNewsList({
          page: currentPage,
          pageSize,
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
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setSearchParams({ page: String(page) });
  };

  const handleNewsClick = (id: number) => {
    navigate(`/news/${id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <NewsListWrapper>
      <Container>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" />
          </div>
        ) : news.length > 0 ? (
          <>
            <List
              grid={{ gutter: 24, xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 3 }}
              dataSource={news}
              renderItem={item => (
                <List.Item>
                  <NewsCard
                    hoverable
                    cover={<img alt={item.title} src={item.image} />}
                    onClick={() => handleNewsClick(item.id)}
                  >
                    <Card.Meta
                      title={item.title}
                      description={item.summary}
                    />
                    <div className="news-meta">
                      发布时间：{formatDate(item.createTime)}
                    </div>
                  </NewsCard>
                </List.Item>
              )}
            />
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
          <Empty description="暂无新闻" />
        )}
      </Container>
    </NewsListWrapper>
  );
};

export default NewsList; 