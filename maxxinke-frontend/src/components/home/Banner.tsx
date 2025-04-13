import React from 'react';
import { Carousel } from 'antd';
import styled from 'styled-components';

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
    justify-content: center;
    color: white;
    text-align: center;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);
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
    }
    
    p {
      font-size: 20px;
      margin-bottom: 30px;
      opacity: 0.9;
    }
  }
`;

const Banner: React.FC = () => {
  const banners = [
    {
      id: 1,
      image: '/banner1.jpg',
      title: '创新科技，引领未来',
      description: '专注于提供高品质的工业自动化解决方案'
    },
    {
      id: 2,
      image: '/banner2.jpg',
      title: '专业团队，优质服务',
      description: '十年行业经验，为您提供最专业的服务'
    },
    {
      id: 3,
      image: '/banner3.jpg',
      title: '全球视野，本地服务',
      description: '整合全球资源，提供本地化服务支持'
    }
  ];

  return (
    <BannerWrapper>
      <Carousel autoplay className="carousel">
        {banners.map(banner => (
          <div key={banner.id}>
            <div
              className="carousel-item"
              style={{ backgroundImage: `url(${banner.image})` }}
            >
              <div className="content">
                <h1>{banner.title}</h1>
                <p>{banner.description}</p>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </BannerWrapper>
  );
};

export default Banner; 