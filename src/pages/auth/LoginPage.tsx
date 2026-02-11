import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth'; 
import { auth } from '../../config/firebase'; 
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // 1. Import useAuth

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 2. Lấy thông tin userRole và currentUser từ Context
  const { userRole, currentUser } = useAuth(); 

  // 3. EFFECT: Tự động chuyển hướng khi phát hiện đã là Admin
  // Logic: Bất cứ khi nào userRole thay đổi thành 'admin', tự động nhảy trang
  useEffect(() => {
    if (currentUser && userRole === 'admin') {
      navigate('/admin');
    }
  }, [currentUser, userRole, navigate]);

  // HÀM ĐĂNG NHẬP
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // 4. QUAN TRỌNG: Xóa dòng navigate('/admin') ở đây đi.
      // Hãy để useEffect ở trên tự lo việc chuyển hướng khi dữ liệu load xong.
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('❌ Email hoặc mật khẩu không chính xác!');
      } else if (err.code === 'auth/too-many-requests') {
        setError('⚠️ Đăng nhập thất bại quá nhiều lần. Vui lòng thử lại sau.');
      } else {
        setError('❌ Lỗi đăng nhập: ' + err.message);
      }
      setLoading(false); // Chỉ tắt loading khi có lỗi
    } 
    // Lưu ý: Không tắt loading ở finally nếu thành công, để tránh UI bị giật về form đăng nhập trước khi chuyển trang
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-300 p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-gray-700">
        
        <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-blue-700 dark:text-blue-500 mb-2">CASAR<span className="text-gray-800 dark:text-white">ADMIN</span></h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Đăng nhập để quản lý hệ thống</p>
        </div>
        
        {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 p-3 rounded-lg mb-6 text-sm font-medium border border-red-100 dark:border-red-800 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
            </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Email</label>
            <input 
              type="email" required 
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
              placeholder="admin@casardoor.vn"
              value={email} onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold">Mật khẩu</label>
            </div>
            <input 
              type="password" required 
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
              placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)}
            />
          </div>
          
          <button 
            type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-lg font-bold transition-all shadow-lg shadow-blue-200 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? '⏳ Đang xác thực...' : 'ĐĂNG NHẬP'}
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-gray-100 dark:border-gray-700">
            <Link to="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-1">
                ← Quay về trang chủ
            </Link>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;