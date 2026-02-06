import { useEffect, useState } from 'react';
import { doorService } from '../../services/doorService';

const UserList = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal Thêm mới
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', pass: '', role: 'staff' });
  const [creating, setCreating] = useState(false);

  // Modal Chỉnh sửa
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [updating, setUpdating] = useState(false);

  // Load dữ liệu
  const fetchUsers = async () => {
    setLoading(true);
    const data = await doorService.getAllUsers();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- XỬ LÝ THÊM MỚI ---
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newUser.pass.length < 6) return alert("Mật khẩu phải từ 6 ký tự!");
    
    setCreating(true);
    const success = await doorService.createUser(newUser);
    setCreating(false);

    if (success) {
        alert("✅ Tạo tài khoản thành công!");
        setShowAddModal(false);
        setNewUser({ name: '', email: '', pass: '', role: 'staff' });
        fetchUsers();
    }
  };

  // --- XỬ LÝ CẬP NHẬT ---
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setUpdating(true);
    const success = await doorService.updateUser(editingUser.id, {
        name: editingUser.name,
        role: editingUser.role
    });
    setUpdating(false);

    if (success) {
        alert("✅ Cập nhật thông tin thành công!");
        setEditingUser(null);
        fetchUsers();
    }
  };

  // --- XỬ LÝ GỬI MAIL RESET PASS ---
  const handleResetPassword = async () => {
    if (!editingUser?.email) return;
    if (window.confirm(`Bạn có chắc muốn gửi email đặt lại mật khẩu cho ${editingUser.email} không?`)) {
        const success = await doorService.sendPasswordReset(editingUser.email);
        if (success) {
            alert(`✅ Đã gửi email!\nHãy bảo nhân viên kiểm tra hộp thư (cả mục Spam) để đặt mật khẩu mới.`);
        }
    }
  };

  // --- XỬ LÝ XÓA ---
  const handleDelete = async (id: string, role: string) => {
    if (role === 'admin') return alert("⛔ Không thể xóa tài khoản Admin!");
    if (window.confirm("Bạn có chắc muốn chặn quyền truy cập của nhân viên này?")) {
        const success = await doorService.deleteUser(id);
        if (success) setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  if (loading) return <div className="p-10 text-center dark:text-gray-400">⏳ Đang tải danh sách nhân sự...</div>;

  return (
    // DARK MODE: bg-gray-800 border-gray-700
    <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 mb-20 transition-colors duration-300">
      
      <div className="flex justify-between items-center mb-6">
        {/* DARK MODE: text-white */}
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">👥 Quản lý Nhân sự</h1>
        <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-blue-200 dark:shadow-none transition-all"
        >
            + Thêm Nhân Viên
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            {/* DARK MODE: bg-gray-700/50 text-gray-300 border-gray-700 */}
            <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 uppercase text-xs tracking-wider border-b dark:border-gray-700">
              <th className="p-4">Họ tên</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phân quyền</th>
              <th className="p-4">Ngày tạo</th>
              <th className="p-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {users.map((user) => (
                // DARK MODE: border-gray-700 hover:bg-gray-700/50
                <tr key={user.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    {/* DARK MODE: text-white */}
                    <td className="p-4 font-bold text-gray-800 dark:text-white">{user.name}</td>
                    {/* DARK MODE: text-blue-400 */}
                    <td className="p-4 font-mono text-blue-600 dark:text-blue-400">{user.email}</td>
                    <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                            user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' 
                            : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                        }`}>
                            {user.role === 'admin' ? '👑 Admin' : '👤 Staff'}
                        </span>
                    </td>
                    {/* DARK MODE: text-gray-400 */}
                    <td className="p-4 text-gray-500 dark:text-gray-400 text-xs">
                        {user.createdAt?.seconds ? new Date(user.createdAt.seconds * 1000).toLocaleDateString('vi-VN') : '---'}
                    </td>
                    <td className="p-4 text-center space-x-2">
                        {/* NÚT SỬA */}
                        <button 
                            onClick={() => setEditingUser(user)}
                            className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 p-2 rounded transition"
                            title="Sửa thông tin"
                        >
                            ✏️ Sửa
                        </button>

                        {/* NÚT XÓA */}
                        {user.role !== 'admin' && (
                            <button 
                                onClick={() => handleDelete(user.id, user.role)}
                                className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 p-2 rounded transition"
                                title="Chặn truy cập"
                            >
                                🗑️ Xóa
                            </button>
                        )}
                    </td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MODAL 1: THÊM MỚI (ADD) --- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            {/* DARK MODE: bg-gray-800 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-bold mb-4 text-blue-700 dark:text-blue-400">Thêm tài khoản mới</h2>
                <form onSubmit={handleCreate} className="space-y-4">
                    {/* INPUTS: dark:bg-gray-700 dark:border-gray-600 dark:text-white */}
                    <div>
                        <label className="block text-sm font-bold mb-1 dark:text-gray-300">Họ và tên</label>
                        <input required type="text" className="w-full border dark:border-gray-600 p-2 rounded dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1 dark:text-gray-300">Email</label>
                        <input required type="email" className="w-full border dark:border-gray-600 p-2 rounded dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1 dark:text-gray-300">Mật khẩu</label>
                        <input required type="password" className="w-full border dark:border-gray-600 p-2 rounded dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500" value={newUser.pass} onChange={e => setNewUser({...newUser, pass: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1 dark:text-gray-300">Phân quyền</label>
                        <select className="w-full border dark:border-gray-600 p-2 rounded dark:bg-gray-700 dark:text-white outline-none" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                            <option value="staff">👤 Nhân viên (Staff)</option>
                            <option value="admin">👑 Quản trị viên (Admin)</option>
                        </select>
                    </div>
                    
                    <div className="flex gap-3 mt-6 pt-4 border-t dark:border-gray-700">
                        <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded font-bold text-gray-600 dark:text-gray-300 transition-colors">Hủy</button>
                        <button type="submit" disabled={creating} className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded font-bold text-white disabled:opacity-50 transition-colors">
                            {creating ? 'Đang tạo...' : 'Xác nhận'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* --- MODAL 2: CHỈNH SỬA (EDIT) --- */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-orange-600 dark:text-orange-400">Cập nhật thông tin</h2>
                    <button onClick={() => setEditingUser(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">✕</button>
                </div>
                
                <form onSubmit={handleUpdate} className="space-y-4">
                    {/* Email (Read only) */}
                    <div>
                        <label className="block text-sm font-bold mb-1 text-gray-500 dark:text-gray-500">Email (Không thể sửa)</label>
                        {/* DARK MODE: bg-gray-900 text-gray-500 */}
                        <input type="text" disabled className="w-full border dark:border-gray-600 p-2 rounded bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-500 cursor-not-allowed" value={editingUser.email} />
                    </div>

                    {/* Tên */}
                    <div>
                        <label className="block text-sm font-bold mb-1 dark:text-gray-300">Họ và tên</label>
                        <input required type="text" className="w-full border dark:border-gray-600 p-2 rounded dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500" value={editingUser.name} onChange={e => setEditingUser({...editingUser, name: e.target.value})} />
                    </div>

                    {/* Quyền */}
                    <div>
                        <label className="block text-sm font-bold mb-1 dark:text-gray-300">Phân quyền</label>
                        <select className="w-full border dark:border-gray-600 p-2 rounded dark:bg-gray-700 dark:text-white outline-none" value={editingUser.role} onChange={e => setEditingUser({...editingUser, role: e.target.value})}>
                            <option value="staff">👤 Nhân viên (Staff)</option>
                            <option value="admin">👑 Quản trị viên (Admin)</option>
                        </select>
                    </div>

                    {/* Reset Mật khẩu */}
                    {/* DARK MODE: bg-yellow-900/20 border-yellow-700/50 */}
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-700/50 mt-4">
                        <p className="text-xs text-yellow-800 dark:text-yellow-300 mb-2">⚠ Không thể đổi mật khẩu trực tiếp. Hãy gửi mail để nhân viên tự đặt lại.</p>
                        <button 
                            type="button" 
                            onClick={handleResetPassword}
                            // DARK MODE: bg-gray-800 border-yellow-600 text-yellow-400
                            className="w-full py-2 bg-white dark:bg-gray-800 border border-yellow-500 dark:border-yellow-600 text-yellow-700 dark:text-yellow-400 font-bold text-sm rounded hover:bg-yellow-100 dark:hover:bg-yellow-900/40 transition"
                        >
                            📨 Gửi Email đặt lại mật khẩu
                        </button>
                    </div>
                    
                    <div className="flex gap-3 mt-6 pt-4 border-t dark:border-gray-700">
                        <button type="button" onClick={() => setEditingUser(null)} className="flex-1 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded font-bold text-gray-600 dark:text-gray-300 transition-colors">Hủy</button>
                        <button type="submit" disabled={updating} className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 rounded font-bold text-white disabled:opacity-50 transition-colors">
                            {updating ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default UserList;