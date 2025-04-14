import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, message, Space, Typography, Spin } from 'antd';
import { aboutUsService } from '../services/aboutUsService';

const { Title } = Typography;
const { TextArea } = Input;

const AboutUs: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAboutUs();
  }, []);

  const fetchAboutUs = async () => {
    try {
      setLoading(true);
      const data = await aboutUsService.getAboutUs();
      form.setFieldsValue(data);
    } catch (error) {
      message.error('获取关于我们信息失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      await aboutUsService.saveAboutUs(values);
      message.success('保存成功');
    } catch (error) {
      message.error('保存失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Title level={2}>关于我们管理</Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ maxWidth: 800, margin: '0 auto' }}
      >
        <Form.Item
          label="公司简介"
          name="companyIntro"
          rules={[{ required: true, message: '请输入公司简介' }]}
        >
          <TextArea rows={6} placeholder="请输入公司简介" />
        </Form.Item>

        <Form.Item
          label="核心优势"
          name="coreAdvantages"
          rules={[{ required: true, message: '请输入核心优势' }]}
          extra="请按照以下格式输入：优势1：描述1\n优势2：描述2\n优势3：描述3"
        >
          <TextArea rows={6} placeholder="请输入核心优势，每行一个优势" />
        </Form.Item>

        <Form.Item
          label="产品优势"
          name="productAdvantages"
          rules={[{ required: true, message: '请输入产品优势' }]}
        >
          <TextArea rows={6} placeholder="请输入产品优势" />
        </Form.Item>

        <Form.Item
          label="应用领域"
          name="applicationAreas"
          rules={[{ required: true, message: '请输入应用领域' }]}
          extra="请按照以下格式输入：\n1. 领域名称\n- 具体应用1\n- 具体应用2\n\n2. 领域名称\n- 具体应用1\n- 具体应用2"
        >
          <TextArea rows={10} placeholder="请输入应用领域" />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              保存
            </Button>
            <Button onClick={() => form.resetFields()}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AboutUs; 