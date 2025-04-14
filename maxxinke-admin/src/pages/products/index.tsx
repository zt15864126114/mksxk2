import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message, Pagination, Input, Card, Tag, Tooltip, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, AppstoreOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { productService, Product, ProductSpecification } from '@/services/productService';
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
    // 处理规格数据显示
    let specs: ProductSpecification[] = [];
    
    try {
      if (typeof record.specifications === 'string') {
        specs = JSON.parse(record.specifications);
      } else if (Array.isArray(record.specifications)) {
        specs = record.specifications;
      }
    } catch (e) {
      console.error('解析规格数据失败:', e);
    }
    
    Modal.info({
      title: <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{record.name}</div>,
      width: 720,
      icon: null,
      className: 'product-detail-modal',
      maskClosable: true,
      okText: '关闭',
      content: (
        <div style={{ padding: '16px 0' }}>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '24px',
            marginBottom: '24px' 
          }}>
            {/* 产品图片 */}
            <div style={{ width: '260px', flexShrink: 0 }}>
              <div style={{ 
                border: '1px solid #f0f0f0', 
                borderRadius: '8px', 
                overflow: 'hidden',
                padding: '8px',
                backgroundColor: '#fafafa',
                textAlign: 'center'
              }}>
                <img 
                  src={record.image} 
                  alt={record.name} 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '260px', 
                    objectFit: 'contain',
                    borderRadius: '4px'
                  }} 
                />
              </div>
            </div>
            
            {/* 产品基本信息 */}
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '16px', marginTop: 0, marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                <span style={{ 
                  display: 'inline-block', 
                  width: '4px', 
                  height: '16px', 
                  backgroundColor: '#1890ff', 
                  marginRight: '8px',
                  borderRadius: '2px'
                }}></span>
                基本信息
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', rowGap: '12px' }}>
                <div style={{ color: '#666' }}>产品类别:</div>
                <div style={{ fontWeight: 500 }}>{record.category}</div>
                
                <div style={{ color: '#666' }}>状态:</div>
                <div>
                  <span style={{ 
                    display: 'inline-block',
                    padding: '2px 8px', 
                    borderRadius: '10px', 
                    fontSize: '12px',
                    backgroundColor: record.status === 1 ? '#e6f7ff' : '#fff1f0',
                    color: record.status === 1 ? '#1890ff' : '#ff4d4f',
                    border: `1px solid ${record.status === 1 ? '#91caff' : '#ffccc7'}`
                  }}>
                    {record.status === 1 ? '启用' : '禁用'}
                  </span>
                </div>
                
                <div style={{ color: '#666' }}>排序:</div>
                <div>{record.sort}</div>
                
                <div style={{ color: '#666' }}>创建时间:</div>
                <div>{dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss')}</div>
              </div>
            </div>
          </div>
          
          {/* 产品描述 */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', margin: '0 0 16px', display: 'flex', alignItems: 'center' }}>
              <span style={{ 
                display: 'inline-block', 
                width: '4px', 
                height: '16px', 
                backgroundColor: '#1890ff', 
                marginRight: '8px',
                borderRadius: '2px'
              }}></span>
              产品描述
            </h3>
            <div style={{ 
              padding: '12px 16px', 
              backgroundColor: '#fafafa', 
              borderRadius: '4px',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap'
            }}>
              {record.description || '暂无描述'}
            </div>
          </div>
          
          {/* 应用领域 */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', margin: '0 0 16px', display: 'flex', alignItems: 'center' }}>
              <span style={{ 
                display: 'inline-block', 
                width: '4px', 
                height: '16px', 
                backgroundColor: '#1890ff', 
                marginRight: '8px',
                borderRadius: '2px'
              }}></span>
              应用领域
            </h3>
            <div style={{ 
              padding: '12px 16px', 
              backgroundColor: '#fafafa', 
              borderRadius: '4px',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap'
            }}>
              {record.application || '暂无应用领域'}
            </div>
          </div>
          
          {/* 产品规格 */}
          <div>
            <h3 style={{ fontSize: '16px', margin: '0 0 16px', display: 'flex', alignItems: 'center' }}>
              <span style={{ 
                display: 'inline-block', 
                width: '4px', 
                height: '16px', 
                backgroundColor: '#1890ff', 
                marginRight: '8px',
                borderRadius: '2px'
              }}></span>
              产品规格 ({specs.length})
            </h3>
            {specs.length > 0 ? (
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '12px',
              }}>
                {specs.map((spec, index) => (
                  <div 
                    key={index}
                    style={{ 
                      padding: '12px 16px', 
                      backgroundColor: '#fafafa', 
                      borderRadius: '4px',
                      border: '1px solid #f0f0f0'
                    }}
                  >
                    <div style={{ fontWeight: 500 }}>{spec.name}</div>
                    <div style={{ marginTop: '4px', color: '#666' }}>
                      {spec.value} {spec.unit || ''}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: '#999', padding: '12px 16px', backgroundColor: '#fafafa', borderRadius: '4px' }}>
                暂无规格信息
              </div>
            )}
          </div>
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
      render: (specifications: string | ProductSpecification[]) => {
        try {
          // 解析规格数据
          let specs: ProductSpecification[] = [];
          
          if (typeof specifications === 'string') {
            specs = JSON.parse(specifications);
          } else if (Array.isArray(specifications)) {
            specs = specifications;
          }
          
          // 显示第一条规格或规格总数
          if (specs.length > 0) {
            const firstSpec = specs[0];
            if (specs.length === 1) {
              return `${firstSpec.name}: ${firstSpec.value}${firstSpec.unit ? ` ${firstSpec.unit}` : ''}`;
            } else {
              return `${firstSpec.name}: ${firstSpec.value}${firstSpec.unit ? ` ${firstSpec.unit}` : ''} 等${specs.length}项`;
            }
          } else {
            return '无规格';
          }
        } catch (e) {
          console.error('解析规格数据失败:', e);
          // 如果解析失败，显示原始字符串的截断版本
          const str = String(specifications);
          return str.length > 20 ? str.substring(0, 17) + '...' : str;
        }
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
          <Popconfirm
            title="确认删除"
            description="确定要删除这个产品吗？此操作不可恢复。"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
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