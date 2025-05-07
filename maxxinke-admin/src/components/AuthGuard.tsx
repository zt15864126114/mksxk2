import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import LoadingScreen from './LoadingScreen';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, checkAuth, isLoading } = useUserStore();
  const location = useLocation();

  // 每次进入受保护路由时检查认证状态
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // 如果正在加载，显示加载屏幕
  if (isLoading) {
    return <LoadingScreen />;
  }

  // 如果未认证，重定向到登录页
  if (!isAuthenticated) {
    // console.log('未认证，重定向到登录页');
    // 将当前URL保存在state中，以便登录后返回
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard; 