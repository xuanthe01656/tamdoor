import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom'; // Import Link
import { doorService } from '../../services/doorService';
import { Door } from '../../interfaces/door';
// import ProductCard from '../../components/product/ProductCard'; // Tạm bỏ cái này để code trực tiếp cho dễ hiểu
import ProductModal from '../../components/common/ProductModal';

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') === 'accessory' ? 'accessory' : 'door';
  
  // --- STATE ---
  const [activeTab, setActiveTab] = useState<'door' | 'accessory'>(tabParam);
  const [allProducts, setAllProducts] = useState<Door[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOption, setSortOption] = useState('newest');
  
  // Pagination & Modal
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [selectedProduct, setSelectedProduct] = useState<Door | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Sync URL
  useEffect(() => {
    const currentTab = searchParams.get('tab') === 'accessory' ? 'accessory' : 'door';
    if (activeTab !== currentTab) {
      setActiveTab(currentTab);
      setSearchTerm('');
      setSelectedCategory('all');
      setCurrentPage(1);
    }
  }, [searchParams]);

  // 2. Load Data
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const data = await doorService.getProductsByType(activeTab);
        setAllProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [activeTab]);

  // 3. Filter Logic
  const processedProducts = useMemo(() => {
    let result = [...allProducts];
    if (searchTerm) result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    if (selectedCategory !== 'all') result = result.filter(p => p.category === selectedCategory);
    
    switch (sortOption) {
      case 'name-asc': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'name-desc': result.sort((a, b) => b.name.localeCompare(a.name)); break;
      case 'newest': default: result.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)); break;
    }
    return result;
  }, [allProducts, searchTerm, selectedCategory, sortOption]);

  // 4. Pagination Logic
  const totalPages = Math.ceil(processedProducts.length / itemsPerPage);
  const displayedProducts = processedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const categories = useMemo(() => Array.from(new Set(allProducts.map(p => p.category))), [allProducts]);

  // Handlers
  const handleTabChange = (tab: 'door' | 'accessory') => setSearchParams({ tab });
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document.getElementById('product-grid-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Hàm mở modal (Sự kiện Xem nhanh)
  const handleQuickView = (e: React.MouseEvent, product: Door) => {
    e.preventDefault(); // QUAN TRỌNG: Chặn Link chuyển trang
    e.stopPropagation(); // Chặn sự kiện lan ra ngoài
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* === 1. HERO BANNER (Giữ nguyên) === */}
      <div className="relative h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed transition-transform duration-1000 scale-105"
          style={{ backgroundImage: activeTab === 'door' ? "url('https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=2000&auto=format&fit=crop')" : "url('https://images.unsplash.com/photo-1558002038-1091a166111c?q=80&w=2000&auto=format&fit=crop')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-gray-50/90 md:to-transparent"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-10 md:mt-0">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-600/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-[0.2em] mb-4 backdrop-blur-md animate-fadeIn">Bộ sưu tập 2026</span>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-6 leading-tight drop-shadow-2xl animate-revealUp">{activeTab === 'door' ? 'Kiệt tác Cửa hiện đại' : 'Công nghệ & Tiện nghi'}</h1>
        </div>
      </div>

      {/* === 2. FILTER BAR === */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-20 md:-mt-24 relative z-20">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 md:p-8 backdrop-blur-xl bg-white/95">
          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 p-1.5 rounded-full inline-flex shadow-inner">
              <button onClick={() => handleTabChange('door')} className={`px-6 md:px-10 py-3 rounded-full font-black text-xs md:text-sm uppercase tracking-widest transition-all duration-300 ${activeTab === 'door' ? 'bg-blue-700 text-white shadow-lg transform scale-105' : 'text-gray-500 hover:text-black'}`}>Cửa Cao Cấp</button>
              <button onClick={() => handleTabChange('accessory')} className={`px-6 md:px-10 py-3 rounded-full font-black text-xs md:text-sm uppercase tracking-widest transition-all duration-300 ${activeTab === 'accessory' ? 'bg-blue-700 text-white shadow-lg transform scale-105' : 'text-gray-500 hover:text-black'}`}>Phụ Kiện</button>
            </div>
          </div>
          {/* Filter Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center" id="product-grid-anchor">
            <div className="md:col-span-5 relative group">
              <input type="text" placeholder="Tìm kiếm theo tên..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="w-full pl-4 pr-4 py-3.5 bg-gray-50 border-2 border-transparent focus:border-blue-600 rounded-xl text-sm font-medium focus:outline-none focus:bg-white transition-all shadow-sm group-hover:bg-white" />
            </div>
            <div className="md:col-span-4">
              <select value={selectedCategory} onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }} className="w-full pl-4 pr-10 py-3.5 bg-gray-50 border-2 border-transparent focus:border-blue-600 rounded-xl text-sm font-bold text-gray-700 cursor-pointer focus:outline-none focus:bg-white hover:bg-white transition-all">
                <option value="all">📂 Tất cả danh mục</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="md:col-span-3">
              <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="w-full pl-4 pr-10 py-3.5 bg-gray-50 border-2 border-transparent focus:border-blue-600 rounded-xl text-sm font-bold text-gray-700 cursor-pointer focus:outline-none focus:bg-white hover:bg-white transition-all">
                <option value="newest">✨ Mới nhất</option>
                <option value="name-asc">🔤 Tên: A - Z</option>
                <option value="name-desc">🔤 Tên: Z - A</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* === 3. PRODUCT GRID === */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-16">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => <div key={i} className="aspect-[3/4] bg-white rounded-2xl shadow-sm animate-pulse" />)}
          </div>
        ) : displayedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 animate-fadeIn">
              {displayedProducts.map(item => (
                // --- BẮT ĐẦU CARD SẢN PHẨM ---
                <div key={item.id} className="group flex flex-col h-full relative">
                  
                  {/* Vùng Hình ảnh - Bấm vào sẽ chuyển trang Detail */}
                  <Link to={`/san-pham/${item.slug}`} className="block relative aspect-[3/4] overflow-hidden bg-white mb-6 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 group-hover:shadow-xl group-hover:border-blue-100">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x600?text=No+Image'; }}
                    />
                    
                    {/* Tag Category */}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-gray-800 shadow-sm border border-gray-100 z-10">
                      {item.category}
                    </div>

                    {/* OVERLAY & NÚT XEM NHANH */}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button 
                        // Sự kiện Xem nhanh (quan trọng: dùng e.preventDefault để không bị Link bao ngoài kích hoạt)
                        onClick={(e) => handleQuickView(e, item)}
                        className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 bg-white text-gray-900 px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest shadow-xl hover:bg-blue-600 hover:text-white border border-gray-100"
                      >
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          Xem nhanh
                        </span>
                      </button>
                    </div>
                  </Link>

                  {/* Vùng Thông tin - Bấm vào cũng chuyển trang */}
                  <div className="flex flex-col flex-grow px-1">
                    <Link to={`/san-pham/${item.slug}`} className="group-hover:text-blue-700 transition-colors">
                      <h3 className="font-bold text-lg uppercase leading-snug line-clamp-2 mb-2 min-h-[3rem]">
                        {item.name}
                      </h3>
                    </Link>
                    
                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                      {/* {item.price > 0 ? (
                        <div className="flex flex-col">
                           <span className="text-[10px] text-gray-400 font-bold uppercase">Giá bán</span>
                           <span className="text-blue-700 font-black text-sm">{item.price.toLocaleString('vi-VN')} đ</span>
                        </div>
                      ) : ( */}
                        <span className="text-red-500 font-black text-xs uppercase bg-red-50 px-2 py-1 rounded">Liên hệ</span>
                      {/* )} */}
                      
                      {/* Nút nhỏ gọi modal ở dưới (dự phòng) */}
                      <button 
                        onClick={(e) => handleQuickView(e, item)}
                        className="md:hidden text-gray-400 hover:text-blue-600"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
                // --- KẾT THÚC CARD SẢN PHẨM ---
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-20 flex justify-center gap-2">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 hover:border-blue-600 hover:text-blue-600 disabled:opacity-30 transition-all">←</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button key={page} onClick={() => handlePageChange(page)} className={`w-10 h-10 rounded-full font-bold text-sm transition-all ${currentPage === page ? 'bg-blue-700 text-white shadow-lg scale-110' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}>{page}</button>
                ))}
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 hover:border-blue-600 hover:text-blue-600 disabled:opacity-30 transition-all">→</button>
              </div>
            )}
          </>
        ) : (
          <div className="py-32 text-center bg-white rounded-3xl border border-dashed border-gray-300">
            <h3 className="text-2xl font-black text-gray-900 mb-2">Không tìm thấy sản phẩm nào</h3>
            <button onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }} className="mt-4 px-8 py-3 bg-gray-900 text-white font-bold uppercase rounded-lg hover:bg-blue-700 transition-colors">Xóa bộ lọc</button>
          </div>
        )}
      </div>

      <ProductModal product={selectedProduct} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      <style>{`
        @keyframes revealUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-revealUp { animation: revealUp 0.8s ease-out forwards; }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ProductList;