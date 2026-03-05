import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doorService } from '../../services/doorService';
import { Door } from '../../interfaces/door';

const ProductDetail = () => {
  const { slug } = useParams(); // Lấy slug từ URL
  const [product, setProduct] = useState<Door | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Quản lý ảnh đang hiển thị và màu đang chọn
  const [activeImage, setActiveImage] = useState<string>('');
  const [activeColor, setActiveColor] = useState<string>('');

  // Khi load xong product, set ảnh mặc định là ảnh đại diện
  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      setActiveColor('default');
    }
  }, [product]);

  // Load dữ liệu
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProduct = async () => {
      if (!slug) return;
      const data = await doorService.getProductBySlug(slug);
      setProduct(data || null);
      setLoading(false);
    };
    fetchProduct();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl font-light">Đang tải sản phẩm...</div>;

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm!</h2>
      <Link to="/san-pham" className="text-blue-600 hover:underline">← Quay lại danh sách</Link>
    </div>
  );

  return (
    <div className="bg-white min-h-screen pb-20">
      
      {/* 1. BREADCRUMB (Đường dẫn điều hướng) */}
      <div className="bg-gray-50 py-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-sm text-gray-500">
          <Link to="/" className="hover:text-blue-600">Trang chủ</Link>
          <span className="mx-2">/</span>
          <Link to="/san-pham" className="hover:text-blue-600">Sản phẩm</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* 2. CỘT HÌNH ẢNH */}
          <div className="space-y-4">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm relative group">
              {/* Đã đổi src thành activeImage để thay đổi khi click màu */}
              <img 
                src={activeImage} 
                alt={product.name} 
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
              />
              {/* Tag danh mục */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-gray-800 shadow-sm border border-gray-100">
                {product.category}
              </div>
            </div>
          </div>

          {/* 3. CỘT THÔNG TIN */}
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 leading-tight uppercase">
              {product.name}
            </h1>

            {/* Giá bán */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
              {product.price > 0 ? (
                <div className="flex items-end gap-3">
                  <span className="text-3xl font-bold text-blue-700">{product.price.toLocaleString('vi-VN')} đ</span>
                  <span className="text-gray-400 text-sm mb-1">(Giá tham khảo)</span>
                </div>
              ) : (
                <span className="text-2xl font-bold text-red-500">LIÊN HỆ BÁO GIÁ</span>
              )}
            </div>

            {/* BỘ CHỌN MÀU SẮC (Sẽ ẩn nếu không có màu nào được thêm) */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-8 border-t border-gray-100 pt-6">
                <h3 className="text-sm font-bold uppercase text-gray-500 mb-4 tracking-widest flex items-center gap-2">
                  🎨 Màu sắc: <span className="text-blue-600">{activeColor !== 'default' ? activeColor : 'Mặc định'}</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {/* Nút màu mặc định */}
                  <button 
                    onClick={() => { setActiveImage(product.image); setActiveColor('default'); }}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer bg-gray-50 ${activeColor === 'default' ? 'border-blue-600 shadow-md scale-110' : 'border-gray-200 hover:border-blue-300 opacity-70 hover:opacity-100'}`}
                    title="Màu mặc định"
                  >
                    <img src={product.image} className="w-full h-full object-cover" alt="Mặc định" />
                  </button>

                  {/* Các nút màu biến thể */}
                  {product.colors.map((colorItem, idx) => (
                    <button 
                      key={idx}
                      onClick={() => { setActiveImage(colorItem.image); setActiveColor(colorItem.name); }}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all relative group cursor-pointer bg-gray-50 ${activeColor === colorItem.name ? 'border-blue-600 shadow-md scale-110' : 'border-gray-200 hover:border-blue-300 opacity-70 hover:opacity-100'}`}
                      title={colorItem.name}
                    >
                      <img src={colorItem.image} className="w-full h-full object-cover" alt={colorItem.name} />
                      {/* Tooltip khi hover (Desktop) */}
                      <div className="absolute inset-0 bg-black/60 hidden group-hover:flex items-center justify-center text-[10px] font-bold text-white text-center leading-tight px-1 backdrop-blur-sm transition-all">
                         {colorItem.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Đặc điểm nổi bật (Features) */}
            {product.features && product.features.length > 0 && (
              <div className="mb-8">
                <h3 className="font-bold text-gray-900 mb-4 uppercase text-sm tracking-wide border-l-4 border-blue-600 pl-3">Đặc điểm nổi bật:</h3>
                <ul className="space-y-3">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-700">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Mô tả ngắn */}
            <div className="prose prose-sm text-gray-600 mb-10 leading-relaxed">
              <p>{product.description}</p>
            </div>

            {/* Nút hành động (CTA) */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="tel:090xxxxxxx" 
                className="flex-1 bg-blue-700 text-white py-4 rounded-lg font-bold text-center hover:bg-blue-800 transition-all shadow-lg shadow-blue-200 uppercase tracking-wide"
              >
                📞 Gọi ngay tư vấn
              </a>
              <button className="flex-1 border-2 border-gray-900 text-gray-900 py-4 rounded-lg font-bold hover:bg-gray-900 hover:text-white transition-all uppercase tracking-wide">
                💬 Chat Zalo
              </button>
            </div>
          </div>
        </div>

        {/* 4. PHẦN DƯỚI: THÔNG SỐ KỸ THUẬT (Table) */}
        {product.specifications && product.specifications.length > 0 && (
          <div className="mt-20">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-tight inline-block border-b-4 border-blue-600 pb-2">
                Thông số kỹ thuật chi tiết
              </h2>
            </div>
            
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left">
                <tbody className="divide-y divide-gray-100">
                  {product.specifications.map((spec, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}>
                      <td className="p-4 md:p-5 font-bold text-gray-700 w-1/3 align-top border-r border-gray-100">
                        {spec.key}
                      </td>
                      <td className="p-4 md:p-5 text-gray-600 font-medium">
                        {spec.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetail;