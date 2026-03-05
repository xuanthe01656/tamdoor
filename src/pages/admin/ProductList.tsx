import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { doorService } from '../../services/doorService';
import { Door } from '../../interfaces/door';

// Số sản phẩm trên 1 trang
const ITEMS_PER_PAGE = 8;

const AdminProductList = () => {
  const navigate = useNavigate();
  
  // --- LOGIC NHẬN DIỆN SUBDOMAIN ---
  const isAdminSubdomain = window.location.hostname.startsWith('admin.');
  const fixPath = (path: string) => isAdminSubdomain ? path : `/admin${path}`;

  // --- STATE ---
  const [allProducts, setAllProducts] = useState<Door[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [categories, setCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  // State quản lý checkbox xóa nhiều
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // --- 1. LẤY DỮ LIỆU ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await doorService.getAllProducts();
        // Sắp xếp mới nhất lên đầu
        setAllProducts(data.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));

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

  // --- 2. LỌC & TÌM KIẾM ---
  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'All' || product.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allProducts, searchTerm, filterCategory]);

  // --- 3. PHÂN TRANG ---
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset trang và danh sách chọn khi đổi bộ lọc
  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds([]);
  }, [searchTerm, filterCategory]);

  // --- 4. HÀM XỬ LÝ CHECKBOX ---
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const currentPageIds = currentProducts.map(p => p.id).filter(Boolean) as string[];
      setSelectedIds(Array.from(new Set([...selectedIds, ...currentPageIds])));
    } else {
      const currentPageIds = currentProducts.map(p => p.id).filter(Boolean) as string[];
      setSelectedIds(selectedIds.filter(id => !currentPageIds.includes(id)));
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // --- 5. HÀM XỬ LÝ XÓA ---
  const handleDelete = async (id: string) => {
    if (!window.confirm("⚠️ CẢNH BÁO: Bạn có chắc chắn muốn xóa sản phẩm này?")) return;

    const success = await doorService.deleteProduct(id);
    if (success) {
      setAllProducts(prev => prev.filter(item => item.id !== id));
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id)); 
      alert("✅ Đã xóa thành công!");
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`⚠️ CẢNH BÁO: Bạn chuẩn bị xóa ${selectedIds.length} sản phẩm. Hành động này không thể hoàn tác!`)) return;

    let successCount = 0;
    for (const id of selectedIds) {
      const success = await doorService.deleteProduct(id);
      if (success) successCount++;
    }

    if (successCount > 0) {
      setAllProducts(prev => prev.filter(item => !selectedIds.includes(item.id as string)));
      setSelectedIds([]);
      alert(`✅ Đã xóa thành công ${successCount} sản phẩm!`);
    } else {
      alert("❌ Có lỗi xảy ra trong quá trình xóa.");
    }
  };

  const handleEdit = (id: string) => {
    navigate(fixPath(`/products/edit/${id}`)); 
  };

  const isAllCurrentPageSelected = currentProducts.length > 0 && currentProducts.every(p => p.id && selectedIds.includes(p.id));

  if (loading) return (
    <div className="p-20 text-center flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-bold text-gray-500">⏳ Đang tải danh sách sản phẩm...</p>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 animate-in fade-in duration-500">
      
      {/* HEADER & TOOLBAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-800 dark:text-white uppercase tracking-tight">Quản lý kho hàng</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Hiển thị <span className="font-bold text-blue-600">{filteredProducts.length}</span> sản phẩm
          </p>
        </div>
        
        <div className="flex gap-3">
          {selectedIds.length > 0 && (
            <button 
              onClick={handleBulkDelete}
              className="bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 hover:border-red-600 px-4 py-3 rounded-xl flex items-center gap-2 font-bold transition-all active:scale-95 text-sm"
            >
              🗑️ Xóa ({selectedIds.length})
            </button>
          )}

          <button 
            onClick={() => navigate(fixPath('/products/new'))} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-black shadow-xl shadow-blue-200 dark:shadow-none transition-all active:scale-95 text-sm"
          >
            <span className="text-xl">+</span> THÊM SẢN PHẨM
          </button>
        </div>
      </div>

      {/* BỘ LỌC */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl border border-gray-100 dark:border-gray-600">
        <div className="flex-1 relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Tìm theo tên sản phẩm..."
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="w-full md:w-64">
          <select
            className="block w-full py-2.5 px-3 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:text-white font-bold cursor-pointer"
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
      <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-700">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-400 dark:text-gray-500 uppercase text-[10px] font-black tracking-widest border-b dark:border-gray-600">
              <th className="p-4 w-12 text-center">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  checked={isAllCurrentPageSelected}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="p-4">Ảnh</th>
              <th className="p-4 w-1/3">Sản phẩm</th>
              <th className="p-4">Phân loại</th>
              <th className="p-4 text-right">Giá niêm yết</th>
              <th className="p-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => {
                const isSelected = !!product.id && selectedIds.includes(product.id);
                
                return (
                  <tr key={product.id} className={`${isSelected ? 'bg-blue-50/50 dark:bg-blue-900/20' : 'hover:bg-blue-50/30 dark:hover:bg-blue-900/10'} transition-colors group`}>
                    <td className="p-4 text-center">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        checked={isSelected}
                        onChange={() => product.id && handleSelectOne(product.id)}
                      />
                    </td>
                    <td className="p-4">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 shadow-inner">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=No+Img'; }}
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-gray-800 dark:text-white text-sm line-clamp-2">{product.name}</div>
                      <div className="text-[10px] text-gray-400 font-mono mt-1">ID: {product.id?.slice(-8)}</div>
                    </td>
                    
                    {/* CỘT PHÂN LOẠI ĐÃ ĐƯỢC THIẾT KẾ LẠI */}
                    <td className="p-4">
                      <div className="flex flex-col gap-1.5 items-start">
                        {/* Tag: Loại sản phẩm */}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${
                          product.type === 'door' 
                            ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' 
                            : 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800'
                        }`}>
                          {product.type === 'door' ? '🚪 Cửa' : '🔧 Phụ kiện'}
                        </span>
                        
                        {/* Text: Danh mục (Category) - Hiển thị đúng chữ gốc, không ép viết hoa toàn bộ */}
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                          {product.category || 'Chưa phân loại'}
                        </span>
                      </div>
                    </td>

                    <td className="p-4 text-right font-black text-gray-700 dark:text-gray-200 text-sm">
                      {product.price > 0 
                        ? product.price.toLocaleString('vi-VN') + ' đ' 
                        : <span className="text-red-500">Liên hệ</span>
                      }
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => handleEdit(product.id || '')}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id || '')}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="p-12 text-center text-gray-400 italic">Không có dữ liệu phù hợp.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER PHÂN TRANG */}
      {filteredProducts.length > ITEMS_PER_PAGE && (
        <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4 border-t dark:border-gray-700 pt-6">
          <div className="text-xs text-gray-400 font-medium order-2 md:order-1">
            Hiển thị <span className="text-gray-900 dark:text-white font-bold">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> - <span className="text-gray-900 dark:text-white font-bold">{Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)}</span> trong <span className="text-gray-900 dark:text-white font-bold">{filteredProducts.length}</span> sản phẩm
          </div>
          
          <div className="flex items-center gap-1 order-1 md:order-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 border dark:border-gray-600 rounded-lg disabled:opacity-30 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>

            <div className="flex items-center gap-1 mx-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                const isNearCurrent = Math.abs(page - currentPage) <= 1;
                const isFirstOrLast = page === 1 || page === totalPages;

                if (!isNearCurrent && !isFirstOrLast) {
                  if (page === 2 || page === totalPages - 1) {
                    return <span key={page} className="px-1 text-gray-400">...</span>;
                  }
                  return null;
                }

                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                      currentPage === page 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none scale-110' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-gray-700 border border-transparent'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border dark:border-gray-600 rounded-lg disabled:opacity-30 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductList;