import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { doorService } from '../../services/doorService';
import { ContactRequest } from '../../interfaces/door';

const Dashboard = () => {
  const [stats, setStats] = useState({
    productCount: 0,
    newContactCount: 0,
    orderCount: 0 
  });
  const [recentContacts, setRecentContacts] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // --- LOGIC NHẬN DIỆN SUBDOMAIN ĐỂ FIX LINK ---
  const isAdminSubdomain = window.location.hostname.startsWith('admin.');
  const fixPath = (path: string) => {
    if (isAdminSubdomain) return path; 
    return `/admin${path}`; 
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const products = await doorService.getAllProducts();
        const contacts = await doorService.getAllContacts();
        const newContacts = (contacts as ContactRequest[]).filter(c => c.status === 'new');

        setStats({
          productCount: products.length,
          newContactCount: newContacts.length,
          orderCount: 0 
        });

        // Lấy 5 liên hệ mới nhất
        setRecentContacts((contacts as ContactRequest[]).slice(0, 5));

      } catch (error) {
        console.error("Lỗi tải dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <div className="p-10 text-center flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 dark:text-gray-400 font-bold">⏳ Đang tổng hợp dữ liệu...</p>
    </div>
  );

  return (
    <div className="animate-fadeIn">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 tracking-tight">Tổng quan hệ thống</h1>
      
      {/* 1. CÁC THẺ THỐNG KÊ (CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        {/* Card Sản phẩm */}
        <Link to={fixPath('/products')} className="block group">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-xl hover:-translate-y-1 flex justify-between items-center">
            <div>
              <div className="text-gray-400 dark:text-gray-500 text-xs font-black uppercase tracking-widest">Tổng sản phẩm</div>
              <div className="text-4xl font-black mt-2 text-gray-800 dark:text-white group-hover:text-blue-600 transition-colors">{stats.productCount}</div>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            </div>
          </div>
        </Link>

        {/* Card Liên hệ mới */}
        <Link to={fixPath('/contacts')} className="block group">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 transition-all hover:shadow-xl hover:-translate-y-1 flex justify-between items-center">
            <div>
              <div className="text-gray-400 dark:text-gray-500 text-xs font-black uppercase tracking-widest">Liên hệ mới</div>
              <div className="text-4xl font-black mt-2 text-gray-800 dark:text-white group-hover:text-green-600 transition-colors">{stats.newContactCount}</div>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl text-green-600 dark:text-green-400 group-hover:bg-green-600 group-hover:text-white transition-all">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
          </div>
        </Link>

        {/* Card Đơn hàng */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-center opacity-60 grayscale hover:grayscale-0 transition-all cursor-not-allowed">
            <div>
              <div className="text-gray-400 dark:text-gray-500 text-xs font-black uppercase tracking-widest">Đơn hàng (Sắp có)</div>
              <div className="text-4xl font-black mt-2 text-gray-800 dark:text-white">0</div>
            </div>
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl text-yellow-600 dark:text-yellow-400">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </div>
        </div>
      </div>

      {/* 2. HOẠT ĐỘNG GẦN ĐÂY */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
          <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <span className="text-blue-600">📩</span> Yêu cầu tư vấn mới nhất
          </h3>
          <Link to={fixPath('/contacts')} className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors px-4 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            Xem tất cả
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-700/30 text-gray-400 dark:text-gray-500 text-[10px] uppercase font-black tracking-widest border-b dark:border-gray-700">
                <th className="px-6 py-4">Khách hàng</th>
                <th className="px-6 py-4">Số điện thoại</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {recentContacts.length === 0 ? (
                <tr>
                   <td colSpan={4} className="px-6 py-12 text-center text-gray-400 dark:text-gray-500 italic">Chưa có yêu cầu tư vấn nào được ghi nhận.</td>
                </tr>
              ) : (
                recentContacts.map((contact, idx) => (
                  <tr key={idx} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/5 transition-colors">
                    <td className="px-6 py-4">
                        <div className="font-bold text-gray-800 dark:text-white">{contact.name}</div>
                        <div className="text-[10px] text-gray-400 truncate max-w-[200px]">{contact.message}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-mono text-sm">{contact.phone}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter
                        ${contact.status === 'new' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : ''}
                        ${contact.status === 'contacted' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                        ${contact.status === 'spam' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : ''}
                      `}>
                        {contact.status === 'new' ? '🔥 Mới' : (contact.status === 'contacted' ? '✅ Đã xử lý' : '🚫 Spam')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 dark:text-gray-500 text-xs font-medium">
                       {contact.createdAt?.toDate ? contact.createdAt.toDate().toLocaleDateString('vi-VN') : '---'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default Dashboard;