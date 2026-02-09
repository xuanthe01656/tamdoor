import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminRoute = () => {
  const { userRole, loading } = useAuth();

  if (loading) return <div className="p-10 text-center text-gray-500 dark:text-gray-400">⏳ Đang kiểm tra quyền...</div>;

  // Nếu không phải là Admin -> Chặn ngay
  if (userRole !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 animate-fade-in">
        <div className="text-7xl mb-4 opacity-80">⛔</div>
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Truy cập bị từ chối!</h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
          Bạn không có quyền truy cập vào khu vực này. Trang này chỉ dành cho tài khoản có quyền <span className="font-bold">Quản trị viên (Admin)</span>.
        </p>
        
        <div className="mt-6">
            <Link 
                to="/admin" 
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors shadow-lg"
            >
                ← Quay lại Dashboard
            </Link>
        </div>
      </div>
    );
  }

  // Nếu là Admin -> Cho qua
  return <Outlet />;
};

export default AdminRoute;