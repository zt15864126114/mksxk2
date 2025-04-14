import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, Tag, message, Pagination, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, CheckOutlined, EyeOutlined } from '@ant-design/icons';
import { messageService } from '../../services/messageService';
import type { Message } from '../../types/message';
import type { SortOrder } from 'antd/es/table/interface';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const MessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<Message | null>(null);

  const fetchMessages = async (page = currentPage, size = pageSize) => {
    try {
      setLoading(true);
      const response = await messageService.getMessages({ page, size });
      console.log('获取到的消息数据:', response);
      if (response && response.data && Array.isArray(response.data.content)) {
        setMessages(response.data.content);
        setTotal(response.total);
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
  }, [currentPage, pageSize]);

  const handleDelete = async (id: number) => {
    try {
      await messageService.deleteMessage(id.toString());
      message.success('删除成功');
      fetchMessages();
    } catch (error) {
      message.error('删除失败');
      console.error('删除消息失败:', error);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await messageService.markAsRead(id.toString());
      message.success('标记为已读成功');
      fetchMessages();
    } catch (error) {
      message.error('标记为已读失败');
      console.error('标记为已读失败:', error);
    }
  };

  const handleView = (record: Message) => {
    setCurrentMessage(record);
    setViewModalVisible(true);
  };

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: '8%',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: '12%',
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
      width: '12%',
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      width: '20%',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: '8%',
      render: (status: string | number) => (
        <Tag color={status === 1 || status === '1' ? 'green' : 'red'}>
          {status === 1 || status === '1' ? '已读' : '未读'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: '15%',
      sorter: (a: Message, b: Message) => {
        if (!a.createTime || !b.createTime) return 0;
        return new Date(a.createTime).getTime() - new Date(b.createTime).getTime();
      },
      defaultSortOrder: 'descend' as SortOrder,
      render: (createTime: string) => dayjs(createTime).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'action',
      width: '25%',
      render: (_: any, record: Message) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleView(record)}
          >
            查看
          </Button>
          {(record.status === 0 || record.status === '0') && (
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
        dataSource={messages}
        rowKey="id"
        loading={loading}
        pagination={false}
        scroll={{ x: 1200 }}
      />
      
      <div style={{ 
        marginTop: 16, 
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

      <Modal
        title={
          <div style={{ 
            borderBottom: '1px solid #f0f0f0',
            padding: '16px 24px',
            margin: '-20px -24px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span style={{ fontSize: '16px', fontWeight: 500 }}>消息详情</span>
            <Tag color={currentMessage?.status === '1' ? 'green' : 'red'}>
              {currentMessage?.status === '1' ? '已读' : '未读'}
            </Tag>
          </div>
        }
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={700}
      >
        {currentMessage && (
          <div style={{ padding: '0 24px' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div>
                <Text type="secondary">姓名</Text>
                <div style={{ marginTop: '4px', fontSize: '14px' }}>{currentMessage.name}</div>
              </div>
              <div>
                <Text type="secondary">邮箱</Text>
                <div style={{ marginTop: '4px', fontSize: '14px' }}>{currentMessage.email}</div>
              </div>
              <div>
                <Text type="secondary">电话</Text>
                <div style={{ marginTop: '4px', fontSize: '14px' }}>{currentMessage.phone}</div>
              </div>
              <div>
                <Text type="secondary">创建时间</Text>
                <div style={{ marginTop: '4px', fontSize: '14px' }}>
                  {dayjs(currentMessage.createTime).format('YYYY-MM-DD HH:mm:ss')}
                </div>
              </div>
            </div>
            
            <div>
              <Text type="secondary">留言内容</Text>
              <div style={{ 
                marginTop: '8px',
                background: '#fafafa',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #f0f0f0',
                minHeight: '120px',
                whiteSpace: 'pre-wrap',
                fontSize: '14px',
                lineHeight: '1.6'
              }}>
                {currentMessage.content}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MessagesPage; 