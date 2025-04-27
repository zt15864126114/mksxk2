import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Typography, Row, Col, Form, Input, Button, Card, Spin, App, message as antMessage } from 'antd';
import { 
  PhoneOutlined, 
  MailOutlined, 
  EnvironmentOutlined,
  GlobalOutlined,
  SendOutlined,
  WechatOutlined,
  CustomerServiceOutlined
} from '@ant-design/icons';
import { messageService } from '../services/messageService';
import { getContactInfo, ContactInfo } from '../services/systemService';
import { motion, AnimatePresence } from 'framer-motion';

const { TextArea } = Input;

const ContactWrapper = styled.div`
  padding: 0;
  background: linear-gradient(to bottom, #f8f9fa, #f0f2f5);
  min-height: 100vh;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 3;
`;

const HeaderSection = styled.div`
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  padding: 80px 0 140px;
  margin-bottom: -90px;
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

const HeaderTitle = styled(motion.h1)`
  text-align: center;
  font-size: 42px;
  font-weight: 700;
  color: white;
  margin-bottom: 20px;
  position: relative;
  z-index: 3;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const HeaderSubtitle = styled(motion.p)`
  text-align: center;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
  position: relative;
  z-index: 3;
`;

const MainContent = styled.div`
  padding: 120px 0 40px;
  position: relative;
  z-index: 3;
`;

const ContactCard = styled(motion(Card))`
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
  
  .ant-card-head {
    border-bottom: 1px solid #f0f0f0;
    padding: 16px 24px;
    background: #fafafa;
    
    .ant-card-head-title {
      font-size: 18px;
      font-weight: 600;
      color: #1890ff;
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
    border-radius: 12px;
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
        color: #666;
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

const MessageCard = styled(motion(Card))`
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
  
  .ant-card-head {
    border-bottom: 1px solid #f0f0f0;
    padding: 16px 24px;
    background: #fafafa;
    
    .ant-card-head-title {
      font-size: 18px;
      font-weight: 600;
      color: #1890ff;
    }
  }
  
  .ant-card-body {
    padding: 32px;
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
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 64px);
  background: linear-gradient(to bottom, #f8f9fa, #f0f2f5);
`;

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  
  .anticon {
    margin-right: 8px;
  }
`;

// 动画变体
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

const Contact: React.FC = () => {
  const [form] = Form.useForm();
  const [formLoading, setFormLoading] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const { message } = App.useApp();

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        setContactLoading(true);
        const data = await getContactInfo();
        const isEmptyData = !data || Object.values(data).every(val => val === '');
        
        if (isEmptyData) {
          console.error('联系页面：获取的联系方式数据为空');
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
        console.error('获取联系方式失败:', error);
        message.error('获取联系方式失败，请刷新重试');
      } finally {
        setContactLoading(false);
      }
    };

    fetchContactInfo();
  }, [message]);

  const handleSubmit = async (values: any) => {
    try {
      const { name, contact, content } = values;
      const isEmail = contact.includes('@');
      
      const messageData = {
        name,
        content,
        status: 0,
        ...(isEmail ? { email: contact, phone: '' } : { phone: contact, email: '' })
      };

      await messageService.create(messageData);
      message.success('提交成功！');
      form.resetFields();
    } catch (error) {
      console.error('提交失败:', error);
      message.error('提交失败，请稍后重试');
    }
  };

  if (contactLoading) {
    return (
      <LoadingContainer>
        <Spin size="large" />
      </LoadingContainer>
    );
  }

  return (
    <ContactWrapper>
      <HeaderSection>
        <Container>
          <HeaderTitle
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            联系我们
          </HeaderTitle>
          <HeaderSubtitle
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            如果您有任何问题或建议，欢迎随时与我们联系，我们将竭诚为您服务
          </HeaderSubtitle>
        </Container>
      </HeaderSection>

      <Container>
        <MainContent>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <ContactCard
                  variants={itemVariants}
                  title="联系方式"
                  extra={<CustomerServiceOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
                >
                  <div className="contact-item">
                    <div className="icon">
                      <PhoneOutlined />
                    </div>
                    <div className="contact-content">
                      <div className="contact-label">电话</div>
                      <div className="contact-value">{contactInfo?.mobile}</div>
                    </div>
                  </div>
                  
                  <div className="contact-item">
                    <div className="icon">
                      <MailOutlined />
                    </div>
                    <div className="contact-content">
                      <div className="contact-label">邮箱</div>
                      <div className="contact-value">{contactInfo?.email}</div>
                    </div>
                  </div>
                  
                  <div className="contact-item">
                    <div className="icon">
                      <EnvironmentOutlined />
                    </div>
                    <div className="contact-content">
                      <div className="contact-label">地址</div>
                      <div className="contact-value">{contactInfo?.address}</div>
                    </div>
                  </div>
                  
                  <div className="contact-item">
                    <div className="icon">
                      <WechatOutlined />
                    </div>
                    <div className="contact-content">
                      <div className="contact-label">微信公众号</div>
                      <div className="contact-value">{contactInfo?.wechat}</div>
                    </div>
                  </div>
                  
                  <div className="contact-item">
                    <div className="icon">
                      <GlobalOutlined />
                    </div>
                    <div className="contact-content">
                      <div className="contact-label">官方网站</div>
                      <div className="contact-value">{contactInfo?.website}</div>
                    </div>
                  </div>
                </ContactCard>
              </Col>
              
              <Col xs={24} lg={12}>
                <MessageCard
                  variants={itemVariants}
                  title="在线留言"
                  extra={<SendOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
                >
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
                      name="contact"
                      label="联系方式"
                      rules={[
                        { required: true, message: '请输入您的联系方式' },
                        {
                          validator: (_, value) => {
                            if (!value) return Promise.resolve();
                            // 邮箱格式验证
                            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                            // 手机号格式验证（中国大陆手机号）
                            const phoneRegex = /^1[3-9]\d{9}$/;
                            if (value.includes('@') && !emailRegex.test(value)) {
                              return Promise.reject('请输入有效的邮箱地址');
                            }
                            if (!value.includes('@') && !phoneRegex.test(value)) {
                              return Promise.reject('请输入有效的手机号码');
                            }
                            return Promise.resolve();
                          }
                        }
                      ]}
                    >
                      <Input placeholder="请输入您的手机号码或邮箱地址" />
                    </Form.Item>
                    
                    <Form.Item
                      name="content"
                      label="留言内容"
                      rules={[{ required: true, message: '请输入留言内容' }]}
                    >
                      <TextArea
                        placeholder="请输入您想咨询的内容"
                        rows={4}
                        showCount
                        maxLength={500}
                      />
                    </Form.Item>
                    
                    <Form.Item>
                      <StyledButton
                        type="primary"
                        htmlType="submit"
                        loading={formLoading}
                        icon={<SendOutlined />}
                      >
                        提交留言
                      </StyledButton>
                    </Form.Item>
                  </Form>
                </MessageCard>
              </Col>
            </Row>
          </motion.div>
        </MainContent>
      </Container>
    </ContactWrapper>
  );
};

export default Contact; 