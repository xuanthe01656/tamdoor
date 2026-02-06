import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination, Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';

// Import services và interfaces
import { doorService } from '../../services/doorService';
import { Door } from '../../interfaces/door';
import { HeroSlide } from '../../interfaces/hero';
import ProductModal from '../../components/common/ProductModal';
// import ProductCard from '../../components/product/ProductCard'; 

// Interface nội bộ
interface Advantage { icon: string; title: string; desc: string; }
interface Project { image: string; title: string; }

// Styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const HomePage = () => {
  // 1. State cho dữ liệu tĩnh và Featured
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [featuredDoors, setFeaturedDoors] = useState<Door[]>([]);
  const [advantages, setAdvantages] = useState<Advantage[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. State cho danh sách "Hệ sinh thái sản phẩm" (Grid + Pagination)
  const [products, setProducts] = useState<Door[]>([]);
  const [activeTab, setActiveTab] = useState<'door' | 'accessory'>('door');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [isProductLoading, setIsProductLoading] = useState(false);
  
  // 3. State Modal
  const [selectedProduct, setSelectedProduct] = useState<Door | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- EFFECT 1: Load dữ liệu tĩnh ban đầu ---
  useEffect(() => {
    const loadStaticData = async () => {
      try {
        const [heroRes, advRes, projRes, featuredRes] = await Promise.all([
          doorService.getHeroSlides(),
          doorService.getAdvantages(),
          doorService.getProjects(6),
          doorService.getFeaturedProducts(8)
        ]);
        setSlides(heroRes);
        setAdvantages(advRes);
        setProjects(projRes);
        setFeaturedDoors(featuredRes);
      } catch (error) {
        console.error('Lỗi tải dữ liệu static:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStaticData();
  }, []);

  // --- EFFECT 2: Load sản phẩm Grid khi đổi Tab/Page ---
  useEffect(() => {
    const loadGridProducts = async () => {
      setIsProductLoading(true);
      try {
        const result = await doorService.getProductsPaginated(activeTab, pagination.page, 8); 
        setProducts(result.data);
        setPagination(prev => ({ ...prev, totalPages: result.totalPages }));
      } catch (error) {
        console.error('Lỗi tải sản phẩm grid:', error);
      } finally {
        setIsProductLoading(false);
      }
    };
    loadGridProducts();
  }, [activeTab, pagination.page]);

  // Handlers
  const handleOpenModal = (product: Door) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleQuickView = (e: React.MouseEvent, product: Door) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    handleOpenModal(product);
  };

  const handleTabChange = (tab: 'door' | 'accessory') => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      setPagination({ ...pagination, page: 1 });
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination({ ...pagination, page: newPage });
      document.getElementById('product-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // --- COMPONENT CON: PRODUCT ITEM ---
  const ProductItem = ({ item }: { item: Door }) => (
    <div className="group flex flex-col h-full relative cursor-pointer bg-white">
      <Link to={`/san-pham/${item.slug}`} className="flex flex-col h-full">
        {/* Image Box */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-6 rounded-lg shadow-sm border border-gray-100 group-hover:shadow-xl transition-all duration-300">
          <img 
            src={item.image} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
            alt={item.name} 
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x600?text=No+Image'; }}
          />
          
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 text-[10px] font-black uppercase tracking-wider text-gray-900 shadow-sm rounded-sm z-10">
            {item.category}
          </div>
          
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
            <button 
              className="bg-white text-black px-6 py-3 font-bold text-xs uppercase tracking-widest hover:bg-blue-700 hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 shadow-lg rounded-sm flex items-center gap-2"
              onClick={(e) => handleQuickView(e, item)} 
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              Xem nhanh
            </button>
          </div>
        </div>
        
        {/* Info Section */}
        <div className="flex flex-col flex-grow px-1">
          <h3 className="font-bold text-lg uppercase leading-tight group-hover:text-blue-700 transition-colors line-clamp-2 min-h-[3rem]">
            {item.name}
          </h3>
          <p className="text-gray-500 text-xs mb-4 line-clamp-2 leading-relaxed mt-2">
            {item.description}
          </p>
          
          {/* --- SỬA Ở ĐÂY: LUÔN HIỂN THỊ "LIÊN HỆ" --- */}
          <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Giá bán:</span>
            
            {/* Bất kể có giá hay không, đều hiện LIÊN HỆ */}
            <span className="text-red-500 font-black text-xs uppercase tracking-widest">
                 LIÊN HỆ
            </span>
          </div>
        </div>
      </Link>
    </div>
  );

  if (loading) return <div className="h-screen flex items-center justify-center bg-black text-white font-black text-3xl animate-pulse">CASARDOOR...</div>;

  return (
    <div className="bg-white overflow-x-hidden">
      
      {/* SECTION 1: HERO SLIDER */}
      <section className="relative h-screen w-full overflow-hidden bg-black">
        {slides.length > 0 && (
          <Swiper
            modules={[Autoplay, EffectFade, Pagination, Navigation]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            speed={2000}
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
                    <div className={`absolute inset-0 transition-transform duration-[10000ms] ease-linear ${isActive ? 'scale-110' : 'scale-100'}`}>
                      <img src={slide.image} alt={slide.title} className="w-full h-full object-cover brightness-[0.7]" />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
                    </div>
                    {isActive && (
                      <div className="relative z-10 text-center px-6 w-full max-w-[90vw]">
                        <h1 className="text-[12vw] md:text-[10vw] font-black uppercase tracking-[-0.05em] leading-[0.8] text-white drop-shadow-2xl animate-revealUp">{slide.title}</h1>
                        <p className="mt-4 text-xl md:text-5xl font-light uppercase tracking-[0.5em] text-blue-400 animate-revealUp delay-300">{slide.subtitle}</p>
                        <div className="mt-12 animate-fadeIn opacity-0 [animation-fill-mode:forwards] delay-1000">
                          <a href={slide.link} className="px-12 py-5 border border-white/50 text-white font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                            {slide.cta}
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

      {/* SECTION 2: SẢN PHẨM NỔI BẬT */}
      <section className="py-20 px-6 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-gray-900 mb-12 text-center">
            Sản phẩm <span className="text-blue-700">nổi bật</span>
          </h2>
          <div className="relative group/swiper">
            {featuredDoors.length > 0 && (
              <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                spaceBetween={30}
                slidesPerView={1}
                navigation={true}
                pagination={{ clickable: true }}
                autoplay={{ delay: 4000 }}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 4 },
                }}
                className="pb-14 px-4 pt-4"
              >
                {featuredDoors.map((item) => (
                  <SwiperSlide key={item.id} className="h-auto">
                    <ProductItem item={item} />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 3: HỆ SINH THÁI SẢN PHẨM */}
      <section id="product-section" className="py-24 px-6 max-w-7xl mx-auto min-h-[800px]">
        {/* Header Tabs */}
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

        {/* Product Grid */}
        {isProductLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 opacity-50">
             {[1,2,3,4].map(i => <div key={i} className="aspect-[3/4] bg-gray-200 animate-pulse rounded-lg"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 animate-fadeIn">
            {products.map((item) => (
              <ProductItem key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-20 flex justify-center items-center gap-2">
            <button 
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 hover:border-blue-700 hover:text-blue-700 disabled:opacity-30 transition-all"
            >←</button>
            
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
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 hover:border-blue-700 hover:text-blue-700 disabled:opacity-30 transition-all"
            >→</button>
        </div>
      </section>

      {/* SECTION 4: TẠI SAO CHỌN */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black uppercase text-center mb-16 tracking-tighter">Tại sao chọn CasarDoor?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((adv, idx) => (
              <div key={idx} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all group">
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">{adv.icon}</div>
                <h3 className="text-xl font-bold mb-3">{adv.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{adv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: CÔNG TRÌNH */}
      <section className="py-20 px-6 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-black uppercase mb-12 tracking-tighter">Công trình <span className="text-blue-500">tiêu biểu</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {projects.map((proj, idx) => (
              <div key={idx} className="relative aspect-[4/3] group overflow-hidden rounded-xl shadow-2xl">
                <img src={proj.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={proj.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent flex items-end p-8">
                  <h3 className="text-xl font-bold uppercase translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{proj.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: CTA */}
      <section className="py-16 md:py-20 px-6 bg-blue-700 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase mb-6 md:mb-8">
            Bạn sẵn sàng cho ngôi nhà hoàn hảo?
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl mb-10 md:mb-12 font-light opacity-90">
            Liên hệ ngay để nhận tư vấn miễn phí & báo giá tốt nhất!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
            <a href="tel:0901234567" className="px-10 md:px-12 py-5 md:py-6 bg-white text-blue-700 font-black uppercase text-lg md:text-xl rounded-full hover:shadow-2xl transition-all transform hover:-translate-y-1">
              Gọi ngay: 0901 234 567
            </a>
            <button className="px-10 md:px-12 py-5 md:py-6 border-2 border-white text-white font-black uppercase text-lg md:text-xl rounded-full hover:bg-white hover:text-blue-700 transition-all transform hover:-translate-y-1">
              Yêu cầu báo giá
            </button>
          </div>
        </div>
      </section>

      {/* Modal & Styles */}
      <ProductModal product={selectedProduct} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      <style>{`
        @keyframes revealUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-revealUp { animation: revealUp 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
        .animate-fadeIn { animation: fadeIn 1.5s ease forwards; }
        .swiper-button-next, .swiper-button-prev { color: white !important; width: 50px; height: 50px; border: 1px solid rgba(255,255,255,0.2); border-radius: 50%; }
        .swiper-button-next:hover, .swiper-button-prev:hover { background: white; color: black !important; }
      `}</style>
    </div>
  );
};

export default HomePage;