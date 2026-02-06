import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; 

const AdminLayout = () => {
  const location = useLocation();
  const { currentUser, userRole, logout } = useAuth();

  // --- 1. LOGIC DARK MODE ---
  const [darkMode, setDarkMode] = useState(() => {
    // Kiểm tra LocalStorage, nếu không có thì check cài đặt hệ thống
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Effect: Xử lý class và color-scheme cho trình duyệt
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark'; // 👈 QUAN TRỌNG: Biến thanh cuộn thành màu tối
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // --- 2. LOGIC MENU ---
  const baseMenu = [
    { path: '/admin', label: '📊 Thống kê (Dashboard)' },
    { path: '/admin/products', label: '📦 Quản lý Sản phẩm' },
    { path: '/admin/contacts', label: '📩 Liên hệ & Báo giá' },
    { path: '/admin/orders', label: '🛒 Đơn hàng (Coming soon)' },
  ];

  const adminMenu = [
    { path: '/admin/users', label: '👥 Quản lý Nhân sự' },
    { path: '/admin/settings', label: '⚙️ Cấu hình hệ thống' },
  ];

  const menuItems = userRole === 'admin' ? [...baseMenu, ...adminMenu] : baseMenu;

  return (
    // MAIN CONTAINER: Chuyển màu mượt mà
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 font-sans transition-colors duration-300">
      
      {/* --- SIDEBAR --- */}
      {/* Light: bg-slate-900 (Xanh đen) | Dark: bg-black (Đen tuyền) hoặc giữ nguyên slate-900 tùy gu */}
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
            const isActive = item.path === '/admin' 
                ? location.pathname === '/admin'
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-3 rounded-lg transition-all font-medium ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 translate-x-1' // Active style
                    : 'text-gray-400 hover:bg-slate-800 dark:hover:bg-gray-800 hover:text-white hover:translate-x-1' // Inactive style
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
        {/* Light: bg-white | Dark: bg-gray-800 */}
        <header className="bg-white dark:bg-gray-800 shadow-sm h-16 flex items-center justify-between px-6 sticky top-0 z-20 transition-colors duration-300 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <span className="md:hidden">☰</span> {/* Hamburger icon cho mobile (Demo) */}
            Trang Quản Trị
          </h2>
          
          <div className="flex items-center gap-6">
             <Link to="/" className="text-sm text-blue-600 dark:text-blue-400 hover:underline hidden sm:block font-medium">
                Xem Website →
             </Link>

             {/* Nút Toggle Dark Mode */}
             <button 
               onClick={() => setDarkMode(!darkMode)}
               className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-600 dark:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
               title={darkMode ? "Chuyển sang chế độ Sáng" : "Chuyển sang chế độ Tối"}
             >
               {darkMode ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
               ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
               )}
             </button>

             <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>

             {/* Thông tin User */}
             <div className="flex items-center gap-3">
                 <div className="text-right hidden sm:block">
                    <div className="text-sm font-bold text-gray-800 dark:text-gray-200">
                        {currentUser?.email?.split('@')[0] || 'User'}
                    </div>
                    <div className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-800">
                        {userRole === 'admin' ? 'Super Admin' : 'Staff'}
                    </div> 
                 </div>
                 <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 p-0.5 shadow-md">
                    <div className="w-full h-full bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-blue-700 dark:text-blue-400 font-black text-lg">
                       {currentUser?.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                 </div>
             </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        {/* Light: bg-slate-50 | Dark: bg-gray-900 */}
        <div className="flex-1 overflow-auto p-6 bg-slate-50 dark:bg-gray-900 transition-colors duration-300 relative">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;