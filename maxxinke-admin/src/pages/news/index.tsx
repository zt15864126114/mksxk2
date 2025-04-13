import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import NewsForm from './components/NewsFormNew';
import { getNews, createNews, updateNews, deleteNews } from '@/services/newsService';
import type { News } from '@/services/newsService';
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
      console.log('API响应:', response);
      if (response && response.content) {
        setNews(response.content);
        setTotal(response.totalElements);
      } else {
        console.error('API响应格式不正确:', response);
        message.error('获取新闻列表失败: 响应格式不正确');
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

  const handleSave = async (values: Partial<News>) => {
    try {
      if (editingNews?.id) {
        await updateNews(editingNews.id.toString(), values);
        message.success('更新成功');
      } else {
        await createNews(values);
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchNews();
    } catch (error) {
      console.error('保存失败:', error);
      message.error('保存失败');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '类别',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
    },
    {
      title: '图片',
      dataIndex: 'image',
      key: 'image',
      render: (image: string) => (
        <img src={image} alt="新闻图片" style={{ width: 50, height: 50, objectFit: 'cover' }} />
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (status === 'PUBLISHED' ? '已发布' : '草稿'),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (createTime: string) => dayjs(createTime).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: News) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增新闻
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={news}
        rowKey="id"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
        }}
      />

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
        />
      </Modal>
    </div>
  );
};

export default NewsPage; 