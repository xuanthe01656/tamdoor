import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'

// --- 1. IMPORT LAYOUTS  ---
import MainLayout from './components/layout/MainLayout' 
import AdminLayout from './components/layout/AdminLayout'

// --- 2. IMPORT CLIENT PAGES ---
import HomePage from './pages/client/HomePage'
import ClientProductList from './pages/client/ProductList' 
//import ProductDetail from './pages/client/ProductDetail' 
import AboutPage from './pages/client/AboutPage'
import ContactPage from './pages/client/ContactPage'
import WarrantyPage from './pages/client/WarrantyPage'
import ProcessPage from './pages/client/ProcessPage'
import FAQPage from './pages/client/FAQPage'
import ProductDetail from './pages/client/ProductDetail';

// --- 3. IMPORT ADMIN PAGES ---
import Dashboard from './pages/admin/Dashboard'
import AdminProductList from './pages/admin/ProductList'
import ProductAdd from './pages/admin/ProductAdd'
import Settings from './pages/admin/Settings'
import ProductEdit from './pages/admin/ProductEdit';
import ContactList from './pages/admin/ContactList';
import UserList from './pages/admin/UserList';
// --- AUTH IMPORTS ---
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

const router = createBrowserRouter([
  // === ROUTE CHO KHÁCH (CLIENT) ===
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
        element: <ClientProductList />, 
      },
      {
        path: "san-pham/:slug",
        element: <ProductDetail />,
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
  // === ROUTE ĐĂNG NHẬP (MỚI) ===
  {
    path: "/login",
    element: <LoginPage />
  },
  // === ROUTE CHO ADMIN ===
  {
    element: <ProtectedRoute />, 
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          // A. NHỮNG TRANG STAFF CŨNG ĐƯỢC VÀO
          { index: true, element: <Dashboard /> }, 
          { path: "products", element: <AdminProductList /> },
          { path: "products/new", element: <ProductAdd /> },
          { path: "products/edit/:id", element: <ProductEdit /> },
          { path: "contacts", element: <ContactList /> },

          // B. NHỮNG TRANG CHỈ ADMIN MỚI ĐƯỢC VÀO (Lồng thêm AdminRoute)
          {
            element: <AdminRoute />, // 🔒 Cửa bảo vệ lớp 2
            children: [
               { path: "users", element: <UserList /> },  // 👈 Staff không vào được nữa
               { path: "settings", element: <Settings /> } // 👈 Staff cũng không nên chỉnh cấu hình
            ]
          }
        ],
      }
    ]
  },
]);

const rootElement = document.getElementById("root") as HTMLElement;
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </StrictMode>
  );
}