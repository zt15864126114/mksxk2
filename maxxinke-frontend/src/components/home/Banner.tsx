import React from 'react';
import { Carousel, Button } from 'antd';
import styled from 'styled-components';
import { ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// 添加动画组件
const MotionDiv = motion.div;

const BannerWrapper = styled.div`
  height: 100vh;
  position: relative;
  
  .carousel {
    height: 100%;
  }
  
  .carousel-item {
    height: 100vh;
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: white;
    text-align: left;
    padding-left: 10%;
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        135deg, 
        rgba(0, 21, 41, 0.7) 0%, 
        rgba(24, 144, 255, 0.4) 100%
      );
    }
  }
  
  .content {
    position: relative;
    z-index: 1;
    max-width: 800px;
    padding: 0 20px;
    
    h1 {
      font-size: 48px;
      margin-bottom: 20px;
      font-weight: bold;
      color: #fff;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    }
    
    p {
      font-size: 22px;
      margin-bottom: 30px;
      opacity: 0.95;
      line-height: 1.6;
      color: #fff;
      text-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
    }
  }

  .slick-dots {
    bottom: 40px;
    
    li button {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.5);
    }
    
    li.slick-active button {
      background: #1890ff;
      width: 24px;
      border-radius: 6px;
    }
  }

  .ant-carousel .slick-dots-bottom {
    bottom: 30px;
  }
`;

const ExploreButton = styled(Button)`
  height: 48px;
  padding: 0 30px;
  font-size: 16px;
  border-radius: 24px;
  background: #1890ff;
  border: none;
  font-weight: 500;
  box-shadow: 0 6px 16px rgba(0, 115, 230, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    background: #40a9ff;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 115, 230, 0.4);
  }
  
  .anticon {
    margin-left: 8px;
    font-size: 14px;
  }
`;

// 动画变体
const titleVariants = {
  hidden: { opacity: 0, y: 50 },
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
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8, 
      delay: 0.3, 
      ease: "easeOut" 
    } 
  }
};

const buttonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6, 
      delay: 0.6, 
      ease: "easeOut" 
    } 
  }
};

const Banner: React.FC = () => {
  const navigate = useNavigate();
  
  const banners = [
    {
      id: 1,
      image: '/banner1.jpg',
      title: '专业水处理产品制造商',
      description: '致力于提供高品质的水处理产品和水泥外加剂解决方案，以先进技术和优质服务为客户创造价值。',
      buttonText: '了解我们的产品',
      link: '/products'
    },
    {
      id: 2,
      image: '/banner2.jpg',
      title: '创新环保技术',
      description: '以创新科技助力环保事业，打造绿色可持续发展，为水资源保护和环境改善贡献力量。',
      buttonText: '探索环保技术',
      link: '/about'
    },
    {
      id: 3,
      image: '/banner3.jpg',
      title: '优质服务保障',
      description: '专业的技术团队，为您提供全方位的技术支持和服务，确保您的每一次使用都能获得满意的效果。',
      buttonText: '联系我们',
      link: '/contact'
    }
  ];

  const handleButtonClick = (link: string) => {
    navigate(link);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <BannerWrapper>
      <Carousel autoplay effect="fade" className="carousel">
        {banners.map(banner => (
          <div key={banner.id}>
            <div
              className="carousel-item"
              style={{ backgroundImage: `url(${banner.image})` }}
            >
              <div className="content">
                <MotionDiv
                  initial="hidden"
                  animate="visible"
                  variants={titleVariants}
                >
                  <h1>{banner.title}</h1>
                </MotionDiv>
                
                <MotionDiv
                  initial="hidden"
                  animate="visible"
                  variants={descriptionVariants}
                >
                  <p>{banner.description}</p>
                </MotionDiv>
                
                <MotionDiv
                  initial="hidden"
                  animate="visible"
                  variants={buttonVariants}
                >
                  <ExploreButton 
                    type="primary" 
                    size="large"
                    onClick={() => handleButtonClick(banner.link)}
                  >
                    {banner.buttonText}
                    <ArrowRightOutlined />
                  </ExploreButton>
                </MotionDiv>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </BannerWrapper>
  );
};

export default Banner; 