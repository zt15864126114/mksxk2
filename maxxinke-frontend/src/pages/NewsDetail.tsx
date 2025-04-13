import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Spin, Tag, Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import api from '../services/api';

const { Title, Paragraph } = Typography;

interface NewsItem {
  id: number;
  title: string;
  content: string;
  type: string;
  image: string;
  createTime: string;
  views: number;
}

const PageWrapper = styled.div`
  padding: 100px 20px 50px;
  max-width: 1200px;
  margin: 0 auto;
`;

const StyledBreadcrumb = styled(Breadcrumb)`
  margin-bottom: 24px;
`;

const ContentWrapper = styled.div`
  padding: 32px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const NewsImage = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 24px;
`;

const NewsMeta = styled.div`
  margin: 16px 0 24px;
  color: #999;
  font-size: 14px;
  
  .tag {
    margin-right: 16px;
  }
  
  .date {
    margin-right: 16px;
  }
`;

const NewsContent = styled.div`
  font-size: 16px;
  line-height: 1.8;
  color: #333;
  
  img {
    max-width: 100%;
    height: auto;
    margin: 16px 0;
  }
  
  p {
    margin-bottom: 16px;
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<NewsItem | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get(`/news/${id}`);
        setNews(response.data);
      } catch (error) {
        console.error('获取新闻详情失败:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNews();
    }
  }, [id]);

  if (loading) {
    return (
      <PageWrapper>
        <LoadingWrapper>
          <Spin size="large" />
        </LoadingWrapper>
      </PageWrapper>
    );
  }

  if (!news) {
    return (
      <PageWrapper>
        <Title level={3}>新闻不存在</Title>
        <Link to="/news">返回新闻列表</Link>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <StyledBreadcrumb>
        <Breadcrumb.Item>
          <Link to="/">首页</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/news">新闻动态</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{news.title}</Breadcrumb.Item>
      </StyledBreadcrumb>

      <ContentWrapper>
        <Title level={2}>{news.title}</Title>
        <NewsMeta>
          <Tag color="blue" className="tag">{news.type}</Tag>
          <span className="date">
            {new Date(news.createTime).toLocaleDateString()}
          </span>
          <span className="views">阅读量：{news.views}</span>
        </NewsMeta>
        {news.image && (
          <NewsImage src={news.image} alt={news.title} />
        )}
        <NewsContent dangerouslySetInnerHTML={{ __html: news.content }} />
      </ContentWrapper>
    </PageWrapper>
  );
};

export default NewsDetail; 