import React, { useEffect, useState } from 'react';
import { Card, Form, Input, Button, Typography, Row, Col, Spin, App, Space, Divider } from 'antd';
import { systemService } from '../../services/systemService';
import type { ContactInfo } from '../../types/system';
import { PhoneOutlined, MailOutlined, HomeOutlined, GlobalOutlined, WechatOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ContactSettingsPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { message } = App.useApp();
  
  useEffect(() => {
    fetchContactInfo();
  }, []);
  
  const fetchContactInfo = async () => {
    try {
      setLoading(true);
      const data = await systemService.getContactInfo();
      form.setFieldsValue(data);
    } catch (error) {
      console.error('获取联系方式失败:', error);
      message.error('获取联系方式失败');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (values: ContactInfo) => {
    try {
      setSubmitting(true);
      await systemService.updateContactInfo(values);
      message.success('联系方式已更新');
    } catch (error) {
      console.error('更新联系方式失败:', error);
      message.error('更新联系方式失败');
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2} style={{ margin: '0' }}>联系方式设置</Title>
          <Text type="secondary">配置网站显示的联系信息</Text>
        </div>
        
        <Card bordered={false} style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <Spin size="large" />
              <div style={{ marginTop: '16px', color: '#999' }}>加载中...</div>
            </div>
          ) : (
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                mobile: '',
                email: '',
                address: '',
                website: '',
                wechat: ''
              }}
              requiredMark="optional"
            >
              <Divider orientation="left">基本联系方式</Divider>
              
              <Row gutter={[24, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item 
                    name="mobile" 
                    label="联系电话" 
                    rules={[{ required: true, message: '请输入联系电话' }]}
                  >
                    <Input 
                      prefix={<PhoneOutlined style={{ color: '#1890ff' }} />} 
                      placeholder="请输入联系电话" 
                      size="large"
                    />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={12}>
                  <Form.Item 
                    name="email" 
                    label="电子邮箱" 
                    rules={[
                      { required: true, message: '请输入电子邮箱' },
                      { type: 'email', message: '请输入有效的邮箱地址' }
                    ]}
                  >
                    <Input 
                      prefix={<MailOutlined style={{ color: '#1890ff' }} />} 
                      placeholder="请输入电子邮箱" 
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>
              
              <Divider orientation="left">地址与网站</Divider>
              
              <Form.Item 
                name="address" 
                label="公司地址" 
                rules={[{ required: true, message: '请输入公司地址' }]}
              >
                <Input 
                  prefix={<HomeOutlined style={{ color: '#1890ff' }} />} 
                  placeholder="请输入公司地址" 
                  size="large"
                />
              </Form.Item>
              
              <Row gutter={[24, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item 
                    name="website" 
                    label="网站地址" 
                    rules={[{ required: true, message: '请输入网站地址' }]}
                  >
                    <Input 
                      prefix={<GlobalOutlined style={{ color: '#1890ff' }} />} 
                      placeholder="请输入网站地址 (例如: https://www.example.com)" 
                      size="large"
                    />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={12}>
                  <Form.Item 
                    name="wechat" 
                    label="微信公众号" 
                    rules={[{ required: true, message: '请输入微信公众号' }]}
                  >
                    <Input 
                      prefix={<WechatOutlined style={{ color: '#1890ff' }} />} 
                      placeholder="请输入微信公众号" 
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>
              
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <Space>
                  <Button 
                    onClick={() => form.resetFields()} 
                    disabled={loading || submitting}
                  >
                    重置
                  </Button>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={submitting}
                    size="large"
                    style={{ minWidth: '120px' }}
                  >
                    保存设置
                  </Button>
                </Space>
              </div>
            </Form>
          )}
        </Card>
      </Space>
    </div>
  );
};

export default ContactSettingsPage; 