import React, { useEffect, useState } from 'react';
import { Card, Form, Input, Button, message, Typography, Row, Col, Spin, App } from 'antd';
import { systemService } from '../../services/systemService';
import type { ContactInfo } from '../../types/system';

const { Title } = Typography;

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
    <div style={{ padding: '24px' }}>
      <Title level={2}>联系方式设置</Title>
      
      <Card variant="borderless" style={{ marginTop: '16px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px', color: '#999' }}>加载中...</div>
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              tel: '',
              mobile: '',
              email: '',
              serviceEmail: '',
              address: '',
              postcode: '',
              website: '',
              wechat: ''
            }}
          >
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item 
                  name="tel" 
                  label="电话" 
                  rules={[{ required: true, message: '请输入电话号码' }]}
                >
                  <Input placeholder="请输入电话号码" />
                </Form.Item>
              </Col>
              
              <Col span={12}>
                <Form.Item 
                  name="mobile" 
                  label="手机" 
                  rules={[{ required: true, message: '请输入手机号码' }]}
                >
                  <Input placeholder="请输入手机号码" />
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item 
                  name="email" 
                  label="邮箱" 
                  rules={[
                    { required: true, message: '请输入邮箱地址' },
                    { type: 'email', message: '请输入有效的邮箱地址' }
                  ]}
                >
                  <Input placeholder="请输入邮箱地址" />
                </Form.Item>
              </Col>
              
              <Col span={12}>
                <Form.Item 
                  name="serviceEmail" 
                  label="客服邮箱" 
                  rules={[
                    { required: true, message: '请输入客服邮箱' },
                    { type: 'email', message: '请输入有效的邮箱地址' }
                  ]}
                >
                  <Input placeholder="请输入客服邮箱" />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item 
              name="address" 
              label="地址" 
              rules={[{ required: true, message: '请输入公司地址' }]}
            >
              <Input placeholder="请输入公司地址" />
            </Form.Item>
            
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item 
                  name="postcode" 
                  label="邮编" 
                  rules={[{ required: true, message: '请输入邮政编码' }]}
                >
                  <Input placeholder="请输入邮政编码" />
                </Form.Item>
              </Col>
              
              <Col span={12}>
                <Form.Item 
                  name="website" 
                  label="网址" 
                  rules={[{ required: true, message: '请输入网站地址' }]}
                >
                  <Input placeholder="请输入网站地址" />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item 
              name="wechat" 
              label="微信公众号" 
              rules={[{ required: true, message: '请输入微信公众号' }]}
            >
              <Input placeholder="请输入微信公众号" />
            </Form.Item>
            
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={submitting}
                style={{ minWidth: '120px' }}
              >
                保存设置
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default ContactSettingsPage; 