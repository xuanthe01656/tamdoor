import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; 

const AdminLayout = () => {
  const location = useLocation();
  const { currentUser, userRole, logout } = useAuth();

  // Kiểm tra xem đang ở subdomain admin hay không để điều chỉnh Path
  const isAdminSubdomain = window.location.hostname.startsWith('admin.');

  // --- 1. LOGIC DARK MODE (Giữ nguyên) ---
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // --- 2. LOGIC MENU (SỬA ĐƯỜNG DẪN) ---
  // Hàm bổ sung tiền tố /admin nếu KHÔNG phải subdomain
  const fixPath = (path: string) => {
    if (isAdminSubdomain) return path; // Nếu là admin.casardoor.vn thì giữ nguyên /products, /settings
    return path === '/' ? '/admin' : `/admin${path}`; // Nếu là domain chính thì thêm /admin/products
  };

  const baseMenu = [
    { path: '/', label: '📊 Thống kê (Dashboard)' },
    { path: '/products', label: '📦 Quản lý Sản phẩm' },
    { path: '/contacts', label: '📩 Liên hệ & Báo giá' },
  ];

  const adminMenu = [
    { path: '/users', label: '👥 Quản lý Nhân sự' },
    { path: '/settings', label: '⚙️ Cấu hình hệ thống' },
    { path: '/profile', label: '👤 Cá nhân' },
  ];

  const menuItems = userRole === 'admin' ? [...baseMenu, ...adminMenu] : baseMenu;

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 font-sans transition-colors duration-300">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-slate-900 dark:bg-gray-950 text-white flex-shrink-0 hidden md:flex flex-col border-r border-slate-700 dark:border-gray-800">
        <div className="p-6 border-b border-slate-700 dark:border-gray-800">
          <Link to="/" className="block">
            <h1 className="text-2xl font-bold text-blue-500 cursor-pointer tracking-wider">
              CASAR<span className="text-white text-sm ml-1">ADMIN</span>
            </h1>
          </Link>
        </div>
        
        <nav className="p-4 space-y-2 flex-1">
          {menuItems.map((item) => {
            const finalPath = fixPath(item.path);
            
            // Logic Active: Kiểm tra xem pathname hiện tại có khớp với link không
            const isActive = location.pathname === finalPath || 
                            (finalPath !== '/' && finalPath !== '/admin' && location.pathname.startsWith(finalPath));

            return (
              <Link
                key={item.path}
                to={finalPath}
                className={`block px-4 py-3 rounded-lg transition-all font-medium ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 translate-x-1' 
                    : 'text-gray-400 hover:bg-slate-800 dark:hover:bg-gray-800 hover:text-white hover:translate-x-1'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700 dark:border-gray-800">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors font-bold"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* HEADER */}
        <header className="bg-white dark:bg-gray-800 shadow-sm h-16 flex items-center justify-between px-6 sticky top-0 z-20 transition-colors duration-300 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            Trang Quản Trị
          </h2>
          
          <div className="flex items-center gap-6">
              {/* Sửa link xem website luôn trỏ về domain chính */}
              <a href="https://casardoor.vn" target="_blank" rel="noreferrer" className="text-sm text-blue-600 dark:text-blue-400 hover:underline hidden sm:block font-medium">
                Xem Website →
              </a>

              <button onClick={() => setDarkMode(!darkMode)} className="p-2 ...">
                {darkMode ? "☀️" : "🌙"}
              </button>

              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>

              <div className="flex items-center gap-3 group">
                  <div className="text-right hidden sm:block">
                     <Link to={fixPath('/profile')} className="block text-sm font-bold text-gray-800 dark:text-gray-200 hover:text-blue-600">
                        {currentUser?.displayName || 'Admin'}
                     </Link>
                     <div className="text-[10px] ... uppercase">
                        {userRole}
                     </div> 
                  </div>

                  <Link to={fixPath('/profile')} className="w-10 h-10 rounded-full ...">
                      <div className="w-full h-full ... flex items-center justify-center">
                        {currentUser?.email?.charAt(0).toUpperCase()}
                      </div>
                  </Link>
              </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 bg-slate-50 dark:bg-gray-900 transition-colors duration-300 relative">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;