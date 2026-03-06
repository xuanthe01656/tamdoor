import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Door } from '../../interfaces/door';

interface ProductCardProps {
  item: Door;
  onOpenModal: (product: Door) => void;
}

const ProductCard = ({ item, onOpenModal }: ProductCardProps) => {
  // 1. Quản lý ảnh đang hiển thị và màu đang chọn
  const [currentImage, setCurrentImage] = useState(item.image);
  const [activeColor, setActiveColor] = useState('default');

  // Cập nhật lại ảnh khi item thay đổi (phòng trường hợp dùng trong danh sách lọc)
  useEffect(() => {
    setCurrentImage(item.image);
    setActiveColor('default');
  }, [item]);

  // Xử lý khi bấm nút "Xem nhanh"
  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault(); // Chặn Link chuyển trang
    e.stopPropagation(); // Chặn sự kiện lan ra ngoài
    onOpenModal(item);
  };

  // Xử lý khi chọn màu (Chặn chuyển trang khi bấm vào nút màu)
  const handleColorClick = (e: React.MouseEvent, img: string, colorName: string) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage(img);
    setActiveColor(colorName);
  };

  return (
    <div className="group flex flex-col h-full relative">
      <Link to={`/san-pham/${item.slug}`} className="flex flex-col h-full">
        
        {/* Image Box */}
        <div className="relative aspect-[3/4] overflow-hidden bg-white mb-6 rounded-2xl shadow-sm border border-gray-100 group-hover:shadow-xl transition-all duration-300 group-hover:border-blue-100">
          <img 
            src={currentImage} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            alt={item.name}
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x600?text=No+Image'; }}
          />
          
          {/* Tag Category */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider text-gray-900 shadow-sm border border-gray-100 z-10">
            {item.category}
          </div>
          
          {/* Overlay Button - Xem Nhanh */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
            <button 
              className="bg-white text-black px-6 py-3 font-bold text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 shadow-xl rounded-full flex items-center gap-2 border border-gray-100"
              onClick={handleQuickView}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Xem nhanh
            </button>
          </div>
        </div>
        
        {/* Info Section */}
        <div className="flex flex-col flex-grow px-1">
          
          {/* 2. THANH CHỌN MÀU SẮC (Color Swatches) */}
          {item.colors && item.colors.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {/* Nút màu mặc định */}
              <button
                onMouseEnter={() => { setCurrentImage(item.image); setActiveColor('default'); }}
                onClick={(e) => handleColorClick(e, item.image, 'default')}
                className={`w-6 h-6 rounded-full border-2 overflow-hidden transition-all shadow-sm ${activeColor === 'default' ? 'border-blue-600 scale-110' : 'border-gray-200 hover:border-blue-400'}`}
                title="Màu mặc định"
              >
                <img src={item.image} className="w-full h-full object-cover" alt="Default" />
              </button>

              {/* Các nút màu biến thể */}
              {item.colors.map((c, i) => (
                <button
                  key={i}
                  onMouseEnter={() => { setCurrentImage(c.image); setActiveColor(c.name); }}
                  onClick={(e) => handleColorClick(e, c.image, c.name)}
                  className={`w-6 h-6 rounded-full border-2 overflow-hidden transition-all shadow-sm ${activeColor === c.name ? 'border-blue-600 scale-110' : 'border-gray-200 hover:border-blue-400'}`}
                  title={c.name}
                >
                  <img src={c.image} className="w-full h-full object-cover" alt={c.name} />
                </button>
              ))}
            </div>
          )}

          <h3 className="font-bold text-lg uppercase leading-tight group-hover:text-blue-700 transition-colors line-clamp-2 min-h-[3rem] mb-2">
            {item.name}
          </h3>
          
          <p className="text-gray-500 text-xs mb-4 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
          
          {/* Phần hiển thị Giá tiền / Liên hệ */}
          <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Giá bán:</span>
            
            {item.price && item.price > 0 ? (
              <span className="text-blue-700 font-black text-sm uppercase tracking-widest">
                {item.price.toLocaleString('vi-VN')} đ
              </span>
            ) : (
              <span className="text-red-500 font-black text-xs uppercase tracking-widest bg-red-50 px-2 py-1 rounded">
                LIÊN HỆ
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;