import { useEffect, useState } from 'react';
import { doorService } from '../../services/doorService';
import { WebsiteInfo } from '../../interfaces/door';

const FloatingContact = () => {
  const [info, setInfo] = useState<WebsiteInfo | null>(null);
  const [showScroll, setShowScroll] = useState(false);

  // 1. Load thông tin từ Admin
  useEffect(() => {
    const fetchInfo = async () => {
      const settings = await doorService.getSettings();
      if (settings?.websiteInfo) {
        setInfo(settings.websiteInfo);
      }
    };
    fetchInfo();
  }, []);

  // 2. Logic bắt sự kiện cuộn chuột
  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScroll && window.pageYOffset > 400) {
        setShowScroll(true);
      } else if (showScroll && window.pageYOffset <= 400) {
        setShowScroll(false);
      }
    };

    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, [showScroll]);

  // 3. Hàm cuộn lên đầu
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!info) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3 group">
      
      {/* --- NÚT SCROLL TOP (Chỉ hiện khi cuộn xuống) --- */}
      <button 
        onClick={scrollToTop}
        className={`w-10 h-10 bg-gray-600/80 hover:bg-gray-800 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform 
          ${showScroll ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
        title="Lên đầu trang"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>

      {/* --- CÁC NÚT LIÊN HỆ (Luôn hiện) --- */}

      {/* 1. Facebook */}
      {info.facebook && (
        <a 
          href={info.facebook} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform relative group/item"
        >
          {/* Tooltip bên trái */}
          <span className="absolute right-full mr-3 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/item:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Messenger
          </span>
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.03 2 11C2 13.66 3.39 16.04 5.57 17.59L5 22L9.36 19.61C10.21 19.86 11.09 20 12 20C17.52 20 22 15.97 22 11C22 6.03 17.52 2 12 2ZM13.88 14.5L11.63 12.12L7.25 14.5L12.13 9.5L14.38 11.88L18.75 9.5L13.88 14.5Z" /></svg>
        </a>
      )}

      {/* 2. Zalo */}
      {info.zalo && (
        <a 
          href={`https://zalo.me/${info.zalo}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform relative group/item"
        >
          <span className="absolute right-full mr-3 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/item:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Chat Zalo
          </span>
          <span className="font-black text-white text-xl font-sans italic">Z</span>
        </a>
      )}

      {/* 3. Gọi điện (Nổi bật nhất) */}
      {info.phone && (
        <a 
          href={`tel:${info.phone}`} 
          className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform relative group/item animate-bounce-slow"
        >
          <span className="absolute right-full mr-3 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/item:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Hotline: {info.phone}
          </span>
          
          <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
          
          <svg className="w-7 h-7 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </a>
      )}
    </div>
  );
};

export default FloatingContact;