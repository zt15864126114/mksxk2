import React, { useState } from 'react';
import { Form, Input, Select, InputNumber, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { Product } from '@/services/productService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

interface ProductFormProps {
  initialValues?: Partial<Product>;
  onFinish: (values: FormData) => void;
  loading?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
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

  const handleSubmit = async (values: Partial<Product>) => {
    try {
      const formData = new FormData();
      
      // 创建产品数据对象，排除 image 字段
      const { image, ...productData } = values;
      
      // 将产品数据作为JSON字符串添加到FormData
      formData.append('product', JSON.stringify(productData));

      // 如果有文件，添加到 FormData
      if (fileList.length > 0 && fileList[0].originFileObj) {
        // 直接将文件添加到 FormData，不使用 'file' 字段名
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
        name="name"
        label="产品名称"
        rules={[{ required: true, message: '请输入产品名称' }]}
      >
        <Input placeholder="请输入产品名称" />
      </Form.Item>

      <Form.Item
        name="category"
        label="产品类别"
        rules={[{ required: true, message: '请选择产品类别' }]}
      >
        <Select placeholder="请选择产品类别">
          <Select.Option value="CATEGORY_1">类别1</Select.Option>
          <Select.Option value="CATEGORY_2">类别2</Select.Option>
          <Select.Option value="CATEGORY_3">类别3</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="description"
        label="产品描述"
        rules={[{ required: true, message: '请输入产品描述' }]}
      >
        <Input.TextArea rows={4} placeholder="请输入产品描述" />
      </Form.Item>

      <Form.Item
        name="specification"
        label="产品规格"
        rules={[{ required: true, message: '请输入产品规格' }]}
      >
        <Input placeholder="请输入产品规格" />
      </Form.Item>

      <Form.Item
        name="application"
        label="应用领域"
        rules={[{ required: true, message: '请输入应用领域' }]}
      >
        <Input.TextArea rows={4} placeholder="请输入应用领域" />
      </Form.Item>

      <Form.Item
        name="image"
        label="产品图片"
        rules={[{ required: true, message: '请上传产品图片' }]}
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
        name="sort"
        label="排序"
        rules={[{ required: true, message: '请输入排序值' }]}
      >
        <InputNumber min={0} placeholder="请输入排序值" />
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

export default ProductForm; 