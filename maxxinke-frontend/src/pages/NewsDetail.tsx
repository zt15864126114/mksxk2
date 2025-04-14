import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Button, Empty } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined, EyeOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { newsService, News } from '../services/newsService';
import dayjs from 'dayjs';

const NewsDetailWrapper = styled.section`
  padding: 80px 0;
  background: #f8f9fa;
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
`;

const BackButton = styled(Button)`
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  
  .anticon {
    margin-right: 8px;
  }
`;

const NewsCard = styled.div`
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  padding: 40px;
`;

const NewsHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const NewsTitle = styled.h1`
  font-size: 32px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
`;

const NewsMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
  margin-bottom: 24px;

  span {
    display: flex;
    align-items: center;
    margin: 0 16px;

    .anticon {
      margin-right: 8px;
      font-size: 16px;
    }
  }
`;

const NewsImage = styled.div`
  margin-bottom: 32px;
  border-radius: 8px;
  overflow: hidden;
  
  img {
    width: 100%;
    max-height: 500px;
    object-fit: cover;
  }
`;

const NewsContent = styled.div`
  font-size: 16px;
  line-height: 1.8;
  color: #333;
  
  p {
    margin-bottom: 16px;
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

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await newsService.getNewsById(parseInt(id));
        setNews(data);
      } catch (error) {
        console.error('获取新闻详情失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [id]);

  const handleBack = () => {
    navigate('/news');
  };

  if (loading) {
    return (
      <NewsDetailWrapper>
        <Container>
          <LoadingContainer>
            <Spin size="large" />
          </LoadingContainer>
        </Container>
      </NewsDetailWrapper>
    );
  }

  if (!news) {
    return (
      <NewsDetailWrapper>
        <Container>
          <BackButton icon={<ArrowLeftOutlined />} onClick={handleBack}>
            返回新闻列表
          </BackButton>
          <Empty description="新闻不存在或已被删除" />
        </Container>
      </NewsDetailWrapper>
    );
  }

  return (
    <NewsDetailWrapper>
      <Container>
        <BackButton icon={<ArrowLeftOutlined />} onClick={handleBack}>
          返回新闻列表
        </BackButton>
        
        <NewsCard>
          <NewsHeader>
            <NewsTitle>{news.title}</NewsTitle>
            <NewsMeta>
              <span>
                <CalendarOutlined />
                {dayjs(news.createTime).format('YYYY-MM-DD')}
              </span>
              <span>
                <EyeOutlined />
                {news.views} 浏览
              </span>
            </NewsMeta>
          </NewsHeader>
          
          {news.image && (
            <NewsImage>
              <img src={news.image} alt={news.title} />
            </NewsImage>
          )}
          
          <NewsContent dangerouslySetInnerHTML={{ __html: news.content }} />
        </NewsCard>
      </Container>
    </NewsDetailWrapper>
  );
};

export default NewsDetail; 