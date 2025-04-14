// import React from 'react';
// import { createBrowserRouter, Navigate } from 'react-router-dom';
// import MainLayout from '../layouts/MainLayout';
// import Dashboard from '../pages/dashboard';
// import AboutUs from '../pages/AboutUs';
// import NotFound from '../pages/error/404';
// import {
//   DashboardOutlined,
//   InfoCircleOutlined,
//   UserOutlined,
//   FileTextOutlined,
//   SettingOutlined
// } from '@ant-design/icons';
//
// const routes = [
//   {
//     path: '/',
//     element: <MainLayout />,
//     children: [
//       {
//         path: '',
//         element: <Navigate to="/dashboard" replace />,
//       },
//       {
//         path: 'dashboard',
//         element: <Dashboard />,
//         meta: {
//           title: '仪表盘',
//           icon: <DashboardOutlined />
//         }
//       },
//       {
//         path: 'about-us',
//         element: <AboutUs />,
//         meta: {
//           title: '关于我们管理',
//           icon: <InfoCircleOutlined />
//         }
//       }
//     ]
//   },
//   {
//     path: '*',
//     element: <NotFound />
//   }
// ];
//
// const router = createBrowserRouter(routes);
//
// export default router;