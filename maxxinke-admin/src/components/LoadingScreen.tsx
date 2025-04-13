import React from 'react';
import { Spin } from 'antd';

const LoadingScreen = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '300px' }}>
      <Spin size="large" />
    </div>
  );
};

export default LoadingScreen; 