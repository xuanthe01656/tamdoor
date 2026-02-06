import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { doorService } from '../../services/doorService';
import { Door } from '../../interfaces/door';

// Số sản phẩm trên 1 trang
const ITEMS_PER_PAGE = 8;

const AdminProductList = () => {
  const navigate = useNavigate();
  
  // --- STATE ---
  const [allProducts, setAllProducts] = useState<Door[]>([]); // Lưu gốc toàn bộ
  const [loading, setLoading] = useState(true);
  
  // State bộ lọc
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [categories, setCategories] = useState<string[]>([]); // Để đổ vào dropdown

  // State phân trang
  const [currentPage, setCurrentPage] = useState(1);

  // --- 1. LẤY DỮ LIỆU ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy sản phẩm
        const data = await doorService.getAllProducts();
        setAllProducts(data.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));

        // Lấy danh mục từ Settings (để làm bộ lọc)
        const settings = await doorService.getSettings();
        if (settings.categories) setCategories(settings.categories);
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- 2. XỬ LÝ LỌC & TÌM KIẾM (Client-side) ---
  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      // Lọc theo tên
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      // Lọc theo danh mục
      const matchesCategory = filterCategory === 'All' || product.category === filterCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [allProducts, searchTerm, filterCategory]);

  // --- 3. XỬ LÝ PHÂN TRANG ---
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset về trang 1 khi filter thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCategory]);

  // --- 4. HÀM XỬ LÝ ---
  const handleDelete = async (id: string) => {
    if (!window.confirm("⚠️ CẢNH BÁO: Bạn có chắc chắn muốn xóa? Hành động này không thể hoàn tác!")) return;

    const success = await doorService.deleteProduct(id);
    if (success) {
      setAllProducts(prev => prev.filter(item => item.id !== id));
      alert("✅ Đã xóa thành công!");
    } else {
      alert("❌ Xóa thất bại.");
    }
  };

  const handleEdit = (id: string) => {
    // Chuyển hướng sang trang Edit (Sẽ tạo ở bước sau)
    navigate(`/admin/products/edit/${id}`);
  };

  if (loading) return <div className="p-10 text-center text-gray-500">⏳ Đang tải dữ liệu...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      
      {/* HEADER & TOOLBAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý sản phẩm</h1>
          <p className="text-sm text-gray-500 mt-1">Tổng cộng: <span className="font-bold text-blue-600">{filteredProducts.length}</span> sản phẩm</p>
        </div>
        <button 
          onClick={() => navigate('/admin/products/new')} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold shadow-lg shadow-blue-100 transition-all active:scale-95"
        >
          <span className="text-xl leading-none">+</span> Thêm mới
        </button>
      </div>

      {/* BỘ LỌC (SEARCH & FILTER) */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
        {/* Tìm kiếm */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên sản phẩm..."
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Lọc danh mục */}
        <div className="w-full md:w-64">
          <select
            className="block w-full py-2.5 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="All">📂 Tất cả danh mục</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* BẢNG SẢN PHẨM */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-xs font-bold tracking-wider">
              <th className="p-4 border-b">Hình ảnh</th>
              <th className="p-4 border-b">Thông tin sản phẩm</th>
              <th className="p-4 border-b">Danh mục</th>
              <th className="p-4 border-b">Giá bán</th>
              <th className="p-4 border-b text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <tr key={product.id} className="hover:bg-blue-50/50 transition-colors group">
                  <td className="p-4">
                    <div className="w-16 h-16 rounded-lg border border-gray-200 overflow-hidden bg-white shadow-sm relative">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null; 
                          target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 100 100'%3E%3Crect fill='%23f3f4f6' x='0' y='0' width='100' height='100'/%3E%3Ctext fill='%239ca3af' x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='sans-serif' font-size='12'%3ENo Img%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-gray-900 line-clamp-1 text-base">{product.name}</div>
                    <div className="text-xs text-gray-500 mt-1 font-mono flex items-center gap-2">
                       <span className="bg-gray-100 px-1.5 py-0.5 rounded">ID: {product.id?.slice(0, 6)}</span>
                       {/* Nếu có thương hiệu thì hiện */}
                       {product.specifications?.find(s => s.key === 'Thương hiệu')?.value && (
                         <span className="text-blue-600">• {product.specifications.find(s => s.key === 'Thương hiệu')?.value}</span>
                       )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.type === 'door' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {product.category}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-gray-800">
                    {product.price > 0 
                      ? product.price.toLocaleString('vi-VN') + ' đ' 
                      : <span className="text-red-500 text-xs bg-red-50 px-2 py-1 rounded">LIÊN HỆ</span>
                    }
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-3">
                      <button 
                        onClick={() => handleEdit(product.id || '')}
                        className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-all"
                        title="Chỉnh sửa"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id || '')}
                        className="text-gray-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-all"
                        title="Xóa"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-12 text-center text-gray-400">
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <span>Không tìm thấy sản phẩm nào phù hợp.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER PHÂN TRANG */}
      {filteredProducts.length > 0 && (
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
          <div className="text-sm text-gray-500">
            Hiển thị <span className="font-bold text-gray-900">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> đến <span className="font-bold text-gray-900">{Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)}</span> trong số <span className="font-bold text-gray-900">{filteredProducts.length}</span> sản phẩm
          </div>
          
          <div className="flex gap-1">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
               <button
                 key={page}
                 onClick={() => setCurrentPage(page)}
                 className={`w-8 h-8 rounded-md text-sm font-bold transition-colors ${
                   currentPage === page 
                   ? 'bg-blue-600 text-white shadow-md' 
                   : 'text-gray-600 hover:bg-gray-100 border border-gray-200'
                 }`}
               >
                 {page}
               </button>
            ))}

            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductList;