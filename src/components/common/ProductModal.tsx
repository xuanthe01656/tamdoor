import { useEffect, useState } from 'react';
import { Door } from '../../interfaces/door';

interface ProductModalProps {
  product: Door | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      <div className={`relative bg-white w-full max-w-6xl max-h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row transition-all duration-500 transform ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-10'}`}>
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center bg-black/10 hover:bg-black text-black hover:text-white rounded-full transition-all duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        {/* Cột Trái: Hình ảnh (Có cuộn nếu ảnh dài) */}
        <div className="w-full md:w-5/12 h-64 md:h-auto bg-gray-100 relative shrink-0">
          {product?.image && (
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Cột Phải: Thông tin (Có thanh cuộn riêng) */}
        <div className="w-full md:w-7/12 p-8 md:p-10 flex flex-col bg-white overflow-y-auto custom-scrollbar">
          <div className="mb-2">
            <span className="text-blue-600 font-bold tracking-widest text-xs uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
               {product?.category}
            </span>
          </div>

          <h2 className="text-3xl font-black uppercase text-gray-900 leading-tight mb-4">
            {product?.name}
          </h2>

          <div className="text-2xl font-bold text-blue-700 mb-6">
             {/* {product?.price ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price) : 'Liên hệ báo giá'} */}
             Liên hệ báo giá
          </div>

          <p className="text-gray-600 leading-relaxed mb-8 border-l-4 border-gray-200 pl-4">
            {product?.description}
          </p>

          {/* --- BẢNG THÔNG SỐ KỸ THUẬT (PHẦN MỚI) --- */}
          {product?.specifications && product.specifications.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-bold uppercase text-gray-900 mb-4 tracking-widest flex items-center gap-2">
                <span className="w-6 h-[2px] bg-black"></span> 
                Thông số kỹ thuật
              </h3>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden text-sm">
                <table className="w-full text-left">
                  <tbody>
                    {product.specifications.map((spec, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="p-3 font-semibold text-gray-700 w-1/3 border-r border-gray-100">{spec.key}</td>
                        <td className="p-3 text-gray-600">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Footer của Modal */}
          <div className="mt-auto pt-6 border-t border-gray-100 flex gap-4">
             <button className="flex-1 bg-blue-700 text-white py-4 font-bold uppercase tracking-widest hover:bg-blue-800 transition-colors rounded-sm shadow-lg">
               Liên hệ ngay: 09xx.xxx.xxx
             </button>
             <button className="px-6 border border-gray-300 font-bold uppercase hover:bg-gray-50 rounded-sm">
               Tải Catalogue
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;