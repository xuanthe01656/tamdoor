import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doorService } from '../../services/doorService';
import { Door, ProductSpecification } from '../../interfaces/door';

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);

  // --- 1. LOGIC SUBDOMAIN ROUTER ---
  const isAdminSubdomain = window.location.hostname.startsWith('admin.');
  const fixPath = (path: string) => isAdminSubdomain ? path : `/admin${path}`;

  // State cấu hình & Dữ liệu
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [brandOptions, setBrandOptions] = useState<string[]>([]);
  const [formData, setFormData] = useState<Partial<Door>>({
    name: '', type: 'door', category: '', price: 0, image: '', description: '',
  });
  const [features, setFeatures] = useState<string[]>([]);
  const [specs, setSpecs] = useState<ProductSpecification[]>([]);

  // --- 2. LOAD DỮ LIỆU BAN ĐẦU ---
  useEffect(() => {
    const initData = async () => {
      if (!id) return;
      try {
        // Lấy settings từ CMS
        const settings = await doorService.getSettings();
        if (settings.categories) setCategoryOptions(settings.categories);
        if (settings.brands) setBrandOptions(settings.brands);

        // Lấy thông tin sản phẩm cần sửa
        const product = await doorService.getProductById(id);
        if (product) {
          setFormData({
            name: product.name,
            type: product.type,
            category: product.category,
            price: product.price,
            image: product.image,
            description: product.description || '',
          });
          setFeatures(product.features || []);
          setSpecs(product.specifications || []);
        } else {
          alert("❌ Không tìm thấy sản phẩm!");
          navigate(fixPath('/products'));
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [id]);

  // --- 3. HANDLERS ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' ? Number(value) : value }));
  };

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSpecs(prev => prev.map(s => s.key === 'Thương hiệu' ? { ...s, value: val } : s));
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImg(true);
    const url = await doorService.uploadImage(file);
    setUploadingImg(false);
    if (url) setFormData(prev => ({ ...prev, image: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (!formData.name || !formData.image) return alert("Vui lòng nhập Tên và Ảnh!");

    setSaving(true);
    const finalData = {
      ...formData,
      features: features.filter(f => f.trim() !== ''),
      specifications: specs.filter(s => s.key.trim() !== '' && s.value.trim() !== '')
    };

    const success = await doorService.updateProduct(id, finalData);
    setSaving(false);
    
    if (success) {
      alert("✅ Cập nhật thành công!");
      navigate(fixPath('/products')); // Điều hướng chính xác theo subdomain
    }
  };

  if (loading) return (
    <div className="p-20 text-center flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-bold text-gray-500">⏳ Đang tải dữ liệu sản phẩm...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto mb-20">
      
      {/* HEADER */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8 flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-black text-gray-800 dark:text-white uppercase tracking-tight">✏️ Sửa sản phẩm</h1>
           <p className="text-sm text-gray-500">Mã sản phẩm: <span className="font-mono text-blue-600 font-bold">{id}</span></p>
        </div>
        <button onClick={() => navigate(fixPath('/products'))} className="px-4 py-2 text-gray-500 hover:text-gray-800 dark:hover:text-white font-bold transition-colors">
          Quay lại
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CỘT TRÁI: NỘI DUNG CHÍNH */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border dark:border-gray-700 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white border-l-4 border-blue-600 pl-4 uppercase tracking-tighter">A. Thông tin chi tiết</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-gray-400 mb-2">Tên sản phẩm *</label>
                <input name="name" required value={formData.name} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-700/50 border dark:border-gray-600 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white font-bold" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-gray-400 mb-2">Mô tả ngắn</label>
                <textarea name="description" rows={3} value={formData.description} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-700/50 border dark:border-gray-600 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"></textarea>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Features */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border dark:border-gray-700 shadow-sm">
              <div className="flex justify-between items-center mb-4 border-b dark:border-gray-700 pb-2">
                <h3 className="font-bold dark:text-white text-sm uppercase">Đặc điểm nổi bật</h3>
                <button type="button" onClick={() => setFeatures([...features, ''])} className="text-blue-600 font-bold text-xs uppercase">+ Thêm</button>
              </div>
              <div className="space-y-2">
                {features.map((feat, index) => (
                  <div key={index} className="flex gap-2">
                    <input value={feat} onChange={(e) => { const n = [...features]; n[index] = e.target.value; setFeatures(n); }} className="flex-1 bg-gray-50 dark:bg-gray-700/50 border dark:border-gray-600 p-2 rounded-lg text-sm dark:text-white"/>
                    <button type="button" onClick={() => setFeatures(features.filter((_, i) => i !== index))} className="text-red-400 font-bold px-1">✕</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Specs */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border dark:border-gray-700 shadow-sm">
              <div className="flex justify-between items-center mb-4 border-b dark:border-gray-700 pb-2">
                <h3 className="font-bold dark:text-white text-sm uppercase">Thông số kỹ thuật</h3>
                <button type="button" onClick={() => setSpecs([...specs, { key: '', value: '' }])} className="text-blue-600 font-bold text-xs uppercase">+ Thêm</button>
              </div>
              <div className="space-y-2">
                {specs.map((spec, index) => (
                  <div key={index} className="flex gap-2">
                    <input placeholder="Tên" value={spec.key} onChange={(e) => { const n = [...specs]; n[index].key = e.target.value; setSpecs(n); }} className="w-1/3 bg-gray-50 dark:bg-gray-700/50 border dark:border-gray-600 p-2 rounded-lg text-xs dark:text-white font-bold" />
                    <input placeholder="Giá trị" value={spec.value} onChange={(e) => { const n = [...specs]; n[index].value = e.target.value; setSpecs(n); }} className="flex-1 bg-gray-50 dark:bg-gray-700/50 border dark:border-gray-600 p-2 rounded-lg text-xs dark:text-white" />
                    <button type="button" onClick={() => setSpecs(specs.filter((_, i) => i !== index))} className="text-red-400 font-bold px-1">✕</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: THIẾT LẬP NHANH */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border dark:border-gray-700 shadow-sm sticky top-24">
            <h3 className="font-bold text-gray-800 dark:text-white mb-6 border-b dark:border-gray-700 pb-2 text-sm uppercase">Thiết lập hiển thị</h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-black uppercase text-gray-400 mb-2">Loại sản phẩm</label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setFormData({...formData, type: 'door'})} className={`flex-1 py-3 rounded-xl border-2 transition-all font-bold text-xs ${formData.type === 'door' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-100 dark:border-gray-600 text-gray-400'}`}>🚪 CỬA</button>
                  <button type="button" onClick={() => setFormData({...formData, type: 'accessory'})} className={`flex-1 py-3 rounded-xl border-2 transition-all font-bold text-xs ${formData.type === 'accessory' ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-100 dark:border-gray-600 text-gray-400'}`}>🔧 PHỤ KIỆN</button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-400 mb-2">Phân loại</label>
                <div className="space-y-3">
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 p-3 rounded-xl font-bold dark:text-white outline-none">
                    {categoryOptions.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                  </select>
                  <select value={specs.find(s => s.key === 'Thương hiệu')?.value || ''} onChange={handleBrandChange} className="w-full bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 p-3 rounded-xl font-bold dark:text-white outline-none">
                    <option value="">-- Chọn thương hiệu --</option>
                    {brandOptions.map(brand => (<option key={brand} value={brand}>{brand}</option>))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-400 mb-2">Giá niêm yết (VNĐ)</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 p-3 rounded-xl font-black text-xl text-blue-600" />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-400 mb-2">Hình ảnh đại diện</label>
                <div className="relative aspect-[3/4] rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 overflow-hidden group bg-gray-50 dark:bg-gray-700/30">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x600?text=Lỗi+Ảnh'; }}/>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageFileChange} disabled={uploadingImg} />
                    <span className="text-white font-bold text-xs uppercase">{uploadingImg ? 'Đang tải...' : 'Thay đổi ảnh'}</span>
                  </div>
                </div>
              </div>

              <button type="submit" disabled={saving || uploadingImg} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-xl shadow-blue-200 dark:shadow-none transition-all active:scale-95 disabled:opacity-50">
                {saving ? 'ĐANG LƯU...' : '💾 CẬP NHẬT NGAY'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductEdit;