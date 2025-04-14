import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, InputNumber, Switch, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { productService, ProductCategory } from '@/services/productService';
import type { SortOrder } from 'antd/es/table/interface';
import dayjs from 'dayjs';

const ProductCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<ProductCategory> | null>(null);
  const [form] = Form.useForm();

  // 获取分类列表
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await productService.getCategories();
      setCategories(response);
    } catch (error) {
      console.error('获取分类列表失败:', error);
      message.error('获取分类列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 打开添加分类弹窗
  const handleAdd = () => {
    setEditingCategory(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 打开编辑分类弹窗
  const handleEdit = (record: ProductCategory) => {
    setEditingCategory(record);
    form.setFieldsValue({
      name: record.name,
      sort: record.sort,
      status: record.status === 1,
    });
    setModalVisible(true);
  };

  // 处理分类删除
  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await productService.deleteCategory(id.toString());
      message.success('删除成功');
      fetchCategories();
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理分类保存
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      const categoryData: Partial<ProductCategory> = {
        name: values.name,
        sort: values.sort,
        status: values.status ? 1 : 0,
      };
      
      if (editingCategory?.id) {
        categoryData.id = editingCategory.id;
        await productService.updateCategory(editingCategory.id.toString(), categoryData);
        message.success('更新成功');
      } else {
        await productService.createCategory(categoryData);
        message.success('创建成功');
      }
      
      setModalVisible(false);
      fetchCategories();
    } catch (error) {
      console.error('保存失败:', error);
      message.error('保存失败');
    } finally {
      setLoading(false);
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '分类名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 100,
      sorter: (a: ProductCategory, b: ProductCategory) => (b.sort || 0) - (a.sort || 0),
      defaultSortOrder: 'descend' as SortOrder,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) => (status === 1 ? '启用' : '禁用'),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      sorter: (a: ProductCategory, b: ProductCategory) => {
        if (!a.createTime || !b.createTime) return 0;
        return new Date(a.createTime).getTime() - new Date(b.createTime).getTime();
      },
      defaultSortOrder: 'descend' as SortOrder,
      render: (createTime: string) => dayjs(createTime).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: ProductCategory) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个分类吗?"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加分类
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        loading={loading}
        pagination={false}
      />

      <Modal
        title={editingCategory ? '编辑分类' : '添加分类'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        confirmLoading={loading}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="分类名称"
            rules={[{ required: true, message: '请输入分类名称' }]}
          >
            <Input placeholder="请输入分类名称" />
          </Form.Item>

          <Form.Item
            name="sort"
            label="排序"
            rules={[{ required: true, message: '请输入排序值' }]}
            initialValue={100}
          >
            <InputNumber min={0} max={1000} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductCategoriesPage; 