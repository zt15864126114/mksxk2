import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, Tag, message } from 'antd';
import { EditOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import { messageService, Message } from '../../services/messageService';

const { Title } = Typography;

const MessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await messageService.getMessages({ page: 1, size: 10 });
      console.log('获取到的消息数据:', response);
      if (response && response.data && Array.isArray(response.data.content)) {
        setMessages(response.data.content);
      } else {
        console.error('消息数据格式不正确:', response);
        message.error('获取消息列表失败：数据格式不正确');
      }
    } catch (error) {
      message.error('获取消息列表失败');
      console.error('获取消息列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await messageService.deleteMessage(id);
      message.success('删除成功');
      fetchMessages();
    } catch (error) {
      message.error('删除失败');
      console.error('删除消息失败:', error);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await messageService.markAsRead(id);
      message.success('标记为已读成功');
      fetchMessages();
    } catch (error) {
      message.error('标记为已读失败');
      console.error('标记为已读失败:', error);
    }
  };

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: '10%',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: '15%',
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
      width: '15%',
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      width: '30%',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: '10%',
      render: (status: number) => (
        <Tag color={status === 1 ? 'green' : 'orange'}>
          {status === 1 ? '已读' : '未读'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: '15%',
    },
    {
      title: '操作',
      key: 'action',
      width: '15%',
      render: (_: any, record: Message) => (
        <Space>
          {record.status === 0 && (
            <Button
              type="primary"
              icon={<CheckOutlined />}
              size="small"
              onClick={() => record.id && handleMarkAsRead(record.id)}
            >
              标记已读
            </Button>
          )}
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => record.id && handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={2}>消息管理</Title>
      </div>

      <Table
        columns={columns}
        dataSource={messages.map(item => ({ ...item, key: item.id }))}
        pagination={false}
        loading={loading}
      />
    </div>
  );
};

export default MessagesPage; 