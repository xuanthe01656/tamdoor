import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminRoute = () => {
  const { userRole, loading } = useAuth();

  if (loading) return <div className="p-10 text-center">⏳ Đang kiểm tra quyền...</div>;

  // Nếu không phải là Admin -> Chặn ngay
  if (userRole !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="text-6xl mb-4">⛔</div>
        <h2 className="text-2xl font-bold text-red-600 mb-2">Truy cập bị từ chối!</h2>
        <p className="text-gray-600">Bạn không có quyền truy cập vào trang quản trị cao cấp này.</p>
        <p className="text-gray-500 text-sm mt-2">(Chỉ dành cho tài khoản Admin)</p>
      </div>
    );
  }

  // Nếu là Admin -> Cho qua
  return <Outlet />;
};

export default AdminRoute;