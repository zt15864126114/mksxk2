import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Input, Button, Spin, App } from 'antd';
import { PhoneOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { getContactInfo, ContactInfo } from '../../services/systemService';

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
  
  .loading-container {
    text-align: center;
    padding: 10px 0;
  }
`;

const Footer: React.FC = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        setLoading(true);
        console.log('Footer组件(Layout)：开始获取联系方式数据');
        
        const data = await getContactInfo();
        
        // 验证数据是否为空对象或所有字段为空字符串
        const isEmptyData = !data || Object.values(data).every(val => val === '');
        
        if (isEmptyData) {
          console.error('Footer组件(Layout)：获取的联系方式数据为空');
          // 设置默认数据，确保页面显示内容
          setContactInfo({
            tel: '400-123-4567',
            mobile: '138 8888 8888',
            email: 'contact@maxxinke.com',
            serviceEmail: 'service@maxxinke.com',
            address: '上海市浦东新区张江高科技园区',
            postcode: '518000',
            website: 'www.maxxinke.com',
            wechat: '麦克斯鑫科'
          });
        } else {
          setContactInfo(data);
        }
      } catch (error) {
        console.error('Footer组件(Layout)：获取联系方式失败:', error);
        // 设置默认数据，确保页面显示内容
        setContactInfo({
          tel: '400-123-4567',
          mobile: '138 8888 8888',
          email: 'contact@maxxinke.com',
          serviceEmail: 'service@maxxinke.com',
          address: '上海市浦东新区张江高科技园区',
          postcode: '518000',
          website: 'www.maxxinke.com',
          wechat: '麦克斯鑫科'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchContactInfo();
  }, []);

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
            {loading ? (
              <div className="loading-container">
                <Spin size="small" />
              </div>
            ) : contactInfo ? (
              <>
                <div className="contact-item">
                  <PhoneOutlined />
                  <span>{contactInfo.tel}</span>
                </div>
                <div className="contact-item">
                  <MailOutlined />
                  <span>{contactInfo.email}</span>
                </div>
                <div className="contact-item">
                  <EnvironmentOutlined />
                  <span>{contactInfo.address}</span>
                </div>
              </>
            ) : (
              <div>暂无联系方式信息</div>
            )}
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
          <p>© {new Date().getFullYear()} 麦克斯鑫科技 版权所有</p>
        </div>
      </div>
    </StyledFooter>
  );
};

export default Footer; 