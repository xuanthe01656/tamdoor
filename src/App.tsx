import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination, Navigation } from 'swiper/modules';

import { doorService } from './services/doorService';
import { Door } from './interfaces/door';
import { HeroSlide } from './interfaces/hero';
import ProductModal from './components/common/ProductModal';
interface Advantage {
  icon: string;
  title: string;
  desc: string;
}

interface Project {
  image: string;
  title: string;
}

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const App = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [doors, setDoors] = useState<Door[]>([]);
  const [accessories, setAccessories] = useState<Door[]>([]);
  const [advantages, setAdvantages] = useState<Advantage[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'door' | 'accessory'>('door');

  const [products, setProducts] = useState<Door[]>([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [isProductLoading, setIsProductLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Door | null>(null); // State lưu sản phẩm đang xem
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hàm mở Modal
  const handleOpenModal = (product: Door) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };
  // 1. Load dữ liệu tĩnh ban đầu (Hero, Projects,...)
useEffect(() => {
  const loadStaticData = async () => {
    try {
      const [heroRes, advRes, projRes, featuredRes] = await Promise.all([
        doorService.getHeroSlides(),
        doorService.getAdvantages(),
        doorService.getProjects(6),
        doorService.getProductsByType('door')
      ]);
      setSlides(heroRes);
      setAdvantages(advRes);
      setProjects(projRes);
      setDoors(featuredRes);
    } catch (error) {
      console.error('Lỗi tải static data:', error);
    } finally {
      setLoading(false);
    }
  };
  loadStaticData();
}, []);
  // 2. Load sản phẩm khi Tab hoặc Page thay đổi
  useEffect(() => {
    const loadProducts = async () => {
      setIsProductLoading(true);
      try {
        // Limit: 8 sản phẩm mỗi trang
        const result = await doorService.getProductsPaginated(activeTab, pagination.page, 8);
        setProducts(result.data);
        setPagination(prev => ({ ...prev, totalPages: result.totalPages }));
      } catch (error) {
        console.error('Lỗi tải sản phẩm:', error);
      } finally {
        setIsProductLoading(false);
      }
    };
    loadProducts();
  }, [activeTab, pagination.page]);

  // Reset về trang 1 khi đổi Tab
  const handleTabChange = (tab: 'door' | 'accessory') => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      setPagination({ ...pagination, page: 1 });
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination({ ...pagination, page: newPage });
      // Scroll nhẹ lên đầu danh sách sản phẩm
      document.getElementById('product-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-white font-black text-3xl animate-pulse">TAMDOOR...</div>
      </div>
    );
  }

  return (
    <main className="bg-white overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative h-screen w-full overflow-hidden bg-black">
        {slides.length > 0 && (
          <Swiper
            modules={[Autoplay, EffectFade, Pagination, Navigation]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            speed={2000} // Chuyển động chậm hơn để tạo cảm giác sang trọng
            autoplay={{ delay: 7000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation={true}
            loop={true}
            className="h-full w-full"
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.id}>
                {({ isActive }) => (
                  <div className="relative h-full w-full flex items-center justify-center">
                    
                    {/* Image Background Layer */}
                    <div className={`absolute inset-0 transition-transform duration-[10000ms] ease-linear ${isActive ? 'scale-110' : 'scale-100'}`}>
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover brightness-[0.7]"
                      />
                      
                      {/* Overlay Đa Tầng: Giúp Text trắng nổi bật trên mọi loại ảnh */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
                      
                      {/* Dải mờ trung tâm (Signature Look) */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-full h-[35%] bg-white/[0.03] backdrop-blur-[2px] border-y border-white/10" />
                      </div>
                    </div>

                    {/* Content Layer - Typography Khổ Lớn */}
                    {isActive && (
                      <div className="relative z-10 text-center px-6 w-full max-w-[90vw]">
                        <div className="overflow-hidden">
                          <h1 className="text-[12vw] md:text-[10vw] font-black uppercase tracking-[-0.05em] leading-[0.8] text-white drop-shadow-2xl animate-revealUp">
                            {slide.title}
                          </h1>
                        </div>
                        
                        <div className="overflow-hidden mt-2 md:mt-4">
                          <p className="text-xl md:text-5xl font-light uppercase tracking-[0.5em] text-blue-400 animate-revealUp delay-300">
                            {slide.subtitle}
                          </p>
                        </div>

                        {slide.description && (
                          <p className="mt-8 text-base md:text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed animate-fadeIn opacity-0 [animation-fill-mode:forwards] delay-700">
                            {slide.description}
                          </p>
                        )}

                        <div className="mt-12 animate-fadeIn opacity-0 [animation-fill-mode:forwards] delay-1000">
                          <a
                            href={slide.link}
                            className="group relative inline-flex items-center px-12 py-5 overflow-hidden border border-white/50 text-white transition-all duration-500 hover:border-white"
                          >
                            <span className="relative z-10 font-bold uppercase tracking-widest text-sm">{slide.cta}</span>
                            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                            <span className="relative z-10 ml-3 group-hover:text-black transition-colors">→</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </section>

      {/* PRODUCT SECTION */}
      <section id="product-section" className="py-24 px-6 max-w-7xl mx-auto min-h-[800px]">
        {/* Header Section & Tabs */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b border-gray-100 pb-8">
          <div>
            <h2 className="text-5xl font-black uppercase tracking-tighter text-gray-900 leading-none">
              Hệ sinh thái <br/> <span className="text-blue-700">Sản phẩm</span>
            </h2>
          </div>
          
          <div className="flex bg-gray-50 p-1.5 rounded-full border border-gray-200">
            <button 
              onClick={() => handleTabChange('door')}
              className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'door' ? 'bg-blue-700 text-white shadow-lg scale-105' : 'text-gray-500 hover:text-black'}`}
            >
              Cửa cao cấp
            </button>
            <button 
              onClick={() => handleTabChange('accessory')}
              className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'accessory' ? 'bg-blue-700 text-white shadow-lg scale-105' : 'text-gray-500 hover:text-black'}`}
            >
              Phụ kiện
            </button>
          </div>
        </div>

        {/* Product Grid với Loading State */}
        {isProductLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 opacity-50">
             {/* Skeleton Loading giả lập */}
             {[1,2,3,4].map(i => <div key={i} className="aspect-[3/4] bg-gray-200 animate-pulse rounded-lg"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 animate-fadeIn">
            {products.map((item) => (
              <div 
                key={item.id} 
                className="group flex flex-col h-full cursor-pointer" 
                onClick={() => handleOpenModal(item)}
              >
                {/* Image Box */}
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-6 rounded-lg shadow-sm border border-gray-100 group-hover:shadow-xl transition-all duration-300">
                  <img 
                    src={item.image} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    alt={item.name} 
                  />
                  
                  {/* Tag category (Đã bổ sung) */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 text-[10px] font-black uppercase tracking-wider text-gray-900 shadow-sm rounded-sm z-10">
                    {item.category}
                  </div>
                  
                  {/* Nút Xem nhanh (Overlay) */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                      <button 
                        className="bg-white text-black px-6 py-3 font-bold text-xs uppercase tracking-widest hover:bg-blue-700 hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 shadow-lg rounded-sm"
                        onClick={(e) => { e.stopPropagation(); handleOpenModal(item); }}
                      >
                          Xem chi tiết
                      </button>
                  </div>
                </div>
                
                {/* Info Section */}
                <div className="flex flex-col flex-grow">
                  <h3 className="font-bold text-lg uppercase leading-tight group-hover:text-blue-700 transition-colors line-clamp-2 min-h-[3rem]">
                    {item.name}
                  </h3>
                  
                  <p className="text-gray-500 text-xs mb-4 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  
                  {/* Price / Contact Section (Đã sửa thành LIÊN HỆ) */}
                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Giá bán:</span>
                    <span className="text-blue-700 font-black text-sm uppercase tracking-widest">
                      LIÊN HỆ
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PAGINATION HIỆN ĐẠI */}
        <div className="mt-20 flex justify-center items-center gap-2">
            <button 
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 hover:border-blue-700 hover:text-blue-700 disabled:opacity-30 disabled:hover:border-gray-200 transition-all"
            >
                ←
            </button>
            
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-sm transition-all ${
                        pagination.page === page 
                        ? 'bg-blue-700 text-white shadow-lg scale-110' 
                        : 'bg-white text-gray-500 hover:bg-gray-100'
                    }`}
                >
                    {page < 10 ? `0${page}` : page}
                </button>
            ))}

            <button 
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 hover:border-blue-700 hover:text-blue-700 disabled:opacity-30 disabled:hover:border-gray-200 transition-all"
            >
                →
            </button>
        </div>
      </section>

      {/* TẠI SAO CHỌN TAMDOOR */}
      <section className="py-20 md:py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-gray-900 mb-6">
            Tại sao chọn <span className="text-blue-700">TAMDOOR</span>?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-12 md:mb-16">
            Giải pháp cửa nhựa composite cao cấp – Door of the Future – bền vững, an toàn và sang trọng cho mọi không gian sống Việt Nam.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {advantages.map((adv, idx) => (
              <div
                key={idx}
                className="bg-white p-6 md:p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="text-5xl md:text-6xl mb-4">{adv.icon}</div>
                <h3 className="text-xl md:text-2xl font-bold mb-3">{adv.title}</h3>
                <p className="text-gray-600 text-sm md:text-base">{adv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SẢN PHẨM NỔI BẬT */}
      <section className="py-20 md:py-24 px-6 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-gray-900 mb-12 md:mb-16 text-center">
            Sản phẩm <span className="text-blue-700">nổi bật</span>
          </h2>

          <div className="relative group/swiper">
            {/* Thêm điều kiện kiểm tra doors.length > 0 */}
            {doors.length > 0 && (
              <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                spaceBetween={30}
                slidesPerView={1}
                navigation={true}
                pagination={{ clickable: true, dynamicBullets: true }}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                breakpoints={{
                  640: { slidesPerView: 2, spaceBetween: 20 },
                  1024: { slidesPerView: 4, spaceBetween: 30 },
                }}
                className="pb-12"
              >
                {doors.slice(0, 8).map((item) => (
                  <SwiperSlide key={item.id} className="h-auto">
                        <div 
                          className="group flex flex-col h-full cursor-pointer bg-white" 
                          onClick={() => handleOpenModal(item)}
                        >
                          {/* Image Box - Đồng bộ với Main Grid */}
                          <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-6 rounded-lg shadow-sm border border-gray-100 group-hover:shadow-xl transition-all duration-300">
                            <img 
                              src={item.image} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                              alt={item.name} 
                            />
                            
                            {/* Tag category */}
                            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 text-[10px] font-black uppercase tracking-wider text-gray-900 shadow-sm rounded-sm z-10">
                              {item.category}
                            </div>
                            
                            {/* Overlay Nút Xem nhanh */}
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                                <button 
                                  className="bg-white text-black px-6 py-3 font-bold text-xs uppercase tracking-widest hover:bg-blue-700 hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 shadow-lg rounded-sm"
                                  onClick={(e) => { e.stopPropagation(); handleOpenModal(item); }}
                                >
                                    Xem chi tiết
                                </button>
                            </div>
                          </div>
                          
                          {/* Info Section */}
                          <div className="flex flex-col flex-grow px-1">
                            <h3 className="font-bold text-lg uppercase leading-tight group-hover:text-blue-700 transition-colors line-clamp-2 min-h-[3rem]">
                              {item.name}
                            </h3>
                            
                            <p className="text-gray-500 text-xs mb-4 line-clamp-2 leading-relaxed">
                              {item.description}
                            </p>
                            
                            {/* Price / Contact Section - Đồng bộ hiển thị Liên hệ */}
                            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Trạng thái:</span>
                              <span className="text-blue-700 font-black text-sm uppercase tracking-widest">
                                LIÊN HỆ NGAY
                              </span>
                            </div>
                          </div>
                        </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </div>
      </section>

      {/* CÔNG TRÌNH THỰC TẾ */}
      <section className="py-20 md:py-24 px-6 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-12 md:mb-16">
            Công trình <span className="text-blue-400">đã thực hiện</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {projects.map((proj, idx) => (
              <div key={idx} className="group relative overflow-hidden rounded-xl aspect-[4/3]">
                <img
                  src={proj.image}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  alt={proj.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-6 md:p-8">
                  <h3 className="text-xl md:text-2xl font-bold uppercase">{proj.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-16 md:py-20 px-6 bg-blue-700 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase mb-6 md:mb-8">
            Bạn sẵn sàng cho ngôi nhà hoàn hảo?
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl mb-10 md:mb-12">
            Liên hệ ngay để nhận tư vấn miễn phí & báo giá tốt nhất!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
            <a
              href="tel:090xxxxxxx"
              className="px-10 md:px-12 py-5 md:py-6 bg-white text-blue-700 font-black uppercase text-lg md:text-xl rounded-full hover:shadow-2xl transition-all"
            >
              Gọi ngay: 090 xxxx xxx
            </a>
            <button className="px-10 md:px-12 py-5 md:py-6 border-2 border-white text-white font-black uppercase text-lg md:text-xl rounded-full hover:bg-white hover:text-blue-700 transition-all">
              Yêu cầu báo giá
            </button>
          </div>
        </div>
      </section>
      <ProductModal 
        product={selectedProduct} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
      {/* Global styles */}
      <style>{`
        @keyframes revealUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-revealUp { animation: revealUp 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
        .animate-fadeIn { animation: fadeIn 1.5s ease forwards; }

        /* Tinh chỉnh Swiper Navigation */
        .swiper-button-next, .swiper-button-prev { 
          color: white !important; 
          width: 60px !important; 
          height: 60px !important;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 50%;
          transform: scale(0.6);
          transition: all 0.3s;
        }
        .swiper-button-next:after, .swiper-button-prev:after { font-size: 20px !important; }
        .swiper-button-next:hover, .swiper-button-prev:hover { background: white; color: black !important; }
      `}</style>
    </main>
  );
};

export default App;