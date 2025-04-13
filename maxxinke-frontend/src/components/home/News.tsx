import React from 'react';
import { List, Tag } from 'antd';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import './News.css';

interface NewsItem {
  id: number;
  title: string;
  description: string;
  type: string;
  date: string;
  views: number;
}

const NewsWrapper = styled.section`
  padding: 80px 0;
  
  .section-title {
    text-align: center;
    margin-bottom: 50px;
    
    h2 {
      font-size: 36px;
      margin-bottom: 20px;
    }
    
    p {
      font-size: 16px;
      color: #666;
    }
  }
`;

const NewsList = styled(List)`
  max-width: 1200px;
  margin: 0 auto;
  
  .ant-list-item {
    padding: 20px 0;
    border-bottom: 1px solid #f0f0f0;
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  .ant-list-item-meta-title {
    font-size: 18px;
    margin-bottom: 10px;
    
    a {
      color: #333;
      
      &:hover {
        color: #1890ff;
      }
    }
  }
  
  .ant-list-item-meta-description {
    color: #666;
    margin-bottom: 10px;
  }
  
  .news-meta {
    color: #999;
    font-size: 14px;
    
    .tag {
      margin-right: 15px;
    }
    
    .date {
      margin-right: 15px;
    }
  }
`;

const News: React.FC = () => {
  const newsData: NewsItem[] = [
    {
      id: 1,
      title: '麦克斯鑫科成功开发新型水处理产品',
      description: '公司最新研发的高效絮凝剂产品，在工业废水处理领域取得重大突破...',
      type: '公司新闻',
      date: '2024-01-15',
      views: 1234
    },
    {
      id: 2,
      title: '水泥行业环保新规解读',
      description: '最新环保政策对水泥行业的影响及应对措施分析...',
      type: '行业动态',
      date: '2024-01-14',
      views: 856
    },
    {
      id: 3,
      title: '水处理技术创新应用案例',
      description: '公司在某大型工业园区水处理项目中的创新技术应用...',
      type: '技术创新',
      date: '2024-01-13',
      views: 567
    }
  ];

  return (
    <NewsWrapper>
      <div className="section-title">
        <h2>新闻动态</h2>
        <p>了解公司最新动态与行业资讯</p>
      </div>
      <NewsList
        itemLayout="vertical"
        size="large"
        pagination={{
          pageSize: 3,
        }}
        dataSource={newsData}
        renderItem={(item: any) => (
          <List.Item
            key={item.id}
            extra={
              <img
                width={272}
                alt="news"
                src={`/news${item.id}.jpg`}
              />
            }
          >
            <List.Item.Meta
              title={<Link to={`/news/${item.id}`}>{item.title}</Link>}
              description={item.description}
            />
            <div className="news-meta">
              <Tag color="blue" className="tag">{item.type}</Tag>
              <span className="date">{item.date}</span>
              <span className="views">阅读量：{item.views}</span>
            </div>
          </List.Item>
        )}
      />
    </NewsWrapper>
  );
};

export default News; 