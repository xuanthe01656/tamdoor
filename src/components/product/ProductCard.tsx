import { Door } from '../../interfaces/door';

interface ProductCardProps {
  item: Door;
  onOpenModal: (product: Door) => void;
}

const ProductCard = ({ item, onOpenModal }: ProductCardProps) => {
  return (
    <div 
      className="group flex flex-col h-full cursor-pointer bg-white" 
      onClick={() => onOpenModal(item)}
    >
      {/* Image Box */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-6 rounded-lg shadow-sm border border-gray-100 group-hover:shadow-xl transition-all duration-300">
        <img 
          src={item.image} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          alt={item.name} 
        />
        
        {/* Tag Category */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 text-[10px] font-black uppercase tracking-wider text-gray-900 shadow-sm rounded-sm z-10">
          {item.category}
        </div>
        
        {/* Overlay Button */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
          <button 
            className="bg-white text-black px-6 py-3 font-bold text-xs uppercase tracking-widest hover:bg-blue-700 hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 shadow-lg rounded-sm"
            onClick={(e) => { e.stopPropagation(); onOpenModal(item); }}
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
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Trạng thái:</span>
          <span className="text-blue-700 font-black text-sm uppercase tracking-widest">
            LIÊN HỆ NGAY
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;