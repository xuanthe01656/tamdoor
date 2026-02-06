import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = () => {
  const { currentUser, loading } = useAuth();

  // Đợi AuthContext load xong mới kiểm tra
  if (loading) return <div className="p-10 text-center">⏳ Đang kiểm tra bảo mật...</div>;

  // Nếu chưa đăng nhập -> Đá về Login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Nếu đã đăng nhập -> Cho phép vào (Render các Route con)
  return <Outlet />;
};

export default ProtectedRoute;