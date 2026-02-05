import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import HomePage from './pages/client/HomePage'       
import ProductList from './pages/client/ProductList' 
import AboutPage from './pages/client/AboutPage';
import ContactPage from './pages/client/ContactPage';
import WarrantyPage from './pages/client/WarrantyPage'
import ProcessPage from './pages/client/ProcessPage'
import FAQPage from './pages/client/FAQPage'
import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />, 
      },
      {
        path: "san-pham",
        element: <ProductList />, 
      },
      {
        path: "ve-chung-toi",
        element: <AboutPage />,
      },
      {
        path: "lien-he",
        element: <ContactPage />,
      },
      { path: "chinh-sach-bao-hanh", element: <WarrantyPage /> },
      { path: "quy-trinh-lam-viec", element: <ProcessPage /> },
      { path: "cau-hoi-thuong-gap", element: <FAQPage /> },
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