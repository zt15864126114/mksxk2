import { useRoutes } from 'react-router-dom'
import { Suspense, useEffect } from 'react'
import { Spin } from 'antd'

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
    <Suspense fallback={
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin size="large" tip="加载中..." />
      </div>
    }>
      {element}
    </Suspense>
  )
}

export default App 