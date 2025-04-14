import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Typography, Row, Col, Form, Input, Button, message, Card, Spin, App } from 'antd';
import { 
  PhoneOutlined, 
  MailOutlined, 
  EnvironmentOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import { messageService } from '../services/messageService';
import { getContactInfo, ContactInfo } from '../services/systemService';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const ContactWrapper = styled.div`
  padding: 60px 0;
  background-color: #f5f5f5;
  min-height: calc(100vh - 64px - 200px);
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const ContactCard = styled(Card)`
  height: 100%;
  
  .icon {
    font-size: 24px;
    color: #1890ff;
    margin-right: 8px;
  }

  .contact-item {
    margin-bottom: 16px;
    display: flex;
    align-items: center;
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 20px 0;
  width: 100%;
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
    <ContactWrapper>
      <Container>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 40 }}>
          联系我们
        </Title>

        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <ContactCard title="联系方式">
              {contactLoading ? (
                <LoadingContainer>
                  <Spin />
                  <div style={{ marginTop: '10px', color: '#999' }}>加载中...</div>
                </LoadingContainer>
              ) : contactInfo ? (
                <>
                  <div className="contact-item">
                    <PhoneOutlined className="icon" />
                    <div>
                      <div>电话：{contactInfo.tel}</div>
                      <div>手机：{contactInfo.mobile}</div>
                    </div>
                  </div>
                  
                  <div className="contact-item">
                    <MailOutlined className="icon" />
                    <div>
                      <div>邮箱：{contactInfo.email}</div>
                      <div>客服：{contactInfo.serviceEmail}</div>
                    </div>
                  </div>
                  
                  <div className="contact-item">
                    <EnvironmentOutlined className="icon" />
                    <div>
                      <div>地址：{contactInfo.address}</div>
                      <div>邮编：{contactInfo.postcode}</div>
                    </div>
                  </div>
                  
                  <div className="contact-item">
                    <GlobalOutlined className="icon" />
                    <div>
                      <div>网址：{contactInfo.website}</div>
                      <div>微信公众号：{contactInfo.wechat}</div>
                    </div>
                  </div>
                </>
              ) : (
                <div>暂无联系方式信息</div>
              )}
            </ContactCard>
          </Col>

          <Col xs={24} md={12}>
            <Card title="在线留言">
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
                    rows={4} 
                    placeholder="请输入您的留言内容"
                    maxLength={500}
                    showCount
                  />
                </Form.Item>

                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    loading={formLoading}
                    block
                  >
                    提交留言
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </ContactWrapper>
  );
};

export default Contact; 