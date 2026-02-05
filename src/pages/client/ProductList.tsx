import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { doorService } from '../../services/doorService';
import { Door } from '../../interfaces/door';
import ProductCard from '../../components/product/ProductCard';
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
    
    // Lọc theo từ khóa
    if (searchTerm) {
      result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    
    // Lọc theo danh mục
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }
    
    // Sắp xếp (ĐÃ SỬA LOGIC)
    switch (sortOption) {
      case 'name-asc':
        // Sắp xếp tên A -> Z
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        // Sắp xếp tên Z -> A
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
      default:
        // Mặc định: Mới nhất (Dựa vào thời gian tạo)
        result.sort((a, b) => b.createdAt - a.createdAt);
        break;
    }

    return result;
  }, [allProducts, searchTerm, selectedCategory, sortOption]);

  // 4. Pagination Logic
  const totalPages = Math.ceil(processedProducts.length / itemsPerPage);
  const displayedProducts = processedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const categories = useMemo(() => Array.from(new Set(allProducts.map(p => p.category))), [allProducts]);

  // Handlers
  const handleTabChange = (tab: 'door' | 'accessory') => setSearchParams({ tab });
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document.getElementById('product-grid-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* === 1. MODERN HERO BANNER === */}
      <div className="relative h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background Image với hiệu ứng Parallax nhẹ */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed transition-transform duration-1000 scale-105"
          style={{ 
            backgroundImage: activeTab === 'door' 
              ? "url('https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=2000&auto=format&fit=crop')" 
              : "url('https://images.unsplash.com/photo-1558002038-1091a166111c?q=80&w=2000&auto=format&fit=crop')"
          }}
        ></div>
        
        {/* Overlay Gradient tối giúp text luôn nổi bật */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-gray-50/90 md:to-transparent"></div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-10 md:mt-0">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-600/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-[0.2em] mb-4 backdrop-blur-md animate-fadeIn">
            Bộ sưu tập 2026
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-6 leading-tight drop-shadow-2xl animate-revealUp">
            {activeTab === 'door' ? 'Kiệt tác Cửa hiện đại' : 'Công nghệ & Tiện nghi'}
          </h1>
          <p className="text-gray-200 text-sm md:text-lg font-light max-w-2xl mx-auto leading-relaxed drop-shadow-md animate-revealUp delay-200">
            {activeTab === 'door' 
              ? 'Khám phá sự giao thoa giữa độ bền vượt trội và thẩm mỹ tinh tế. Giải pháp cửa hoàn hảo cho tổ ấm của bạn.' 
              : 'Nâng tầm đẳng cấp sống với hệ thống khóa thông minh và phụ kiện kim khí chuẩn Châu Âu.'}
          </p>
        </div>
      </div>

      {/* === 2. FLOATING FILTER BAR (Điểm nhấn UI) === */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-20 md:-mt-24 relative z-20">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 md:p-8 backdrop-blur-xl bg-white/95">
          
          {/* Tabs Switcher */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 p-1.5 rounded-full inline-flex shadow-inner">
              <button 
                onClick={() => handleTabChange('door')} 
                className={`px-6 md:px-10 py-3 rounded-full font-black text-xs md:text-sm uppercase tracking-widest transition-all duration-300 ${activeTab === 'door' ? 'bg-blue-700 text-white shadow-lg transform scale-105' : 'text-gray-500 hover:text-black'}`}
              >
                Cửa Cao Cấp
              </button>
              <button 
                onClick={() => handleTabChange('accessory')} 
                className={`px-6 md:px-10 py-3 rounded-full font-black text-xs md:text-sm uppercase tracking-widest transition-all duration-300 ${activeTab === 'accessory' ? 'bg-blue-700 text-white shadow-lg transform scale-105' : 'text-gray-500 hover:text-black'}`}
              >
                Phụ Kiện
              </button>
            </div>
          </div>

          {/* Filter Inputs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center" id="product-grid-anchor">
            {/* Search - Chiếm nhiều chỗ nhất */}
            <div className="md:col-span-5 relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <input 
                type="text"
                placeholder="Tìm kiếm theo tên..." 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-transparent focus:border-blue-600 rounded-xl text-gray-900 text-sm font-medium placeholder-gray-400 focus:outline-none focus:bg-white transition-all shadow-sm group-hover:bg-white group-hover:shadow-md"
              />
            </div>

            {/* Category Filter */}
            <div className="md:col-span-4">
              <div className="relative">
                <select 
                  value={selectedCategory}
                  onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-4 pr-10 py-3.5 bg-gray-50 border-2 border-transparent focus:border-blue-600 rounded-xl text-sm font-bold text-gray-700 appearance-none cursor-pointer focus:outline-none focus:bg-white hover:bg-white hover:shadow-md transition-all"
                >
                  <option value="all">📂 Tất cả danh mục</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {/* Custom Arrow Icon */}
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            {/* Sort Filter */}
            <div className="md:col-span-3">
              <div className="relative">
                <select 
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full pl-4 pr-10 py-3.5 bg-gray-50 border-2 border-transparent focus:border-blue-600 rounded-xl text-sm font-bold text-gray-700 appearance-none cursor-pointer focus:outline-none focus:bg-white hover:bg-white hover:shadow-md transition-all"
                >
                  <option value="newest">✨ Mới nhất</option>
                  <option value="name-asc">🔤 Tên: A - Z</option>
                  <option value="name-desc">🔤 Tên: Z - A</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"></path></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Results Count Badge */}
          <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
             <div className="text-xs font-bold uppercase tracking-widest text-gray-400">
               Kết quả lọc
             </div>
             <div className="bg-blue-50 text-blue-700 text-xs font-black px-3 py-1 rounded-md">
               {processedProducts.length} SẢN PHẨM
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
                <ProductCard 
                  key={item.id} 
                  item={item} 
                  onOpenModal={(p) => { setSelectedProduct(p); setIsModalOpen(true); }} 
                />
              ))}
            </div>

            {/* Pagination Styled */}
            {totalPages > 1 && (
              <div className="mt-20 flex justify-center gap-3">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:border-blue-600 hover:text-blue-600 disabled:opacity-30 disabled:hover:border-gray-200 transition-all shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-12 h-12 rounded-full font-black text-sm transition-all shadow-sm ${
                      currentPage === page 
                        ? 'bg-blue-700 text-white shadow-blue-300 transform scale-110' 
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:border-blue-600 hover:text-blue-600 disabled:opacity-30 disabled:hover:border-gray-200 transition-all shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </button>
              </div>
            )}
          </>
        ) : (
          /* Empty State Modern */
          <div className="py-32 text-center bg-white rounded-3xl border border-dashed border-gray-300">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
               <span className="text-4xl">🔍</span>
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Không tìm thấy sản phẩm nào</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              Rất tiếc, chúng tôi không tìm thấy sản phẩm phù hợp với từ khóa "{searchTerm}". Hãy thử lại với bộ lọc khác.
            </p>
            <button 
              onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
              className="px-8 py-3 bg-gray-900 text-white font-bold uppercase tracking-wider rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              Xóa bộ lọc & Thử lại
            </button>
          </div>
        )}
      </div>

      <ProductModal product={selectedProduct} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      <style>{`
        @keyframes revealUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-revealUp { animation: revealUp 0.8s ease-out forwards; }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
        .delay-200 { animation-delay: 0.2s; }
      `}</style>
    </div>
  );
};

export default ProductList;