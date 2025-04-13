import React from 'react';
import { Form, Input, Select, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { News } from '@/services/newsService';

const { TextArea } = Input;
const { Option } = Select;

interface NewsFormProps {
  initialValues?: Partial<News>;
  onFinish: (values: any) => void;
}

const NewsForm: React.FC<NewsFormProps> = ({ initialValues, onFinish }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    try {
      await onFinish(values);
      form.resetFields();
    } catch (error) {
      message.error('提交失败');
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleSubmit}
    >
      <Form.Item
        name="title"
        label="标题"
        rules={[{ required: true, message: '请输入标题' }]}
      >
        <Input placeholder="请输入标题" />
      </Form.Item>

      <Form.Item
        name="category"
        label="分类"
        rules={[{ required: true, message: '请选择分类' }]}
      >
        <Select placeholder="请选择分类">
          <Option value="company">公司新闻</Option>
          <Option value="industry">行业动态</Option>
          <Option value="product">产品资讯</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="content"
        label="内容"
        rules={[{ required: true, message: '请输入内容' }]}
      >
        <TextArea rows={4} placeholder="请输入内容" />
      </Form.Item>

      <Form.Item
        name="image"
        label="图片"
        rules={[{ required: true, message: '请上传图片' }]}
      >
        <Upload
          name="file"
          action="/api/upload"
          listType="picture"
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>上传图片</Button>
        </Upload>
      </Form.Item>

      <Form.Item
        name="status"
        label="状态"
        rules={[{ required: true, message: '请选择状态' }]}
      >
        <Select placeholder="请选择状态">
          <Option value="draft">草稿</Option>
          <Option value="published">已发布</Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </Form.Item>
    </Form>
  );
};

export default NewsForm; 