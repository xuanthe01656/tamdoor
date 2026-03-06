import { useEffect, useState } from 'react';
import { doorService } from '../../services/doorService';
import { Door } from '../../interfaces/door';

interface ProductModalProps {
  product: Door | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // State quản lý Ảnh và Màu sắc hiển thị
  const [activeImage, setActiveImage] = useState<string>('');
  const [activeColor, setActiveColor] = useState<string>('');
  
  // State lấy thông tin liên hệ từ CMS
  const [cmsInfo, setCmsInfo] = useState<any>(null);

  useEffect(() => {
    if (isOpen && product) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
      setActiveImage(product.image);
      setActiveColor('default');

      // Lấy Hotline và Catalogue từ CMS (đã có cache nên tải cực nhanh)
      const fetchCms = async () => {
        const settings = await doorService.getSettings();
        setCmsInfo(settings.companyInfo);
      };
      fetchCms();
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }
  }, [isOpen, product]);

  if (!isVisible && !isOpen) return null;
  // Trích xuất thông tin an toàn từ cmsInfo
  const displayPhone = cmsInfo?.phone || "09xx.xxx.xxx";
  const telLink = `tel:${displayPhone.replace(/\s/g, '')}`; // Xóa dấu cách để tạo link gọi điện chuẩn
  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      ></div>

      <div className={`relative bg-white dark:bg-gray-800 w-full max-w-6xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row transition-all duration-500 transform ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-10'}`}>
        
        {/* Nút Đóng */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 z-30 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-red-500 text-white rounded-full transition-all duration-300 backdrop-blur-xl border border-white/20"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        {/* CỘT TRÁI: HÌNH ẢNH (Có hiệu ứng chuyển ảnh mượt) */}
        <div className="w-full md:w-1/2 h-80 md:h-auto bg-gray-100 dark:bg-gray-900 relative shrink-0 overflow-hidden">
          <img 
            key={activeImage} // Force re-render để chạy animation khi đổi màu
            src={activeImage || product?.image} 
            alt={product?.name} 
            className="w-full h-full object-cover animate-fadeIn"
          />
          {/* Tag Trang trí */}
          <div className="absolute bottom-6 left-6 bg-blue-600 text-white px-4 py-2 rounded-lg font-black text-xs uppercase tracking-widest shadow-xl">
            Premium Quality
          </div>
        </div>

        {/* CỘT PHẢI: THÔNG TIN */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col bg-white dark:bg-gray-800 overflow-y-auto custom-scrollbar">
          <div className="mb-4">
            <span className="text-blue-600 dark:text-blue-400 font-black tracking-widest text-[10px] uppercase bg-blue-50 dark:bg-blue-900/30 px-4 py-1.5 rounded-full border border-blue-100 dark:border-blue-800">
               {product?.category}
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-black uppercase text-gray-900 dark:text-white leading-tight mb-4">
            {product?.name}
          </h2>

          <div className="text-2xl font-black text-blue-700 dark:text-blue-400 mb-8 flex items-center gap-3">
             <span className="text-gray-400 text-sm font-bold line-through italic opacity-50">Giá niêm yết</span>
             {product?.price && product.price > 0 
               ? `${product.price.toLocaleString('vi-VN')} đ` 
               : 'LIÊN HỆ BÁO GIÁ'
             }
          </div>

          {/* BỘ CHỌN MÀU SẮC */}
          <div className="mb-10 p-5 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700">
            <h3 className="text-xs font-black uppercase text-gray-500 dark:text-gray-400 mb-4 tracking-[0.2em] flex items-center justify-between">
              <span>Bảng màu vân gỗ</span>
              <span className="text-blue-600 dark:text-blue-400 font-bold">{activeColor !== 'default' ? activeColor : 'Mặc định'}</span>
            </h3>
            
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => { setActiveImage(product?.image || ''); setActiveColor('default'); }}
                className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all relative ${activeColor === 'default' ? 'border-blue-600 ring-4 ring-blue-100 dark:ring-blue-900/30 scale-105' : 'border-white dark:border-gray-600 opacity-60 hover:opacity-100'}`}
              >
                <img src={product?.image} className="w-full h-full object-cover" alt="Mặc định" />
              </button>

              {product?.colors?.map((colorItem, idx) => (
                <button 
                  key={idx}
                  onClick={() => { setActiveImage(colorItem.image); setActiveColor(colorItem.name); }}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all relative ${activeColor === colorItem.name ? 'border-blue-600 ring-4 ring-blue-100 dark:ring-blue-900/30 scale-105' : 'border-white dark:border-gray-600 opacity-60 hover:opacity-100'}`}
                  title={colorItem.name}
                >
                  <img src={colorItem.image} className="w-full h-full object-cover" alt={colorItem.name} />
                </button>
              ))}
            </div>
          </div>

          {/* MÔ TẢ */}
          <div className="mb-10">
             <h3 className="text-xs font-black uppercase text-gray-400 mb-4 tracking-[0.2em]">Giới thiệu sản phẩm</h3>
             <p className="text-gray-600 dark:text-gray-300 leading-relaxed italic">
               "{product?.description}"
             </p>
          </div>

          {/* THÔNG SỐ KỸ THUẬT */}
          {product?.specifications && product.specifications.length > 0 && (
            <div className="mb-10">
              <h3 className="text-xs font-black uppercase text-gray-400 mb-4 tracking-[0.2em]">Thông số chi tiết</h3>
              <div className="grid grid-cols-1 gap-2">
                {product.specifications.map((spec, index) => (
                  <div key={index} className="flex justify-between py-2 border-b border-gray-50 dark:border-gray-700 text-sm">
                    <span className="text-gray-500 dark:text-gray-400 font-bold">{spec.key}</span>
                    <span className="text-gray-900 dark:text-white font-black">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FOOTER: LIÊN HỆ & CATALOGUE (Dữ liệu từ CMS) */}
          <div className="mt-auto pt-8 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-4">
            <a 
              href={telLink}
              className="flex-[2] bg-blue-700 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-blue-800 transition-all shadow-xl shadow-blue-200 dark:shadow-none text-center flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              {displayPhone} 
            </a>
              
              {cmsInfo?.catalogueUrl && (
                <a 
                  href={cmsInfo.catalogueUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-center flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  Catalogue
                </a>
              )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default ProductModal;