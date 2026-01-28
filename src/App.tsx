import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination, Navigation } from 'swiper/modules';

import { doorService } from './services/doorService';
import { Door } from './interfaces/door';
import { HeroSlide } from './interfaces/hero';

// Định nghĩa type tạm cho Advantage & Project (nếu chưa có file interfaces riêng)
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

  useEffect(() => {
    const loadData = async () => {
      try {
        const [heroRes, doorRes, accessoryRes, advRes, projRes] = await Promise.all([
          doorService.getHeroSlides(),
          doorService.getProductsByType('door'),
          doorService.getProductsByType('accessory'),
          doorService.getAdvantages(),
          doorService.getProjects(6),
        ]);

        setSlides(heroRes);
        setDoors(doorRes);
        setAccessories(accessoryRes);
        setAdvantages(advRes);
        setProjects(projRes);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

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
      <section className="py-20 md:py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none text-gray-900">
            Hệ sinh thái <br className="hidden md:block" />
            <span className="text-blue-700">Sản phẩm</span>
          </h2>
          <div className="flex bg-gray-100 p-1 rounded-full shrink-0">
            <button
              onClick={() => setActiveTab('door')}
              className={`py-3 px-8 md:px-10 rounded-full font-black uppercase text-xs md:text-[10px] tracking-widest transition-all ${
                activeTab === 'door' ? 'bg-blue-700 text-white shadow-lg' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Cửa Composite
            </button>
            <button
              onClick={() => setActiveTab('accessory')}
              className={`py-3 px-8 md:px-10 rounded-full font-black uppercase text-xs md:text-[10px] tracking-widest transition-all ${
                activeTab === 'accessory' ? 'bg-blue-700 text-white shadow-lg' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Phụ kiện
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {(activeTab === 'door' ? doors : accessories).map((item) => (
            <div key={item.id} className="group">
              <div className="aspect-[3/4] overflow-hidden bg-gray-50 mb-4 shadow-md border border-gray-100 rounded-lg">
                <img
                  src={item.image}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  alt={item.name}
                />
              </div>
              <h3 className="font-bold text-base md:text-lg uppercase mb-3 text-gray-900 group-hover:text-blue-700 line-clamp-2">
                {item.name}
              </h3>
              <button className="w-full py-3 md:py-4 border border-gray-900 font-black uppercase text-xs tracking-widest hover:bg-gray-900 hover:text-white transition-all rounded-md">
                Liên hệ báo giá
              </button>
            </div>
          ))}
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
      <section className="py-20 md:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-gray-900 mb-12 md:mb-16 text-center">
            Sản phẩm <span className="text-blue-700">nổi bật</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {doors.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="group bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={item.image}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt={item.name}
                  />
                </div>
                <div className="p-5 md:p-6 text-center">
                  <h3 className="font-bold text-lg md:text-xl uppercase mb-3 text-gray-900 group-hover:text-blue-700 line-clamp-2">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                  <button className="w-full py-3 border-2 border-blue-700 text-blue-700 font-black uppercase text-xs md:text-sm tracking-widest hover:bg-blue-700 hover:text-white transition-all rounded-md">
                    Xem chi tiết
                  </button>
                </div>
              </div>
            ))}
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