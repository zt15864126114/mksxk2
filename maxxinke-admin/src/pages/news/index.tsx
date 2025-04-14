import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message, Pagination } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
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
      const response = await getNews({ page, size });
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
      title: '新闻详情',
      width: 600,
      content: (
        <div>
          <p><strong>标题：</strong>{record.title}</p>
          <p><strong>类型：</strong>{record.type}</p>
          <p><strong>内容：</strong>{record.content}</p>
          <p><strong>图片：</strong></p>
          <img src={record.image} alt="新闻图片" style={{ maxWidth: '100%', maxHeight: '300px' }} />
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
      render: (status: number) => (status === 1 ? '启用' : '禁用'),
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
      <div style={{ marginBottom: 16 }}>
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