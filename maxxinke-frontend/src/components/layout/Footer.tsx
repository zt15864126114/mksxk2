import React from 'react';
import { Layout, Row, Col, Input, Button } from 'antd';
import { PhoneOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Footer: AntFooter } = Layout;

const StyledFooter = styled(AntFooter)`
  background: #001529;
  color: #fff;
  padding: 60px 0 20px;
  
  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .footer-title {
    font-size: 18px;
    margin-bottom: 20px;
    color: #fff;
  }
  
  .contact-item {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    
    .anticon {
      margin-right: 10px;
      font-size: 16px;
    }
  }
  
  .footer-bottom {
    text-align: center;
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid rgba(255,255,255,0.1);
  }
  
  .subscribe-form {
    display: flex;
    margin-top: 20px;
    
    .ant-input {
      margin-right: 10px;
    }
  }
`;

const Footer: React.FC = () => {
  return (
    <StyledFooter>
      <div className="footer-content">
        <Row gutter={[40, 40]}>
          <Col xs={24} sm={12} md={8}>
            <h3 className="footer-title">关于我们</h3>
            <p>麦克斯鑫科技专注于工业自动化领域，致力于为客户提供高品质的自动化解决方案。</p>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <h3 className="footer-title">联系方式</h3>
            <div className="contact-item">
              <PhoneOutlined />
              <span>400-123-4567</span>
            </div>
            <div className="contact-item">
              <MailOutlined />
              <span>contact@maxxinke.com</span>
            </div>
            <div className="contact-item">
              <EnvironmentOutlined />
              <span>上海市浦东新区张江高科技园区</span>
            </div>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <h3 className="footer-title">订阅我们</h3>
            <p>订阅我们的新闻通讯，获取最新产品信息和行业动态</p>
            <div className="subscribe-form">
              <Input placeholder="请输入您的邮箱" />
              <Button type="primary">订阅</Button>
            </div>
          </Col>
        </Row>
        <div className="footer-bottom">
          <p>© 2024 麦克斯鑫科技 版权所有</p>
        </div>
      </div>
    </StyledFooter>
  );
};

export default Footer; 