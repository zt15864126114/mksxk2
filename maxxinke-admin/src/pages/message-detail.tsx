import React, { useEffect, useState } from 'react';
import { Card, Typography, Tag, Button, Divider, message } from 'antd';
import { ArrowLeftOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { messageService } from '../services/messageService';
import type { Message } from '../types/message';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const MessageDetailPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [messageData, setMessageData] = useState<Message | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchMessageDetail(id);
    }
  }, [id]);

  const fetchMessageDetail = async (messageId: string) => {
    try {
      setLoading(true);
      const data = await messageService.getMessage(messageId);
      setMessageData(data);
    } catch (error) {
      message.error('获取消息详情失败');
      console.error('获取消息详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async () => {
    if (!id) return;
    
    try {
      await messageService.markAsRead(id);
      message.success('标记为已读成功');
      // 刷新消息数据
      fetchMessageDetail(id);
    } catch (error) {
      message.error('标记为已读失败');
      console.error('标记为已读失败:', error);
    }
  };

  const handleGoBack = () => {
    navigate('/messages');
  };

  if (!messageData) {
    return <div>加载中...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Button type="link" icon={<ArrowLeftOutlined />} onClick={handleGoBack}>
          返回消息列表
        </Button>
        <Tag 
          color={messageData.status === 1 || messageData.status === '1' ? 'green' : 'red'}
          style={{ fontSize: '14px', padding: '4px 8px', marginRight: 0 }}
        >
          {messageData.status === 1 || messageData.status === '1' ? '已读' : '未读'}
        </Tag>
      </div>

      <Card loading={loading} bordered={false}>
        <Title level={3}>消息详情</Title>
        <Divider style={{ margin: '16px 0' }} />
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '24px',
          marginBottom: '24px'
        }}>
          <div>
            <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>姓名</Text>
            <Text strong>{messageData.name}</Text>
          </div>
          <div>
            <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>邮箱</Text>
            <Text strong>{messageData.email}</Text>
          </div>
          <div>
            <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>电话</Text>
            <Text strong>{messageData.phone}</Text>
          </div>
          <div>
            <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>创建时间</Text>
            <Text strong>{dayjs(messageData.createTime).format('YYYY-MM-DD HH:mm:ss')}</Text>
          </div>
        </div>

        <div>
          <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>留言内容</Text>
          <div style={{ 
            background: '#fafafa',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #f0f0f0',
            minHeight: '150px',
            whiteSpace: 'pre-wrap',
            lineHeight: '1.8'
          }}>
            {messageData.content}
          </div>
        </div>

        {(messageData.status === 0 || messageData.status === '0') && (
          <div style={{ marginTop: '24px', textAlign: 'right' }}>
            <Button 
              type="primary" 
              icon={<CheckCircleOutlined />} 
              size="large"
              onClick={handleMarkAsRead}
            >
              标记为已读
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default MessageDetailPage; 