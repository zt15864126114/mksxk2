import React, { useState, useEffect } from 'react';
import { Form, Input, Select, InputNumber, Upload, Button, message, Space } from 'antd';
import { UploadOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import type { Product, ProductSpecification, ProductCategory } from '@/services/productService';
import { productService } from '@/services/productService';

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
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // 获取产品类别
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await productService.getCategories();
        setCategories(response);
      } catch (error) {
        console.error('获取产品类别失败:', error);
        message.error('获取产品类别失败');
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

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
      // 处理规格数据
      const formData = { ...initialValues };
      
      // 如果规格是字符串，尝试解析为对象数组
      if (typeof formData.specifications === 'string') {
        try {
          formData.specifications = JSON.parse(formData.specifications);
        } catch (e) {
          console.error('解析规格数据失败:', e);
          formData.specifications = [{ name: '', value: '', unit: '' }]; // 设置默认空规格，包含必需属性
        }
      }
      
      // 如果规格仍然不是数组，设置为默认空数组
      if (!Array.isArray(formData.specifications)) {
        formData.specifications = [{ name: '', value: '', unit: '' }];
      }
      
      form.setFieldsValue(formData);
      
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
      
      // 确保规格是有效的数组
      if (productData.specifications && Array.isArray(productData.specifications)) {
        // 过滤掉空规格
        productData.specifications = productData.specifications.filter(
          spec => spec.name || spec.value || spec.unit
        );
      }
      
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
        <Select 
          placeholder="请选择产品类别"
          loading={loadingCategories}
        >
          {categories.map(category => (
            <Select.Option key={category.id} value={category.name}>
              {category.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="description"
        label="产品描述"
        rules={[{ required: true, message: '请输入产品描述' }]}
      >
        <Input.TextArea rows={4} placeholder="请输入产品描述" />
      </Form.Item>

      <Form.List name="specifications" initialValue={[{}]}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'name']}
                  rules={[{ required: true, message: '请输入规格名称' }]}
                >
                  <Input placeholder="规格名称" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'value']}
                  rules={[{ required: true, message: '请输入规格值' }]}
                >
                  <Input placeholder="规格值" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'unit']}
                >
                  <Input placeholder="单位（选填）" />
                </Form.Item>
                {fields.length > 1 && (
                  <MinusCircleOutlined onClick={() => remove(name)} />
                )}
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                添加规格
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Form.Item
        name="application"
        label="应用领域"
        rules={[{ required: false, message: '请输入应用领域' }]}
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