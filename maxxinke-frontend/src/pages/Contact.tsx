import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Typography, Row, Col, Form, Input, Button, Card, Spin, App, message as antMessage } from 'antd';
import { 
  PhoneOutlined, 
  MailOutlined, 
  EnvironmentOutlined,
  GlobalOutlined,
  SendOutlined
} from '@ant-design/icons';
import { messageService } from '../services/messageService';
import { getContactInfo, ContactInfo } from '../services/systemService';

const { TextArea } = Input;

const ContactWrapper = styled.div`
  padding: 80px 0;
  background: linear-gradient(to bottom, #f8f9fa, #f0f2f5);
  min-height: 100vh;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
`;

const HeaderSection = styled.div`
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  padding: 60px 0 120px;
  margin-bottom: -70px;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 20%),
                      radial-gradient(circle at 90% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 20%);
    z-index: 1;
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: -50px;
    left: 0;
    right: 0;
    height: 100px;
    background: #f8f9fa;
    transform: skewY(-2deg);
    z-index: 2;
  }
`;

const HeaderTitle = styled.h1`
  text-align: center;
  font-size: 42px;
  font-weight: 700;
  color: white;
  margin-bottom: 16px;
  position: relative;
  z-index: 3;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const HeaderSubtitle = styled.p`
  text-align: center;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  z-index: 3;
`;

const ContactCard = styled(Card)`
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  border: none;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  }
  
  .ant-card-head {
    border-bottom: 1px solid #f0f0f0;
    padding: 16px 24px;
    
    .ant-card-head-title {
      font-size: 18px;
      font-weight: 600;
    }
  }
  
  .ant-card-body {
    padding: 32px;
  }
  
  .icon {
    font-size: 24px;
    color: #1890ff;
    margin-right: 16px;
    background: #e6f7ff;
    padding: 12px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    transition: all 0.3s ease;
  }

  .contact-item {
    margin-bottom: 32px;
    display: flex;
    align-items: flex-start;
    
    &:hover .icon {
      background: #1890ff;
      color: white;
      transform: scale(1.05);
    }
    
    .contact-content {
      flex: 1;
      
      .contact-label {
        font-size: 15px;
        color: #999;
        margin-bottom: 8px;
      }
      
      .contact-value {
        font-size: 16px;
        color: #333;
        font-weight: 500;
        line-height: 1.8;
      }
    }
  }
