import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Row, Col, Divider, Spin, App } from 'antd';
import { PhoneOutlined, MailOutlined, EnvironmentOutlined, GlobalOutlined } from '@ant-design/icons';
import { getContactInfo, checkApiConnection, ContactInfo } from '../../services/systemService';
import { Link } from 'react-router-dom';

const FooterWrapper = styled.footer`
  background-color: #f5f5f5;
  padding: 40px 0 20px;
  color: #666;
`;

const ContactSection = styled.div`
  margin-bottom: 30px;
`;

const ContactTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 20px;
  position: relative;
  padding-left: 10px;
  font-weight: 600;
  
  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 18px;
    background-color: #1890ff;
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 15px;
  font-size: 14px;
  
  .icon {
    margin-right: 10px;
    font-size: 16px;
    color: #1890ff;
  }
  
  .multi-line {
    display: flex;
    flex-direction: column;
  }
`;

const Copyright = styled.div`
  text-align: center;
  padding: 15px 0;
  font-size: 14px;
  color: #999;
`;

const Footer: React.FC = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();
  
  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        setLoading(true);
        // console.log('Footer组件：开始获取联系方式数据');
        
        // 首先检查API连接
        try {
          await checkApiConnection();
        } catch (error) {
          console.error('Footer组件：API连接测试失败', error);
          message.error('连接API失败，无法获取最新联系方式');
        }
        
        const data = await getContactInfo();
        // console.log('Footer组件：获取到联系方式数据', data);
        
        // 验证数据是否为空对象或所有字段为空字符串
        const isEmptyData = !data || Object.values(data).every(val => val === '');
        
        if (isEmptyData) {
          console.error('Footer组件：获取的联系方式数据为空');
          message.warning('获取联系方式失败，显示默认数据');
          // 设置默认数据，确保页面显示内容
          setContactInfo({
            tel: '0755-12345678',
            mobile: '138 8888 8888',
            email: 'info@maxxinke.com',
            serviceEmail: 'service@maxxinke.com',
            address: '深圳市宝安区新安街道某某工业园A栋5楼',
            postcode: '518000',
            website: 'www.maxxinke.com',
            wechat: '麦克斯鑫科'
          });
        } else {
          setContactInfo(data);
          message.success('获取最新联系方式成功');
        }
      } catch (error) {
        console.error('Footer组件：获取联系方式失败:', error);
        message.error('获取联系方式失败，显示默认数据');
        // 设置默认数据，确保页面显示内容
        setContactInfo({
          tel: '0755-12345678',
          mobile: '138 8888 8888',
          email: 'info@maxxinke.com',
          serviceEmail: 'service@maxxinke.com',
          address: '深圳市宝安区新安街道某某工业园A栋5楼',
          postcode: '518000',
          website: 'www.maxxinke.com',
          wechat: '麦克斯鑫科'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchContactInfo();
  }, [message]);
  
  return (
    <FooterWrapper>
      <div className="container">
        <Row gutter={[30, 0]} justify="center">
          <Col xs={24} sm={24} md={8} lg={8}>
            <ContactSection>
              <ContactTitle>联系方式</ContactTitle>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <Spin />
                  <div style={{ marginTop: '10px', color: '#999' }}>加载中...</div>
                </div>
              ) : contactInfo ? (
                <>
                  <ContactItem>
                    <PhoneOutlined className="icon" />
                    <div className="multi-line">
                      <span>电话：{contactInfo.tel}</span>
                      <span>手机：{contactInfo.mobile}</span>
                    </div>
                  </ContactItem>
                  <ContactItem>
                    <MailOutlined className="icon" />
                    <div className="multi-line">
                      <span>邮箱：{contactInfo.email}</span>
                      <span>客服：{contactInfo.serviceEmail}</span>
                    </div>
                  </ContactItem>
                  <ContactItem>
                    <EnvironmentOutlined className="icon" />
                    <div className="multi-line">
                      <span>地址：{contactInfo.address}</span>
                      <span>邮编：{contactInfo.postcode}</span>
                    </div>
                  </ContactItem>
                  <ContactItem>
                    <GlobalOutlined className="icon" />
                    <div className="multi-line">
                      <span>网址：{contactInfo.website}</span>
                      <span>微信公众号：{contactInfo.wechat}</span>
                    </div>
                  </ContactItem>
                </>
              ) : (
                <div>暂无联系方式信息</div>
              )}
            </ContactSection>
          </Col>
          
          <Col xs={24} sm={24} md={8} lg={8}>
            <ContactSection>
              <ContactTitle>快速链接</ContactTitle>
              <ContactItem>
                <Link to="/">首页</Link>
              </ContactItem>
              <ContactItem>
                <Link to="/products">产品中心</Link>
              </ContactItem>
              <ContactItem>
                <Link to="/news">新闻动态</Link>
              </ContactItem>
              <ContactItem>
                <Link to="/about">关于我们</Link>
              </ContactItem>
            </ContactSection>
          </Col>
          
          <Col xs={24} sm={24} md={8} lg={8}>
            <ContactSection>
              <ContactTitle>关注我们</ContactTitle>
              <div style={{ marginTop: '15px' }}>
                {/* 这里可以放置二维码图片 */}
                <img 
                  src="/images/qrcode.jpg" 
                  alt="微信公众号" 
                  style={{ 
                    width: '120px', 
                    height: '120px',
                    display: 'block',
                    margin: '0 auto'
                  }} 
                />
                <p style={{ textAlign: 'center', marginTop: '10px' }}>
                  扫码关注微信公众号
                </p>
              </div>
            </ContactSection>
          </Col>
        </Row>
        
        <Divider style={{ margin: '10px 0 20px' }} />
        
        <Copyright>
          © {new Date().getFullYear()} 麦克斯鑫科. All Rights Reserved.
        </Copyright>
      </div>
    </FooterWrapper>
  );
};

export default Footer; 