import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { COMPANY_INFO } from '../../data/companyInfo';

const AboutPage = () => {
  // Scroll lên đầu trang khi load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white pb-20 pt-20">
      
      {/* 1. HERO BANNER PARALLAX */}
      <div className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000')] bg-cover bg-center bg-fixed"
        ></div>
        <div className="absolute inset-0 bg-black/70"></div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto animate-fadeInUp">
          <span className="text-blue-400 font-bold tracking-[0.3em] text-sm uppercase mb-4 block">
            Câu chuyện thương hiệu
          </span>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
            Kiến tạo giá trị <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white">
              Vững bền
            </span>
          </h1>
          <p className="text-gray-300 text-lg font-light max-w-2xl mx-auto leading-relaxed">
            {COMPANY_INFO.brandName} không chỉ bán cửa, chúng tôi cung cấp giải pháp an ninh và thẩm mỹ toàn diện cho ngôi nhà của bạn.
          </p>
        </div>
      </div>

      {/* 2. VISION & MISSION */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Cột ảnh */}
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-100 rounded-tl-3xl -z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1000" 
              alt="Our Team" 
              className="rounded-2xl shadow-2xl w-full object-cover h-[500px]"
            />
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl border-l-4 border-blue-700 max-w-xs hidden md:block animate-bounce-slow">
              <p className="font-bold text-gray-900 text-lg">"Chất lượng là danh dự"</p>
              <p className="text-sm text-gray-500 mt-1">- CEO {COMPANY_INFO.brandName}</p>
            </div>
          </div>
          
          {/* Cột nội dung */}
          <div>
            <h2 className="text-3xl md:text-4xl font-black uppercase text-gray-900 mb-6">
              Tầm nhìn & Sứ mệnh
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed text-lg text-justify">
              Được thành lập với khát vọng nâng tầm không gian sống Việt, <strong>{COMPANY_INFO.brandName}</strong> tiên phong trong việc ứng dụng các vật liệu mới như Composite, Nhựa ABS Hàn Quốc vào ngành cửa nội thất.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed text-lg text-justify">
              Chúng tôi cam kết mang đến những sản phẩm không chỉ bền bỉ trước khí hậu nhiệt đới khắc nghiệt mà còn là điểm nhấn nghệ thuật sang trọng cho mọi công trình.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-700 font-bold shrink-0 text-xl">01</div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">Tiên phong công nghệ</h4>
                  <p className="text-sm text-gray-500 mt-1">Cập nhật xu hướng khóa thông minh FaceID, cửa chống cháy chuẩn PCCC.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-700 font-bold shrink-0 text-xl">02</div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">Dịch vụ tận tâm</h4>
                  <p className="text-sm text-gray-500 mt-1">Bảo hành chính hãng 5 năm, lắp đặt chuyên nghiệp, tư vấn trung thực.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. STATS (CON SỐ BIẾT NÓI - Render từ Config) */}
      <div className="bg-gray-900 py-20 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-700/50">
            {COMPANY_INFO.about.stats.map((stat, index) => (
              <div key={index} className="p-4 group cursor-default">
                <div className="text-4xl md:text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 group-hover:from-blue-400 group-hover:to-blue-600 transition-all duration-300">
                  {stat.value}
                </div>
                <div className="text-sm uppercase tracking-widest opacity-60 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. CORE VALUES (GIÁ TRỊ CỐT LÕI - Render từ Config) */}
      <div className="max-w-7xl mx-auto px-6 py-24 bg-gray-50 mt-10 rounded-[3rem]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-black uppercase text-gray-900 mb-4">Giá trị cốt lõi</h2>
          <div className="w-24 h-1.5 bg-blue-700 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {COMPANY_INFO.about.coreValues.map((item, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-xl hover:-translate-y-2 transition-transform duration-300 border-t-4 border-blue-700 relative overflow-hidden group">
              {/* Background Number */}
              <h3 className="text-[8rem] font-black text-gray-100 absolute -bottom-10 -right-4 z-0 group-hover:text-blue-50 transition-colors">
                {index + 1}
              </h3>
              
              <div className="relative z-10">
                <h3 className="text-3xl font-bold text-blue-800 mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. CTA FOOTER */}
      <div className="text-center mt-20 mb-10 px-4">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Bạn đã sẵn sàng nâng cấp ngôi nhà của mình?</h3>
        <Link 
          to="/lien-he" 
          className="inline-flex items-center gap-2 px-10 py-4 bg-blue-700 text-white font-bold uppercase tracking-widest rounded-full hover:bg-blue-800 hover:shadow-2xl hover:scale-105 transition-all duration-300"
        >
          Liên hệ hợp tác ngay
          <span>→</span>
        </Link>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-bounce-slow { animation: bounce 3s infinite; }
      `}</style>
    </div>
  );
};

export default AboutPage;