import { useEffect, useState } from 'react';
import { COMPANY_INFO } from '../../data/companyInfo';

const ContactPage = () => {
  // Scroll lên đầu trang
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Giả lập gửi API (Sau này sẽ thay bằng API thật)
    setTimeout(() => {
      alert(`Cảm ơn ${formData.name}! Chúng tôi đã nhận được thông tin và sẽ liên hệ số ${formData.phone} sớm nhất.`);
      setIsSubmitting(false);
      setFormData({ name: '', phone: '', email: '', message: '' });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-20">
      
      {/* 1. HEADER SMALL */}
      <div className="bg-gray-900 text-white py-20 text-center px-4 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Liên Hệ Tư Vấn</h1>
          <p className="text-gray-400 mt-3 text-lg font-light">Chúng tôi luôn sẵn sàng lắng nghe và giải đáp mọi thắc mắc của bạn</p>
        </div>
        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-full h-full bg-blue-600/10 mix-blend-overlay"></div>
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 2. INFO CARDS (Cột Trái - Load từ Config) */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Card Address */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border-l-4 border-blue-700 hover:transform hover:translate-x-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-700 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Địa chỉ Showroom</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {COMPANY_INFO.address}
              </p>
            </div>

            {/* Card Contact */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border-l-4 border-blue-700 hover:transform hover:translate-x-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-700 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Hotline Hỗ Trợ</h3>
              <a href={`tel:${COMPANY_INFO.hotline.replace(/\s/g, '')}`} className="text-blue-700 font-black text-2xl mb-1 block hover:underline">
                {COMPANY_INFO.hotline}
              </a>
              <a href={`mailto:${COMPANY_INFO.email}`} className="text-gray-500 text-sm hover:text-blue-600 transition-colors">
                {COMPANY_INFO.email}
              </a>
            </div>

            {/* Card Time */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border-l-4 border-blue-700 hover:transform hover:translate-x-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-700 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Giờ làm việc</h3>
              <p className="text-gray-600 text-sm font-medium">{COMPANY_INFO.workingHours.weekdays}</p>
              <p className="text-gray-500 text-sm mt-1">{COMPANY_INFO.workingHours.sunday}</p>
            </div>

          </div>

          {/* 3. FORM & MAP (Cột Phải) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Form */}
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-2xl">
              <h2 className="text-2xl font-black uppercase text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-10 h-1 bg-blue-700 block"></span>
                Gửi yêu cầu báo giá
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Họ và tên <span className="text-red-500">*</span></label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-700 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium"
                      placeholder="Nhập tên của bạn"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Số điện thoại <span className="text-red-500">*</span></label>
                    <input 
                      required
                      type="tel" 
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-700 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium"
                      placeholder="Nhập số điện thoại"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email (Tùy chọn)</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-700 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium"
                    placeholder="Nhập email nhận báo giá"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nội dung cần tư vấn</label>
                  <textarea 
                    rows={4}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-700 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium"
                    placeholder="Ví dụ: Tôi cần báo giá cửa composite cho căn hộ 2 phòng ngủ..."
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`w-full py-4 bg-blue-700 text-white font-bold uppercase tracking-widest rounded-xl hover:bg-blue-800 hover:shadow-lg transition-all flex justify-center items-center gap-3 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Đang gửi yêu cầu...
                    </>
                  ) : (
                    <>
                      Gửi Yêu Cầu Ngay
                      <span>→</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Map (Google Maps Embed - Đà Nẵng) */}
            <div className="bg-white p-2 rounded-2xl shadow-xl h-[400px] overflow-hidden relative group">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3833.840742533722!2d108.21908927513364!3d16.06847198461066!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3142183421d00001%3A0x6a00000000000000!2zMTIzIE5ndXnhu4VuIFbEg24gTGluaCwgTmFtIETGsMahbmcsIEjhuqNpIENow6J1LCDEkMOgIE7hurVuZywgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s" 
                width="100%" 
                height="100%" 
                style={{ border: 0, borderRadius: '1rem' }} 
                allowFullScreen={true} 
                loading="lazy"
                title="Google Maps Showroom"
                className="grayscale group-hover:grayscale-0 transition-all duration-500"
              ></iframe>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;