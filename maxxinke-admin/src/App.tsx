import { useRoutes } from 'react-router-dom'
import { Suspense, useEffect } from 'react'
import { Spin, App as AntApp } from 'antd'

import routes from './routes'
import { useUserStore } from './store/userStore'

/**
 * 应用程序根组件
 */
const App = () => {
  const element = useRoutes(routes)
  const { checkAuth } = useUserStore()
  
  // 在应用加载时检查认证状态
  useEffect(() => {
    checkAuth()
  }, [checkAuth])
  
  return (
    <AntApp>
      <Suspense fallback={
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px', color: '#999' }}>加载中...</div>
        </div>
      }>
        {element}
      </Suspense>
    </AntApp>
  )
}

export default App 