import React, { useState, useEffect } from 'react';
import { Table, Space, Button, message } from 'antd';
import { Link } from 'react-router-dom';
import { newsService, News, NewsListParams } from '../services/newsService';

const NewsList: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchNews = async (page: number) => {
    try {
      setLoading(true);
      const params: NewsListParams = {
        page: page - 1,
        pageSize,
        status: 1
      };
      const response = await newsService.getNews(params);
      setNews(response.content);
      setTotal(response.totalElements);
    } catch (error) {
      console.error('Error fetching news:', error);
      message.error('获取新闻列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(currentPage);
  }, [currentPage]);

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: News) => (
        <Link to={`/news/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '发布时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: News) => (
        <Space size="middle">
          <Link to={`/news/${record.id}`}>
            <Button type="link">查看</Button>
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={news}
      rowKey="id"
      loading={loading}
      pagination={{
        current: currentPage,
        pageSize,
        total,
        onChange: (page) => setCurrentPage(page),
      }}
    />
  );
};

export default NewsList; 