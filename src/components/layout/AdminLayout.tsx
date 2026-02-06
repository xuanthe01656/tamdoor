import { Link, Outlet, useLocation } from 'react-router-dom';

const AdminLayout = () => {
  const location = useLocation();

  // Danh sách menu
  const menuItems = [
    { path: '/admin', label: '📊 Thống kê (Dashboard)' },
    { path: '/admin/products', label: '📦 Quản lý Sản phẩm' },
    { path: '/admin/orders', label: '🛒 Đơn hàng (Coming soon)' },
    { path: '/admin/settings', label: '⚙️ Cấu hình hệ thống' },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100 font-sans">
      {/* SIDEBAR BÊN TRÁI */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:block">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold text-blue-500">CASARDOOR<span className="text-white text-sm ml-1">ADMIN</span></h1>
        </div>
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-3 rounded transition-colors ${
                location.pathname === item.path 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-gray-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
          {/* Nút đăng xuất (để hờ đó) */}
          <button className="w-full text-left px-4 py-3 text-red-400 hover:bg-slate-800 rounded mt-10">
            🚪 Đăng xuất
          </button>
        </nav>
      </aside>

      {/* NỘI DUNG CHÍNH BÊN PHẢI */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Admin */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
          <h2 className="text-xl font-bold text-gray-800">Trang Quản Trị</h2>
          <div className="flex items-center gap-4">
             <span className="text-sm font-medium text-gray-600">Xin chào, Admin</span>
             <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">A</div>
          </div>
        </header>

        {/* Nội dung thay đổi (Outlet) */}
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;