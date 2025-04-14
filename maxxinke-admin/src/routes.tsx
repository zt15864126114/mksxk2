import React, { lazy, Suspense } from 'react'
import { Navigate } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'

import MainLayout from './layouts/MainLayout'
import LoadingScreen from './components/LoadingScreen'
import AuthGuard from './components/AuthGuard'

// 直接引入所有页面组件
import Products from './pages/products'
import ProductCategories from './pages/products/categories'
import News from './pages/news'
import Messages from './pages/messages'
import Dashboard from './pages/dashboard'
import Login from './pages/auth/Login'
import NotFound from './pages/error/NotFound'
import ServerError from './pages/error/ServerError'
import AboutUs from './pages/AboutUs'

const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <AuthGuard>
        <MainLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: '',
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'about-us',
        element: <AboutUs />,
      },
      {
        path: 'products',
        element: <Products />,
      },
      {
        path: 'products/categories',
        element: <ProductCategories />,
      },
      {
        path: 'news',
        element: <News />,
      },
      {
        path: 'messages',
        element: <Messages />,
      },
    ],
  },
  {
    path: '404',
    element: <NotFound />,
  },
  {
    path: '500',
    element: <ServerError />,
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },
]

export default routes