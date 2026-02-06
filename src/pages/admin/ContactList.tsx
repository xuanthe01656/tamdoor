import { useEffect, useState } from 'react';
import { doorService } from '../../services/doorService';
import { ContactRequest } from '../../interfaces/door';

const ContactList = () => {
  const [contacts, setContacts] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Load dữ liệu
  const fetchContacts = async () => {
    setLoading(true);
    const data = await doorService.getAllContacts();
    setContacts(data as ContactRequest[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Xử lý đổi trạng thái
  const handleStatusChange = async (id: string, newStatus: 'new' | 'contacted' | 'spam') => {
    const success = await doorService.updateContactStatus(id, newStatus);
    if (success) {
      setContacts(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    }
  };

  // Xử lý xóa
  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa liên hệ này không?')) {
      const success = await doorService.deleteContact(id);
      if (success) {
        setContacts(prev => prev.filter(c => c.id !== id));
      }
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '---';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('vi-VN');
  };

  if (loading) return <div className="p-8 text-center text-gray-500 dark:text-gray-400">⏳ Đang tải danh sách...</div>;

  return (
    // THÊM: dark:bg-gray-800 dark:border-gray-700
    <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 mb-20 transition-colors duration-300">
      
      <div className="flex justify-between items-center mb-6">
        {/* THÊM: dark:text-white */}
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">📩 Danh sách Yêu cầu & Báo giá</h1>
        {/* THÊM: dark:text-blue-400 */}
        <button onClick={fetchContacts} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-bold">↻ Làm mới</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            {/* THÊM: dark:bg-gray-700/50 dark:text-gray-300 dark:border-gray-700 */}
            <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 uppercase text-xs tracking-wider border-b dark:border-gray-700">
              <th className="p-4">Ngày gửi</th>
              <th className="p-4">Khách hàng</th>
              <th className="p-4">Nội dung</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {contacts.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-400 dark:text-gray-500">Chưa có liên hệ nào</td></tr>
            ) : (
              contacts.map((contact) => (
                // THÊM: dark:border-gray-700 dark:hover:bg-gray-700/50
                <tr key={contact.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  
                  {/* Cột 1: Thời gian */}
                  {/* THÊM: dark:text-gray-400 */}
                  <td className="p-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {formatDate(contact.createdAt)}
                  </td>

                  {/* Cột 2: Thông tin khách */}
                  <td className="p-4">
                    {/* THÊM: dark:text-white */}
                    <p className="font-bold text-gray-900 dark:text-white">{contact.name}</p>
                    {/* THÊM: dark:text-blue-400 */}
                    <p className="text-blue-600 dark:text-blue-400 font-mono">{contact.phone}</p>
                    {contact.email && <p className="text-gray-400 dark:text-gray-500 text-xs">{contact.email}</p>}
                  </td>

                  {/* Cột 3: Tin nhắn */}
                  <td className="p-4 max-w-xs">
                    {/* THÊM: dark:text-gray-300 */}
                    <p className="text-gray-600 dark:text-gray-300 line-clamp-2" title={contact.message}>
                      {contact.message}
                    </p>
                  </td>

                  {/* Cột 4: Trạng thái */}
                  <td className="p-4">
                    <select 
                      value={contact.status} 
                      onChange={(e) => handleStatusChange(contact.id!, e.target.value as any)}
                      // LOGIC MÀU SẮC CHO DARK MODE:
                      // Thay vì bg-green-100 (quá sáng), dùng dark:bg-green-900/30 (tối thẫm, trong suốt)
                      className={`
                        px-3 py-1 rounded-full text-xs font-bold border-none outline-none cursor-pointer appearance-none transition-colors
                        ${contact.status === 'new' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : ''}
                        ${contact.status === 'contacted' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                        ${contact.status === 'spam' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : ''}
                      `}
                    >
                      <option value="new" className="dark:bg-gray-800">🌟 Mới</option>
                      <option value="contacted" className="dark:bg-gray-800">✅ Đã xử lý</option>
                      <option value="spam" className="dark:bg-gray-800">🚫 Spam/Rác</option>
                    </select>
                  </td>

                  {/* Cột 5: Nút xóa */}
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleDelete(contact.id!)}
                      // THÊM: dark:text-gray-500 dark:hover:text-red-400
                      className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors p-2"
                      title="Xóa"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactList;