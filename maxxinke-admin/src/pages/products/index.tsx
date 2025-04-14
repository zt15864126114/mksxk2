import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message, Pagination } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, AppstoreOutlined } from '@ant-design/icons';
import { productService, Product } from '@/services/productService';
import ProductForm from './components/ProductForm';
import dayjs from 'dayjs';
import { SortOrder } from 'antd/es/table/interface';
import { useNavigate } from 'react-router-dom';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const navigate = useNavigate();

  const fetchProducts = async (page = currentPage, size = pageSize) => {
    try {
      setLoading(true);
      const response = await productService.getProducts({ page, pageSize: size });
      setProducts(response.content);
      setTotal(response.totalElements);
    } catch (error) {
      console.error('获取产品列表失败:', error);
      message.error('获取产品列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, pageSize]);

  const handleAdd = () => {
    setEditingProduct(null);
    setModalVisible(true);
  };

  const handleEdit = (record: Product) => {
    setEditingProduct(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await productService.deleteProduct(id.toString());
      message.success('删除成功');
      fetchProducts();
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除失败');
    }
  };

  const handleSave = async (formData: FormData) => {
    try {
      if (editingProduct?.id) {
        await productService.updateProduct(editingProduct.id.toString(), formData);
        message.success('更新成功');
      } else {
        await productService.createProduct(formData);
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchProducts();
    } catch (error) {
      console.error('保存失败:', error);
      message.error('保存失败');
    }
  };

  const handleView = (record: Product) => {
    Modal.info({
      title: '产品详情',
      width: 600,
      content: (
        <div>
          <p><strong>产品名称：</strong>{record.name}</p>
          <p><strong>类别：</strong>{record.category}</p>
          <p><strong>描述：</strong>{record.description}</p>
          <p><strong>规格：</strong>{record.specifications}</p>
          <p><strong>应用领域：</strong>{record.application}</p>
          <p><strong>图片：</strong></p>
          <img src={record.image} alt="产品图片" style={{ maxWidth: '100%', maxHeight: '300px' }} />
          <p><strong>排序：</strong>{record.sort}</p>
          <p><strong>状态：</strong>{record.status === 1 ? '启用' : '禁用'}</p>
          <p><strong>创建时间：</strong>{dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss')}</p>
        </div>
      ),
    });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      hidden: true,
    },
    {
      title: '产品名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '类别',
      dataIndex: 'category',
      key: 'category',
      width: 120,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      width: 200,
    },
    {
      title: '规格',
      dataIndex: 'specifications',
      key: 'specifications',
      width: 120,
      render: (specifications: string | any) => {
        if (typeof specifications === 'string') {
          try {
            const specsArray = JSON.parse(specifications);
            if (Array.isArray(specsArray) && specsArray.length > 0) {
              return specsArray[0].name || '[规格]';
            }
          } catch (e) {
            return specifications.length > 20 ? specifications.substring(0, 17) + '...' : specifications;
          }
        }
        return '[规格]';
      },
    },
    {
      title: '应用领域',
      dataIndex: 'application',
      key: 'application',
      ellipsis: true,
      width: 200,
    },
    {
      title: '图片',
      dataIndex: 'image',
      key: 'image',
      width: 100,
      render: (image: string) => (
        <img src={image} alt="产品图片" style={{ width: 50, height: 50, objectFit: 'cover' }} />
      ),
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 80,
      sorter: (a: Product, b: Product) => (b.sort || 0) - (a.sort || 0),
      defaultSortOrder: 'descend' as SortOrder,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: number) => (status === 1 ? '启用' : '禁用'),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      sorter: (a: Product, b: Product) => {
        if (!a.createTime || !b.createTime) return 0;
        return new Date(a.createTime).getTime() - new Date(b.createTime).getTime();
      },
      defaultSortOrder: 'descend' as SortOrder,
      render: (createTime: string) => dayjs(createTime).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right' as const,
      width: 280,
      render: (_: any, record: Product) => (
        <Space size={[8, 0]} wrap>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            查看
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ].filter(column => !column.hidden);

  return (
    <div style={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增产品
          </Button>
          <Button icon={<AppstoreOutlined />} onClick={() => navigate('/products/categories')}>
            分类管理
          </Button>
        </Space>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Table
          columns={columns}
          dataSource={products}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1500, y: 'calc(100vh - 280px)' }}
          pagination={false}
        />
        <div style={{ 
          padding: '16px 0', 
          borderTop: '1px solid #f0f0f0',
          backgroundColor: '#fff',
          position: 'sticky',
          bottom: 0,
          zIndex: 2,
          textAlign: 'right'
        }}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            onChange={(page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            }}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `共 ${total} 条`}
          />
        </div>
      </div>

      <Modal
        title={editingProduct ? "编辑产品" : "新增产品"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <ProductForm
          initialValues={editingProduct || undefined}
          onFinish={handleSave}
          loading={loading}
        />
      </Modal>
    </div>
  );
};

export default ProductsPage; 