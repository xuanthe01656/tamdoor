import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import './index.css'

// --- LAYOUTS ---
import MainLayout from './components/layout/MainLayout' 
import AdminLayout from './components/layout/AdminLayout'

// --- CLIENT PAGES ---
import HomePage from './pages/client/HomePage'
import ClientProductList from './pages/client/ProductList' 
import AboutPage from './pages/client/AboutPage'
import ContactPage from './pages/client/ContactPage'
import WarrantyPage from './pages/client/WarrantyPage'
import ProcessPage from './pages/client/ProcessPage'
import FAQPage from './pages/client/FAQPage'
import ProductDetail from './pages/client/ProductDetail';

// --- ADMIN PAGES ---
import Dashboard from './pages/admin/Dashboard'
import AdminProductList from './pages/admin/ProductList'
import ProductAdd from './pages/admin/ProductAdd'
import Settings from './pages/admin/Settings'
import ProductEdit from './pages/admin/ProductEdit';
import ContactList from './pages/admin/ContactList';
import UserList from './pages/admin/UserList';
import ProfilePage from './pages/admin/ProfilePage'

// --- AUTH ---
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

// --- LOGIC NHẬN DIỆN SUBDOMAIN ---
const hostname = window.location.hostname;
// Kiểm tra xem có phải đang truy cập qua admin.casardoor.vn hay không
const isAdminSubdomain = hostname.startsWith('admin.');

// Cấu hình các Route dành riêng cho Admin (Dùng cho subdomain admin.*)
const adminRoutes = [
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    element: <ProtectedRoute />, 
    children: [
      {
        path: "/", // Ở subdomain admin, "/" chính là Dashboard
        element: <AdminLayout />,
        children: [
          { index: true, element: <Dashboard /> }, 
          { path: "products", element: <AdminProductList /> },
          { path: "products/new", element: <ProductAdd /> },
          { path: "products/edit/:id", element: <ProductEdit /> },
          { path: "contacts", element: <ContactList /> },
          { path: "profile", element: <ProfilePage /> },
          {
            element: <AdminRoute />,
            children: [
               { path: "users", element: <UserList /> },
               { path: "settings", element: <Settings /> }
            ]
          }
        ],
      }
    ]
  },
  // Redirect mọi path lạ ở subdomain admin về root (Dashboard)
  { path: "*", element: <Navigate to="/" replace /> }
];

// Cấu hình các Route dành cho Client (casardoor.vn)
const clientRoutes = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "san-pham", element: <ClientProductList /> },
      { path: "san-pham/:slug", element: <ProductDetail /> },
      { path: "ve-chung-toi", element: <AboutPage /> },
      { path: "lien-he", element: <ContactPage /> },
      { path: "chinh-sach-bao-hanh", element: <WarrantyPage /> },
      { path: "quy-trinh-lam-viec", element: <ProcessPage /> },
      { path: "cau-hoi-thuong-gap", element: <FAQPage /> },
    ],
  },
  { path: "/login", element: <LoginPage /> },
  // Vẫn giữ đường dẫn /admin cho domain chính nếu bạn muốn
  {
    path: "/admin",
    element: <ProtectedRoute />,
    children: [
        { 
            element: <AdminLayout />, 
            children: [{ index: true, element: <Dashboard /> }, /* ... các sub-route khác nếu cần */] 
        }
    ]
  }
];

// Khởi tạo router dựa trên Hostname
const router = createBrowserRouter(isAdminSubdomain ? adminRoutes : clientRoutes);

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