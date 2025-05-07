import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Row, Col } from 'antd';
import { getContactInfo } from '../../services/systemService';
import type { ContactInfo } from '../../services/systemService';

const FooterWrapper = styled.footer`
  background: #001529;
  padding: 60px 0 40px;
  color: rgba(255, 255, 255, 0.85);
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const Title = styled.h3`
  color: #fff;
  font-size: 18px;
  margin-bottom: 20px;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -8px;
    width: 40px;
    height: 2px;
    background: #1890ff;
  }
`;

const Description = styled.p`
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.8;
  margin-bottom: 20px;
`;

const ContactInfo = styled.div`
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.65);
  
  svg {
    font-size: 16px;
    color: #1890ff;
  }
`;

const QuickLinks = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
`;

const StyledLink = styled(Link)`
  color: rgba(255, 255, 255, 0.65);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    color: #1890ff;
    transform: translateX(5px);
    
    svg {
      transform: translateX(3px);
    }
  }
  
  svg {
    transition: transform 0.3s ease;
  }
`;

const Footer: React.FC = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    tel: '',
    mobile: '',
    email: '',
    serviceEmail: '',
    address: '',
    postcode: '',
    website: '',
    wechat: ''
  });
  
  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        // console.log('Footer组件：开始获取联系方式数据');
        const data = await getContactInfo();
        // console.log('Footer组件：获取到联系方式数据', data);
        setContactInfo(data);
      } catch (error) {
        console.error('Footer组件：获取联系方式失败:', error);
      }
    };
    
    fetchContactInfo();
  }, []);

  const quickLinks = [
    { title: '产品中心', path: '/products' },
    { title: '新闻动态', path: '/news' },
    { title: '关于我们', path: '/about' },
    { title: '联系我们', path: '/contact' }
  ];

  return (
    <FooterWrapper>
      <Container>
        <Row gutter={[40, 40]}>
          <Col xs={24} sm={24} md={8}>
            <Section>
              <Title>关于我们</Title>
              <Description>
                麦克斯鑫科（山东）新型材料科技有限公司是一家专业从事水处理产品和水泥外加剂的研发、设计、生产与销售的企业。
              </Description>
            </Section>
          </Col>
          
          <Col xs={24} sm={12} md={8}>
            <Section>
              <Title>联系方式</Title>
            
              {contactInfo.mobile && (
                <ContactInfo>
                  <span>电话：{contactInfo.mobile}</span>
                </ContactInfo>
              )}
              {contactInfo.email && (
                <ContactInfo>
                  <span>邮箱：{contactInfo.email}</span>
                </ContactInfo>
              )}
              {contactInfo.address && (
                <ContactInfo>
                  <span>地址：{contactInfo.address}</span>
                </ContactInfo>
              )}
            
            </Section>
          </Col>
          
          <Col xs={24} sm={12} md={8}>
            <Section>
              <Title>快速导航</Title>
              <QuickLinks>
                {quickLinks.map((link, index) => (
                  <StyledLink to={link.path} key={index}>
                    <span>{link.title}</span>
                    <svg 
                      viewBox="0 0 24 24" 
                      width="16" 
                      height="16" 
                      fill="currentColor"
                    >
                      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                    </svg>
                  </StyledLink>
                ))}
              </QuickLinks>
            </Section>
          </Col>
        </Row>
      </Container>
    </FooterWrapper>
  );
};

export default Footer; 

