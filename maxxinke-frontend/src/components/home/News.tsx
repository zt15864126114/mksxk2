import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Spin } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { newsService } from '../../services/newsService';
import { CalendarOutlined, EyeOutlined, ArrowRightOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';

const NewsWrapper = styled.section`
  padding: 100px 0;
  background: #ffffff;
  position: relative;
  overflow: hidden;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 200px;
    background: linear-gradient(0deg, rgba(248,249,250,0.8) 0%, rgba(255,255,255,0) 100%);
    pointer-events: none;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 1;
`;

const SectionTitle = styled.div`
  text-align: center;
  margin-bottom: 80px;
`;

const AnimatedTitle = styled(motion.h2)`
  font-size: 42px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #1a1a1a;
  position: relative;
  display: inline-block;

  &:after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #1890ff 0%, #69c0ff 100%);
    border-radius: 2px;
  }
`;

const AnimatedDescription = styled(motion.p)`
  color: #666;
  font-size: 18px;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.8;
`;

const NewsCardWrapper = styled(motion.div)`
  height: 100%;
  margin-bottom: 24px;
`;

const NewsCard = styled(Card)`
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

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
    padding: 28px;
  }
`;

const NewsTitle = styled.h3`
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1a1a1a;
  transition: color 0.3s ease;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  &:hover {
    color: #1890ff;
  }
`;

const NewsDescription = styled.p`
  color: #666;
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 76px;
`;

const NewsInfo = styled.div`
  display: flex;
  align-items: center;
  color: #999;
  font-size: 14px;

  span {
    display: flex;
    align-items: center;
    margin-right: 24px;

    .anticon {
      margin-right: 8px;
      font-size: 16px;
    }
  }
`;

const ViewMoreButton = styled(motion.div)`
  display: inline-block;
  margin-top: 60px;
  
  .btn {
    padding: 0 48px;
    height: 50px;
    font-size: 18px;
    border-radius: 25px;
    font-weight: 500;
    box-shadow: 0 6px 16px rgba(24, 144, 255, 0.25);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    
    .icon {
      margin-left: 8px;
      font-size: 16px;
      transition: transform 0.3s ease;
    }
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(24, 144, 255, 0.35);
      
      .icon {
        transform: translateX(4px);
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

// 定义动画变体
const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8,
      ease: "easeOut" 
    } 
  }
};

const descriptionVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8,
      delay: 0.2,
      ease: "easeOut" 
    } 
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6,
      delay: 0.1 * i,
      ease: "easeOut" 
    } 
  })
};

const buttonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6,
      delay: 0.8,
      ease: "easeOut" 
    } 
  },
  tap: { 
    scale: 0.98 
  }
};

const News: React.FC = () => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await newsService.getNews({
          page: 1,
          pageSize: 3,
          status: 1
        });
        setNews(response.content);
      } catch (error) {
        console.error('获取新闻列表失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleViewMore = () => {
    navigate('/news');
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <NewsWrapper>
      <Container>
        <SectionTitle>
          <AnimatedTitle
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={titleVariants}
          >
            新闻动态
          </AnimatedTitle>
          <AnimatedDescription
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={descriptionVariants}
          >
            了解最新的公司动态和行业资讯
          </AnimatedDescription>
        </SectionTitle>
        
        {loading ? (
          <LoadingContainer>
            <Spin size="large" />
          </LoadingContainer>
        ) : (
          <>
            <Row gutter={[24, 24]}>
              {news.map((item, index) => (
                <Col key={item.id} xs={24} md={8}>
                  <NewsCardWrapper
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    custom={index}
                    variants={cardVariants}
                  >
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
                        <NewsDescription>{item.description}</NewsDescription>
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
                  </NewsCardWrapper>
                </Col>
              ))}
            </Row>
            
            <div style={{ textAlign: 'center' }}>
              <ViewMoreButton
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={buttonVariants}
                whileTap="tap"
              >
                <Button type="primary" className="btn" onClick={handleViewMore}>
                  查看更多新闻
                  <ArrowRightOutlined className="icon" />
                </Button>
              </ViewMoreButton>
            </div>
          </>
        )}
      </Container>
    </NewsWrapper>
  );
};

export default News; 