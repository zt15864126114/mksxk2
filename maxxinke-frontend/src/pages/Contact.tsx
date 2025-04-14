import React, { useState } from 'react';
import styled from 'styled-components';
import { Typography, Row, Col, Form, Input, Button, message, Card } from 'antd';
import { 
  PhoneOutlined, 
  MailOutlined, 
  EnvironmentOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import { messageService } from '../services/messageService';

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

const Contact: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
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
      setLoading(false);
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
              <div className="contact-item">
                <PhoneOutlined className="icon" />
                <div>
                  <div>电话：0755-12345678</div>
                  <div>手机：138 8888 8888</div>
                </div>
              </div>
              
              <div className="contact-item">
                <MailOutlined className="icon" />
                <div>
                  <div>邮箱：info@maxxinke.com</div>
                  <div>客服：service@maxxinke.com</div>
                </div>
              </div>
              
              <div className="contact-item">
                <EnvironmentOutlined className="icon" />
                <div>
                  <div>地址：深圳市宝安区新安街道某某工业园A栋5楼</div>
                  <div>邮编：518000</div>
                </div>
              </div>
              
              <div className="contact-item">
                <GlobalOutlined className="icon" />
                <div>
                  <div>网址：www.maxxinke.com</div>
                  <div>微信公众号：麦克斯鑫科</div>
                </div>
              </div>
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
                    loading={loading}
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