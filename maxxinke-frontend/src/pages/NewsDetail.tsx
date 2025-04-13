import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Spin, Typography, Tag, Divider } from 'antd';
import styled from 'styled-components';
import { newsService } from '../services/newsService';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import './NewsDetail.css';

const { Title, Paragraph } = Typography;

const NewsDetailWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 80px 0;
  background: #f5f5f5;
`;

const NewsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const NewsImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const NewsContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 30px;
  
  .ant-typography {
    margin-bottom: 20px;
  }
  
  .ant-tag {
    margin-right: 10px;
  }
  
  .news-meta {
    color: #666;
    margin-bottom: 20px;
    
    span {
      margin-right: 20px;
    }
  }
`;

interface News {
  id: number;
  title: string;
  content: string;
  type: string;
  createTime: string;
  views: number;
  image?: string;
}

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        if (id) {
          const data = await newsService.getNewsById(parseInt(id));
          // 确保返回的数据包含所有必需的字段
          const newsData: News = {
            ...data,
            views: data.views || 0,
            image: data.image || `/news${id}.jpg`
          };
          setNews(newsData);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  if (loading) {
    return (
      <NewsDetailWrapper>
        <Header />
        <MainContent>
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <Spin size="large" />
          </div>
        </MainContent>
        <Footer />
      </NewsDetailWrapper>
    );
  }

  if (!news) {
    return (
      <NewsDetailWrapper>
        <Header />
        <MainContent>
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <Title level={2}>新闻不存在</Title>
          </div>
        </MainContent>
        <Footer />
      </NewsDetailWrapper>
    );
  }

  return (
    <NewsDetailWrapper>
      <Header />
      <MainContent>
        <NewsContainer>
          <Row>
            <Col span={24}>
              <NewsImage src={news.image} alt={news.title} />
            </Col>
          </Row>
          <NewsContent>
            <Title level={2}>{news.title}</Title>
            <div className="news-meta">
              <Tag color="blue">{news.type}</Tag>
              <span>发布时间：{new Date(news.createTime).toLocaleDateString()}</span>
              <span>阅读量：{news.views}</span>
            </div>
            <Divider />
            <Paragraph>{news.content}</Paragraph>
          </NewsContent>
        </NewsContainer>
      </MainContent>
      <Footer />
    </NewsDetailWrapper>
  );
};

export default NewsDetail; 