import React from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';

const { Title } = Typography;

interface LocationState {
  from?: {
    pathname: string;
  };
}

const Login = () => {
  const { login, isLoading, error } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as LocationState;
  const from = state?.from?.pathname || '/dashboard';
  
  // console.log('登录页面加载，目标重定向路径:', from);

  const onFinish = async (values: any) => {
    try {
      // console.log('登录表单提交:', values);
      const { username, password } = values;
      await login(username, password);
      message.success('登录成功');
      // console.log('登录成功，即将跳转到:', from);
      
      // 短暂延迟后跳转，确保登录状态已经保存
      setTimeout(() => {
        navigate(from);
      }, 100);
    } catch (error) {
      console.error('登录失败:', error);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: '#f0f2f5'
    }}>
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ margin: 0 }}>麦克斯鑫科管理系统</Title>
          <p style={{ marginTop: 8, color: 'rgba(0,0,0,0.45)' }}>专业的企业管理平台</p>
        </div>
        <Form
          name="login"
          initialValues={{ remember: true, username: 'admin', password: '654321' }}
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>

          {error && (
            <div style={{ color: 'red', marginBottom: 16 }}>
              {error}
            </div>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading} block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login; 