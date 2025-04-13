import React, { useState } from 'react';
import { Form, Input, Select, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { News } from '@/services/newsService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

interface NewsFormProps {
  initialValues?: Partial<News>;
  onFinish: (values: FormData) => void;
  loading?: boolean;
}

const NewsForm: React.FC<NewsFormProps> = ({
  initialValues,
  onFinish,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);

  // 处理图片预览URL
  const getImageUrl = (image: string) => {
    if (image.startsWith('http')) {
      return image;
    }
    return `${API_BASE_URL}/uploads/${image}`;
  };

  // 当初始值改变时更新表单和文件列表
  React.useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      if (initialValues.image) {
        setFileList([
          {
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: getImageUrl(initialValues.image),
          },
        ]);
      }
    } else {
      form.resetFields();
      setFileList([]);
    }
  }, [initialValues, form]);

  const handleSubmit = async (values: Partial<News>) => {
    try {
      const formData = new FormData();
      
      // 创建新闻数据对象，排除 image 字段
      const { image, ...newsData } = values;
      
      // 将新闻数据作为JSON字符串添加到FormData
      formData.append('news', JSON.stringify(newsData));

      // 如果有文件，添加到 FormData
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append('image', fileList[0].originFileObj);
        console.log('文件对象:', fileList[0].originFileObj);
      }

      console.log('提交的表单数据:', Object.fromEntries(formData.entries()));
      await onFinish(formData);
    } catch (error) {
      console.error('保存失败:', error);
      message.error('保存失败');
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
        label="新闻标题"
        rules={[{ required: true, message: '请输入新闻标题' }]}
      >
        <Input placeholder="请输入新闻标题" />
      </Form.Item>

      <Form.Item
        name="type"
        label="新闻类型"
        rules={[{ required: true, message: '请选择新闻类型' }]}
      >
        <Select placeholder="请选择新闻类型">
          <Select.Option value="公司动态">公司动态</Select.Option>
          <Select.Option value="行业新闻">行业新闻</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="content"
        label="新闻内容"
        rules={[{ required: true, message: '请输入新闻内容' }]}
      >
        <Input.TextArea rows={6} placeholder="请输入新闻内容" />
      </Form.Item>

      <Form.Item
        name="image"
        label="新闻图片"
        rules={[{ required: true, message: '请上传新闻图片' }]}
      >
        <Upload
          name="image"
          listType="picture"
          maxCount={1}
          fileList={fileList}
          beforeUpload={() => false}
          onChange={({ fileList }) => setFileList(fileList)}
          customRequest={({ onSuccess }) => {
            setTimeout(() => {
              onSuccess?.("ok");
            }, 0);
          }}
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
          <Select.Option value={1}>启用</Select.Option>
          <Select.Option value={0}>禁用</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          保存
        </Button>
      </Form.Item>
    </Form>
  );
};

export default NewsForm; 