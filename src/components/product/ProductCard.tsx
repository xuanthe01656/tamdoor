import { Link } from 'react-router-dom'; // 1. Import Link
import { Door } from '../../interfaces/door';

interface ProductCardProps {
  item: Door;
  onOpenModal: (product: Door) => void;
}

const ProductCard = ({ item, onOpenModal }: ProductCardProps) => {
  
  // Xử lý khi bấm nút "Xem nhanh"
  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault(); // Chặn Link chuyển trang
    e.stopPropagation(); // Chặn sự kiện lan ra ngoài
    onOpenModal(item);
  };

  return (
    <div className="group flex flex-col h-full relative">
      {/* 2. Bao bọc cả thẻ bằng Link */}
      <Link to={`/san-pham/${item.slug}`} className="flex flex-col h-full">
        
        {/* Image Box */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-6 rounded-lg shadow-sm border border-gray-100 group-hover:shadow-xl transition-all duration-300">
          <img 
            src={item.image} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
            alt={item.name}
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x600?text=No+Image'; }}
          />
          
          {/* Tag Category */}
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 text-[10px] font-black uppercase tracking-wider text-gray-900 shadow-sm rounded-sm z-10">
            {item.category}
          </div>
          
          {/* Overlay Button - Nút Xem Nhanh */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
            <button 
              className="bg-white text-black px-6 py-3 font-bold text-xs uppercase tracking-widest hover:bg-blue-700 hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 shadow-lg rounded-sm flex items-center gap-2"
              onClick={handleQuickView} // Gọi hàm xử lý chặn Link
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
          
          {/* 3. Cập nhật phần hiển thị Giá tiền */}
          <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Giá bán:</span>
            
            {/* {item.price > 0 ? (
              <span className="text-blue-700 font-black text-sm uppercase tracking-widest">
                {item.price.toLocaleString('vi-VN')} đ
              </span>
            ) : ( */}
              <span className="text-red-500 font-black text-xs uppercase tracking-widest">
                LIÊN HỆ
              </span>
            {/* )} */}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;