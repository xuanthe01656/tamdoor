import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'; // 👇 Thêm createUser...
import { auth, db } from '../../config/firebase'; // 👇 Thêm db
import { doc, setDoc } from 'firebase/firestore'; // 👇 Thêm doc, setDoc
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 1. HÀM ĐĂNG NHẬP (Cũ)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin'); 
    } catch (err: any) {
      console.error(err);
      setError('Sai email hoặc mật khẩu!');
    } finally {
      setLoading(false);
    }
  };

  // 2. HÀM TẠO ADMIN (MỚI - DÙNG 1 LẦN RỒI XÓA)
  const handleCreateAdmin = async () => {
    if (!email || !password) {
      setError("Vui lòng nhập Email và Mật khẩu để tạo Admin!");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu phải từ 6 ký tự trở lên!");
      return;
    }

    setLoading(true);
    try {
      // a. Tạo user trong Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // b. Lưu quyền 'admin' vào Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name: "Super Admin",
        role: "admin", // 🔑 QUAN TRỌNG NHẤT: Cấp quyền admin
        createdAt: new Date()
      });

      alert("✅ Đã tạo tài khoản Admin thành công! Giờ bạn có thể đăng nhập.");
      setError('');
    } catch (err: any) {
      console.error(err);
      setError("Lỗi tạo tài khoản: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">ĐĂNG NHẬP HỆ THỐNG</h2>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input 
              type="email" required 
              className="w-full p-3 border rounded focus:outline-none focus:border-blue-500"
              placeholder="admin@casardoor.vn"
              value={email} onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Mật khẩu</label>
            <input 
              type="password" required 
              className="w-full p-3 border rounded focus:outline-none focus:border-blue-500"
              placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)}
            />
          </div>
          
          <button 
            type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Đang xử lý...' : 'Đăng Nhập'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;