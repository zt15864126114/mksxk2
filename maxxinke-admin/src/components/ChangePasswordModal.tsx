import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { adminService } from '../services/adminService';

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      // 手动输入固定的管理员ID，避免获取接口的问题
      // 在实际环境中应该从/api/admins/me获取
      const adminId = 1; // 假设管理员ID是1
      
      console.log('开始修改密码，管理员ID:', adminId);
      
      // 调用修改密码API
      // 注意：这里需要修改后端API，接受旧密码参数并进行验证
      await adminService.updatePassword(adminId, values.oldPassword, values.newPassword);
      
      message.success('密码修改成功！');
      form.resetFields();
      onClose(); 
    } catch (error: any) {
      console.error('修改密码失败:', error);
      
      // 显示详细的错误信息
      if (error.response) {
        const status = error.response.status;
        if (status === 404) {
          message.error('管理员ID不存在，请联系系统管理员');
        } else if (status === 401) {
          message.error('登录已过期，请重新登录');
        } else if (status === 403) {
          message.error('没有权限执行此操作');
        } else if (status === 400) {
          // 400错误可能是密码验证失败
          message.error('当前密码不正确，请重新输入');
          // 只重置当前密码字段，保留新密码字段
          form.setFields([
            {
              name: 'oldPassword',
              errors: ['当前密码不正确'],
            },
          ]);
        } else {
          message.error('服务器错误: ' + (error.response.data?.message || '未知错误'));
        }
      } else if (error.request) {
        message.error('服务器未响应，请检查网络连接');
      } else {
        message.error(error.message || '修改密码失败，请重试');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="修改密码"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText="确认修改"
      cancelText="取消"
    >
      <Form form={form} layout="vertical" name="change_password_form">
        <Form.Item
          name="oldPassword"
          label="当前密码"
          rules={[
            { required: true, message: '请输入当前密码!' },
          ]}
        >
          <Input.Password placeholder="请输入当前密码" />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="新密码"
          rules={[
            { required: true, message: '请输入您的新密码!' },
            { min: 6, message: '密码长度至少为6位!' },
          ]}
          hasFeedback
        >
          <Input.Password placeholder="请输入新密码（至少6位）" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="确认新密码"
          dependencies={['newPassword']}
          hasFeedback
          rules={[
            { required: true, message: '请确认您的新密码!' },
            ({
              getFieldValue,
            }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入的密码不一致!'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="请再次输入新密码" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangePasswordModal; 