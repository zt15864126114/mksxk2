import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message, Pagination, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import NewsForm from './components/NewsForm';
import { getNews, createNews, updateNews, deleteNews } from '@/services/newsService';
import type { News } from '@/services/newsService';
import type { SortOrder } from 'antd/es/table/interface';
import dayjs from 'dayjs';

const NewsPage: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNews, setEditingNews] = useState<Partial<News> | null>(null);

  const fetchNews = async (page = currentPage, size = pageSize) => {
    try {
      setLoading(true);
      const response = await getNews({ page, pageSize: size });
      if (response && response.content) {
        setNews(response.content);
        setTotal(response.totalElements);
      }
    } catch (error) {
      console.error('获取新闻列表失败:', error);
      message.error('获取新闻列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [currentPage, pageSize]);

  const handleAdd = () => {
    setEditingNews(null);
    setModalVisible(true);
  };

  const handleEdit = (record: News) => {
    setEditingNews(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteNews(id.toString());
      message.success('删除成功');
      fetchNews();
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除失败');
    }
  };

  const handleSave = async (formData: FormData) => {
    try {
      if (editingNews?.id) {
        await updateNews(editingNews.id.toString(), formData);
        message.success('更新成功');
      } else {
        await createNews(formData);
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchNews();
    } catch (error) {
      console.error('保存失败:', error);
      message.error('保存失败');
    }
  };

  const handleView = (record: News) => {
    Modal.info({
      title: <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{record.title}</div>,
      width: 720,
      icon: null,
      className: 'news-detail-modal',
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
            {/* 新闻图片 */}
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
                  alt={record.title} 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '260px', 
                    objectFit: 'contain',
                    borderRadius: '4px'
                  }} 
                />
              </div>
            </div>
            
            {/* 新闻基本信息 */}
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
                <div style={{ color: '#666' }}>新闻类型:</div>
                <div style={{ fontWeight: 500 }}>{record.type}</div>
                
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
                
                <div style={{ color: '#666' }}>创建时间:</div>
                <div>{dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss')}</div>
              </div>
            </div>
          </div>
          
          {/* 新闻内容 */}
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
              新闻内容
            </h3>
            <div style={{ 
              padding: '12px 16px', 
              backgroundColor: '#fafafa', 
              borderRadius: '4px',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap'
            }}>
              {record.content || '暂无内容'}
            </div>
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
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      width: 300,
    },
    {
      title: '图片',
      dataIndex: 'image',
      key: 'image',
      width: 100,
      render: (image: string) => (
        <img src={image} alt="新闻图片" style={{ width: 50, height: 50, objectFit: 'cover' }} />
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: number) => (
        <span style={{ 
          display: 'inline-block',
          padding: '2px 8px', 
          borderRadius: '10px', 
          fontSize: '12px',
          backgroundColor: status === 1 ? '#e6f7ff' : '#fff1f0',
          color: status === 1 ? '#1890ff' : '#ff4d4f',
          border: `1px solid ${status === 1 ? '#91caff' : '#ffccc7'}`
        }}>
          {status === 1 ? '启用' : '禁用'}
        </span>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      sorter: (a: News, b: News) => {
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
      render: (_: any, record: News) => (
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
            description="确定要删除这篇新闻吗？此操作不可恢复。"
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
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增新闻
        </Button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Table
          columns={columns}
          dataSource={news}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1300, y: 'calc(100vh - 280px)' }}
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
        title={editingNews ? '编辑新闻' : '新增新闻'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <NewsForm
          initialValues={editingNews || undefined}
          onFinish={handleSave}
          loading={loading}
        />
      </Modal>
    </div>
  );
};

export default NewsPage; 