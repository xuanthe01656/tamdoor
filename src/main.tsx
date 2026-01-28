import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import MainLayout from './components/layout/MainLayout'
import './index.css'

// 1. Định nghĩa danh sách các trang
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: "san-pham",
        element: <div className="p-20 text-center">Trang Sản phẩm</div>,
      },
      {
        path: "ve-chung-toi",
        element: <div className="p-20 text-center">Về chúng tôi</div>,
      },
      {
        path: "lien-he",
        element: <div className="p-20 text-center">Liên hệ</div>,
      },
    ],
  },
  {
    path: "/admin",
    element: <div className="p-20 text-center bg-slate-100 h-screen font-bold text-2xl">Trang Dashboard Quản Trị</div>,
  },
]);

const rootElement = document.getElementById("root") as HTMLElement;
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}
