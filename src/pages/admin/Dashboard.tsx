import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { doorService } from '../../services/doorService';
import { ContactRequest } from '../../interfaces/door';

const Dashboard = () => {
  const [stats, setStats] = useState({
    productCount: 0,
    newContactCount: 0,
    orderCount: 0 // Demo
  });
  const [recentContacts, setRecentContacts] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Lấy tất cả sản phẩm để đếm
        const products = await doorService.getAllProducts();
        
        // 2. Lấy tất cả liên hệ
        const contacts = await doorService.getAllContacts();
        // Lọc ra liên hệ mới (status = 'new')
        const newContacts = (contacts as ContactRequest[]).filter(c => c.status === 'new');

        // 3. Cập nhật State
        setStats({
          productCount: products.length,
          newContactCount: newContacts.length,
          orderCount: 0 // Sau này có đơn hàng thì thay vào đây
        });

        // Lấy 5 liên hệ mới nhất để hiển thị
        setRecentContacts((contacts as ContactRequest[]).slice(0, 5));

      } catch (error) {
        console.error("Lỗi tải dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-10 text-center text-gray-500 dark:text-gray-400">⏳ Đang tổng hợp dữ liệu...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Tổng quan</h1>
      
      {/* 1. CÁC THẺ THỐNG KÊ (CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        {/* Card Sản phẩm */}
        <Link to="/admin/products" className="block transform transition-transform hover:-translate-y-1">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 border-blue-500 flex justify-between items-center">
            <div>
              <div className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">Tổng sản phẩm</div>
              <div className="text-3xl font-bold mt-2 text-gray-800 dark:text-white">{stats.productCount}</div>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            </div>
          </div>
        </Link>

        {/* Card Liên hệ mới */}
        <Link to="/admin/contacts" className="block transform transition-transform hover:-translate-y-1">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 border-green-500 flex justify-between items-center">
            <div>
              <div className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">Liên hệ mới</div>
              <div className="text-3xl font-bold mt-2 text-gray-800 dark:text-white">{stats.newContactCount}</div>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
          </div>
        </Link>

        {/* Card Đơn hàng (Demo) */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 border-yellow-500 flex justify-between items-center opacity-70">
            <div>
              <div className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">Đơn hàng (Demo)</div>
              <div className="text-3xl font-bold mt-2 text-gray-800 dark:text-white">0</div>
            </div>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-full text-yellow-600 dark:text-yellow-400">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </div>
        </div>
      </div>

      {/* 2. HOẠT ĐỘNG GẦN ĐÂY */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h3 className="font-bold text-gray-800 dark:text-white">📩 Yêu cầu tư vấn gần đây</h3>
          <Link to="/admin/contacts" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Xem tất cả →</Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-xs uppercase">
              <tr>
                <th className="px-6 py-3">Khách hàng</th>
                <th className="px-6 py-3">Số điện thoại</th>
                <th className="px-6 py-3">Trạng thái</th>
                <th className="px-6 py-3">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {recentContacts.length === 0 ? (
                <tr>
                   <td colSpan={4} className="px-6 py-8 text-center text-gray-400 dark:text-gray-500">Chưa có dữ liệu mới</td>
                </tr>
              ) : (
                recentContacts.map((contact, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{contact.name}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-mono">{contact.phone}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold 
                        ${contact.status === 'new' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : ''}
                        ${contact.status === 'contacted' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                        ${contact.status === 'spam' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : ''}
                      `}>
                        {contact.status === 'new' ? 'Mới' : (contact.status === 'contacted' ? 'Đã xử lý' : 'Spam')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 dark:text-gray-500 text-sm">
                       {contact.createdAt?.toDate ? contact.createdAt.toDate().toLocaleDateString('vi-VN') : '---'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;