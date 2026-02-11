import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { doorService } from '../../services/doorService';

const ProfilePage = () => {
  const { currentUser, userRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'general' | 'security'>('general');
  const [loading, setLoading] = useState(false);

  // State Form thông tin
  const [displayName, setDisplayName] = useState('');

  // State Form mật khẩu
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });

  useEffect(() => {
    if (currentUser?.displayName) {
      setDisplayName(currentUser.displayName);
    }
  }, [currentUser]);

  // --- XỬ LÝ CẬP NHẬT TÊN ---
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setLoading(true);

    const success = await doorService.updateCurrentUser(currentUser, displayName);
    setLoading(false);

    if (success) alert("✅ Cập nhật tên thành công! Hãy F5 lại trang để thấy thay đổi.");
    else alert("❌ Có lỗi xảy ra!");
  };

  // --- XỬ LÝ ĐỔI MẬT KHẨU ---
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (passwords.new.length < 6) return alert("Mật khẩu phải từ 6 ký tự!");
    if (passwords.new !== passwords.confirm) return alert("Mật khẩu xác nhận không khớp!");

    if (!window.confirm("Bạn chắc chắn muốn đổi mật khẩu?")) return;

    setLoading(true);
    const result = await doorService.changePassword(currentUser, passwords.new);
    setLoading(false);

    if (result.success) {
      alert("✅ Đổi mật khẩu thành công!");
      setPasswords({ new: '', confirm: '' });
    } else {
      alert("❌ Lỗi: " + result.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mb-20 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Hồ sơ cá nhân</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* --- CỘT TRÁI: THÔNG TIN TÓM TẮT --- */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 p-1 mb-4 shadow-lg">
               <div className="w-full h-full bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-4xl font-black text-blue-600 dark:text-blue-400 uppercase">
                  {currentUser?.email?.charAt(0) || 'U'}
               </div>
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">{currentUser?.displayName || 'User'}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 font-mono">{currentUser?.email}</p>
            
            <div className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
              {userRole === 'admin' ? '👑 Administrator' : '👤 Staff Member'}
            </div>

            <div className="text-left border-t dark:border-gray-700 pt-4 text-sm text-gray-600 dark:text-gray-400 space-y-2">
               <div className="flex justify-between">
                 <span>Ngày tham gia:</span>
                 <span className="font-bold text-gray-800 dark:text-gray-200">
                    {currentUser?.metadata.creationTime ? new Date(currentUser.metadata.creationTime).toLocaleDateString('vi-VN') : 'N/A'}
                 </span>
               </div>
               <div className="flex justify-between">
                 <span>Lần đăng nhập cuối:</span>
                 <span className="font-bold text-gray-800 dark:text-gray-200">
                    {currentUser?.metadata.lastSignInTime ? new Date(currentUser.metadata.lastSignInTime).toLocaleDateString('vi-VN') : 'N/A'}
                 </span>
               </div>
            </div>
          </div>
        </div>

        {/* --- CỘT PHẢI: FORM CHỈNH SỬA --- */}
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            
            {/* Tabs */}
            <div className="flex border-b dark:border-gray-700">
              <button 
                onClick={() => setActiveTab('general')}
                className={`flex-1 py-4 font-bold text-sm transition-colors border-b-2 
                  ${activeTab === 'general' 
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/10' 
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                Thông tin chung
              </button>
              <button 
                onClick={() => setActiveTab('security')}
                className={`flex-1 py-4 font-bold text-sm transition-colors border-b-2 
                  ${activeTab === 'security' 
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/10' 
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                Bảo mật & Mật khẩu
              </button>
            </div>

            <div className="p-6">
              {/* TAB 1: GENERAL INFO */}
              {activeTab === 'general' && (
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Email đăng nhập</label>
                    <input 
                      type="text" 
                      value={currentUser?.email || ''} 
                      disabled 
                      className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-400 mt-1">* Không thể thay đổi email.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Tên hiển thị</label>
                    <input 
                      type="text" 
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="pt-4 text-right">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold shadow-lg shadow-blue-200 dark:shadow-none disabled:opacity-50 transition-all"
                    >
                      {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: SECURITY */}
              {activeTab === 'security' && (
                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 p-4 rounded-lg text-sm text-yellow-800 dark:text-yellow-300 mb-4">
                    ⚠️ Lưu ý: Nếu bạn đăng nhập quá lâu, hệ thống có thể yêu cầu bạn đăng xuất và đăng nhập lại trước khi đổi mật khẩu để đảm bảo an toàn.
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Mật khẩu mới</label>
                    <input 
                      type="password" 
                      required
                      placeholder="Ít nhất 6 ký tự"
                      value={passwords.new}
                      onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Xác nhận mật khẩu mới</label>
                    <input 
                      type="password" 
                      required
                      placeholder="Nhập lại mật khẩu mới"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="pt-4 text-right">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-bold shadow-lg shadow-red-200 dark:shadow-none disabled:opacity-50 transition-all"
                    >
                      {loading ? 'Đang xử lý...' : 'Đổi Mật Khẩu'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;