`;

const MessageCard = styled(Card)`
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  border: none;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  }
  
  .ant-card-head {
    border-bottom: 1px solid #f0f0f0;
    padding: 16px 24px;
    
    .ant-card-head-title {
      font-size: 18px;
      font-weight: 600;
    }
  }
  
  .ant-card-body {
    padding: 24px;
  }
  
  .ant-form-item-label > label {
    font-weight: 500;
    color: #333;
  }
  
  .ant-input, .ant-input-affix-wrapper, .ant-input-textarea {
    border-radius: 8px;
    padding: 12px;
    
    &:hover, &:focus {
      border-color: #1890ff;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
    }
  }
  
  .ant-btn {
    height: 46px;
    font-size: 16px;
    border-radius: 8px;
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 40px 0;
  width: 100%;
  
  .ant-spin {
    .ant-spin-dot-item {
      background-color: #1890ff;
    }
  }
`;

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  
  .anticon {
    margin-right: 8px;
  }
`;

const Contact: React.FC = () => {
  const [form] = Form.useForm();
  const [formLoading, setFormLoading] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const { message } = App.useApp();

  // 获取联系方式数据
  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        setContactLoading(true);
        const data = await getContactInfo();
        
        // 验证数据是否为空对象或所有字段为空字符串
        const isEmptyData = !data || Object.values(data).every(val => val === '');
        
        if (isEmptyData) {
          console.error('联系页面：获取的联系方式数据为空');
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
        }
      } catch (error) {
        console.error('联系页面：获取联系方式失败:', error);
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
        setContactLoading(false);
      }
    };
    
    fetchContactInfo();
  }, []);

  const handleSubmit = async (values: any) => {
    try {
      setFormLoading(true);
      await messageService.create({
        name: values.name,
        email: values.email,
        phone: values.phone,
        content: values.message
      });
      message.success('留言提交成功，我们会尽快与您联系！');
      form.resetFields();
    } catch (error) {
      message.error('提交失败，请稍后重试');
      console.error('留言提交失败:', error);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <>
      <HeaderSection>
        <Container>
          <HeaderTitle>联系我们</HeaderTitle>
          <HeaderSubtitle>让我们成为您的合作伙伴，共创美好未来</HeaderSubtitle>
        </Container>
      </HeaderSection>
    
      <ContactWrapper>
        <Container>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={12}>
              <ContactCard title="联系方式">
                {contactLoading ? (
                  <LoadingContainer>
                    <Spin size="large" />
                    <div style={{ marginTop: '16px', color: '#999' }}>加载中...</div>
                  </LoadingContainer>
                ) : contactInfo ? (
                  <>
                    <div className="contact-item">
                      <PhoneOutlined className="icon" />
                      <div className="contact-content">
                        <div className="contact-label">电话</div>
                        <div className="contact-value">{contactInfo.tel}</div>
                        <div className="contact-value">{contactInfo.mobile}</div>
                      </div>
                    </div>
                    
                    <div className="contact-item">
                      <MailOutlined className="icon" />
                      <div className="contact-content">
                        <div className="contact-label">邮箱</div>
                        <div className="contact-value">{contactInfo.email}</div>
                        <div className="contact-value">{contactInfo.serviceEmail}</div>
                      </div>
                    </div>
                    
                    <div className="contact-item">
                      <EnvironmentOutlined className="icon" />
                      <div className="contact-content">
                        <div className="contact-label">地址</div>
                        <div className="contact-value">{contactInfo.address}</div>
                        <div className="contact-value">邮编：{contactInfo.postcode}</div>
                      </div>
                    </div>
                    
                    <div className="contact-item">
                      <GlobalOutlined className="icon" />
                      <div className="contact-content">
                        <div className="contact-label">其他</div>
                        <div className="contact-value">网址：{contactInfo.website}</div>
                        <div className="contact-value">微信公众号：{contactInfo.wechat}</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div>暂无联系方式信息</div>
                )}
              </ContactCard>
            </Col>

            <Col xs={24} md={12}>
              <MessageCard title="在线留言">
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                >
                  <Form.Item
                    name="name"
                    label="姓名"
                    rules={[{ required: true, message: '请输入您的姓名' }]}
                  >
                    <Input placeholder="请输入您的姓名" />
                  </Form.Item>

                  <Form.Item
                    name="phone"
                    label="电话"
                    rules={[
                      { required: true, message: '请输入您的联系电话' },
                      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
                    ]}
                  >
                    <Input placeholder="请输入您的联系电话" />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    label="邮箱"
                    rules={[
                      { type: 'email', message: '请输入正确的邮箱地址' }
                    ]}
                  >
                    <Input placeholder="请输入您的邮箱地址" />
                  </Form.Item>

                  <Form.Item
                    name="message"
                    label="留言内容"
                    rules={[{ required: true, message: '请输入留言内容' }]}
                  >
                    <TextArea 
                      rows={5} 
                      placeholder="请输入您的留言内容、需求或问题，我们将尽快与您联系"
                      maxLength={500}
                      showCount
                    />
                  </Form.Item>

                  <Form.Item>
                    <StyledButton 
                      type="primary" 
                      htmlType="submit"
                      loading={formLoading}
                      block
                      size="large"
                      icon={<SendOutlined />}
                    >
                      提交留言
                    </StyledButton>
                  </Form.Item>
                </Form>
              </MessageCard>
            </Col>
          </Row>
        </Container>
      </ContactWrapper>
    </>
  );
};

export default Contact; 