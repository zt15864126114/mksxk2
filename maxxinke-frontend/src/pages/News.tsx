import React, { useEffect, useState } from 'react';
import { List, Tag, Spin, Empty, Typography } from 'antd';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import api from '../services/api';

const { Title } = Typography;

interface NewsItem {
  id: number;
  title: string;
  description: string;
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

const PageTitle = styled(Title)`
  text-align: center;
  margin-bottom: 50px !important;
`;

const StyledListWrapper = styled.div`
  .ant-list-item {
    padding: 24px;
    background: #fff;
    border-radius: 8px;
    margin-bottom: 16px;
    transition: all 0.3s;
    
    &:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      transform: translateY(-2px);
    }
  }
  
  .ant-list-item-meta-title {
    font-size: 20px;
    margin-bottom: 12px;
    
    a {
      color: #333;
      
      &:hover {
        color: #1890ff;
      }
    }
  }
  
  .ant-list-item-meta-description {
    font-size: 14px;
    color: #666;
    margin-bottom: 16px;
  }
  
  .news-meta {
    color: #999;
    font-size: 14px;
    
    .tag {
      margin-right: 16px;
    }
    
    .date {
      margin-right: 16px;
    }
  }
  
  .ant-list-item-extra {
    img {
      width: 272px;
      height: 180px;
      object-fit: cover;
      border-radius: 4px;
    }
  }
`;

const News: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get('/news', {
          params: {
            status: 1 // 获取已发布的新闻
          }
        });
        setNews(response.data.content || []);
      } catch (error) {
        console.error('获取新闻列表失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <PageWrapper>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      </PageWrapper>
    );
  }

  if (news.length === 0) {
    return (
      <PageWrapper>
        <PageTitle level={2}>新闻动态</PageTitle>
        <Empty description="暂无新闻" />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <PageTitle level={2}>新闻动态</PageTitle>
      <StyledListWrapper>
        <List<NewsItem>
          itemLayout="vertical"
          size="large"
          dataSource={news}
          pagination={{
            pageSize: 10,
            total: news.length,
          }}
          renderItem={item => (
            <List.Item
              key={item.id}
              extra={
                item.image && (
                  <img
                    width={272}
                    alt={item.title}
                    src={item.image}
                  />
                )
              }
            >
              <List.Item.Meta
                title={<Link to={`/news/${item.id}`}>{item.title}</Link>}
                description={item.description}
              />
              <div className="news-meta">
                <Tag color="blue" className="tag">{item.type}</Tag>
                <span className="date">
                  {new Date(item.createTime).toLocaleDateString()}
                </span>
                <span className="views">阅读量：{item.views}</span>
              </div>
            </List.Item>
          )}
        />
      </StyledListWrapper>
    </PageWrapper>
  );
};

export default News; 