import React, { useState, useEffect } from 'react';
import { Row, Col, Skeleton, Card, Tag, Typography, Divider, Space, Breadcrumb } from 'antd';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { newsService, News } from '../services/newsService';
import { CalendarOutlined, EyeOutlined, TagOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Paragraph } = Typography;

const NewsDetailWrapper = styled.section`
  padding: 80px 0;
  background: linear-gradient(to bottom, #f8f9fa, #f0f2f5);
  min-height: 100vh;
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 16px;
`;

const DetailCard = styled(Card)`
  border-radius: 12px;
  overflow: hidden;
  border: none;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
  
  .ant-card-body {
    padding: 40px;
    
    @media (max-width: 768px) {
      padding: 24px;
    }
  }
`;

const NewsImage = styled.div`
  width: 100%;
  height: 400px;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 24px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  @media (max-width: 768px) {
    height: 240px;
  }
`;

const NewsInfo = styled.div`
  display: flex;
  align-items: center;
  color: #999;
  font-size: 14px;
  margin: 24px 0;
  flex-wrap: wrap;

  .info-item {
    display: flex;
    align-items: center;
    margin-right: 24px;
    margin-bottom: 8px;
    
    .anticon {
      margin-right: 8px;
      font-size: 16px;
      color: #1890ff;
    }
  }
`;

const ContentWrapper = styled.div`
  line-height: 1.8;
  font-size: 16px;
  color: #333;
  
  p {
    margin-bottom: 16px;
  }
  
  img {
    max-width: 100%;
    border-radius: 8px;
    margin: 16px 0;
  }
`;

const BreadcrumbWrapper = styled.div`
  margin-bottom: 24px;
  
  .ant-breadcrumb {
    font-size: 14px;
    
    a {
      color: #1890ff;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  margin-top: 24px;
  color: #1890ff;
  font-size: 16px;
  
  .anticon {
    margin-right: 8px;
  }
  
  &:hover {
    text-decoration: underline;
  }
`;

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      if (!id || isNaN(Number(id))) {
        setError('无效的新闻ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // 获取新闻详情（此方法内部会调用浏览量增加接口）
        const data = await newsService.getNewsById(Number(id));
        setNews(data);
        
        // 设置页面标题
        document.title = `${data.title} - 麦克斯鑫科`;
      } catch (error) {
        console.error('获取新闻详情失败:', error);
        setError('获取新闻详情失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
    
    // 清理函数
    return () => {
      document.title = '麦克斯鑫科';
    };
  }, [id]);

  if (loading) {
    return (
      <NewsDetailWrapper>
        <Container>
          <DetailCard>
            <Skeleton active avatar paragraph={{ rows: 10 }} />
          </DetailCard>
        </Container>
      </NewsDetailWrapper>
    );
  }

  if (error || !news) {
    return (
      <NewsDetailWrapper>
        <Container>
          <DetailCard>
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Title level={4} style={{ color: '#ff4d4f' }}>{error || '新闻不存在'}</Title>
              <BackButton to="/news">
                <ArrowLeftOutlined /> 返回新闻列表
              </BackButton>
            </div>
          </DetailCard>
        </Container>
      </NewsDetailWrapper>
    );
  }

  return (
    <NewsDetailWrapper>
      <Container>
        <BreadcrumbWrapper>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/">首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/news">新闻动态</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{news.title}</Breadcrumb.Item>
          </Breadcrumb>
        </BreadcrumbWrapper>
        
        <DetailCard>
          <Title level={2}>{news.title}</Title>
          
          <NewsInfo>
            <div className="info-item">
              <CalendarOutlined />
              {dayjs(news.createTime).format('YYYY-MM-DD')}
            </div>
            <div className="info-item">
              <TagOutlined />
              {news.type || '未分类'}
            </div>
            <div className="info-item">
              <EyeOutlined />
              {news.views || 0} 浏览
            </div>
          </NewsInfo>
          
          {news.image && (
            <NewsImage>
              <img src={news.image} alt={news.title} />
            </NewsImage>
          )}
          
          <ContentWrapper 
            dangerouslySetInnerHTML={{ __html: news.content.replace(/\n/g, '<br/>') }} 
          />
          
          <Divider />
          
          <BackButton to="/news">
            <ArrowLeftOutlined /> 返回新闻列表
          </BackButton>
        </DetailCard>
      </Container>
    </NewsDetailWrapper>
  );
};

export default NewsDetail; 