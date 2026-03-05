import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doorService } from '../../services/doorService';
import { Door, ProductSpecification, ProductColor } from '../../interfaces/door';

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
  const [colors, setColors] = useState<ProductColor[]>([]); // STATE QUẢN LÝ MÀU SẮC

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
          setColors(product.colors || []); // Nạp dữ liệu màu sắc nếu có
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

  // 👇 ĐÃ FIX: Sửa logic hàm handleBrandChange
  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSpecs(prev => {
      // Kiểm tra xem đã có spec 'Thương hiệu' chưa
      const hasBrand = prev.some(s => s.key === 'Thương hiệu');
      if (hasBrand) {
        // Nếu có rồi thì cập nhật giá trị
        return prev.map(s => s.key === 'Thương hiệu' ? { ...s, value: val } : s);
      } else {
        // Nếu chưa có thì thêm mới vào mảng
        return [...prev, { key: 'Thương hiệu', value: val }];
      }
    });
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImg(true);
    const url = await doorService.uploadImage(file);
    setUploadingImg(false);
    if (url) setFormData(prev => ({ ...prev, image: url }));
  };

  // Các hàm quản lý Biến thể màu sắc
  const addColorRow = () => setColors([...colors, { name: '', image: '' }]);
  const removeColorRow = (index: number) => setColors(colors.filter((_, i) => i !== index));
  const handleColorNameChange = (index: number, name: string) => {
    const newColors = [...colors];
    newColors[index].name = name;
    setColors(newColors);
  };
  const handleColorImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await doorService.uploadImage(file);
    if (url) {
      const newColors = [...colors];
      newColors[index].image = url;
      setColors(newColors);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (!formData.name || !formData.image) return alert("Vui lòng nhập Tên và Ảnh!");

    setSaving(true);
    const finalData = {
      ...formData,
      features: features.filter(f => f.trim() !== ''),
      specifications: specs.filter(s => s.key.trim() !== '' && s.value.trim() !== ''),
      colors: colors.filter(c => c.name.trim() !== '' && c.image !== '') // Lọc bỏ màu trống
    };

    const success = await doorService.updateProduct(id, finalData);
    setSaving(false);
    
    if (success) {
      alert("✅ Cập nhật thành công!");
      navigate(fixPath('/products'));
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
                <button type="button" onClick={() => setFeatures([...features, ''])} className="text-blue-600 font-bold text-xs uppercase hover:underline">+ Thêm</button>
              </div>
              <div className="space-y-2">
                {features.map((feat, index) => (
                  <div key={index} className="flex gap-2">
                    <input value={feat} onChange={(e) => { const n = [...features]; n[index] = e.target.value; setFeatures(n); }} className="flex-1 bg-gray-50 dark:bg-gray-700/50 border dark:border-gray-600 p-2 rounded-lg text-sm dark:text-white outline-none focus:border-gray-400"/>
                    <button type="button" onClick={() => setFeatures(features.filter((_, i) => i !== index))} className="text-red-400 font-bold px-1">✕</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Specs */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border dark:border-gray-700 shadow-sm">
              <div className="flex justify-between items-center mb-4 border-b dark:border-gray-700 pb-2">
                <h3 className="font-bold dark:text-white text-sm uppercase">Thông số kỹ thuật</h3>
                <button type="button" onClick={() => setSpecs([...specs, { key: '', value: '' }])} className="text-blue-600 font-bold text-xs uppercase hover:underline">+ Thêm</button>
              </div>
              <div className="space-y-2">
                {specs.map((spec, index) => (
                  <div key={index} className="flex gap-2">
                    <input placeholder="Tên" value={spec.key} onChange={(e) => { const n = [...specs]; n[index].key = e.target.value; setSpecs(n); }} className="w-1/3 bg-gray-50 dark:bg-gray-700/50 border dark:border-gray-600 p-2 rounded-lg text-xs dark:text-white font-bold outline-none focus:border-gray-400" />
                    <input placeholder="Giá trị" value={spec.value} onChange={(e) => { const n = [...specs]; n[index].value = e.target.value; setSpecs(n); }} className="flex-1 bg-gray-50 dark:bg-gray-700/50 border dark:border-gray-600 p-2 rounded-lg text-xs dark:text-white outline-none focus:border-gray-400" />
                    <button type="button" onClick={() => setSpecs(specs.filter((_, i) => i !== index))} className="text-red-400 font-bold px-1">✕</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BIẾN THỂ MÀU SẮC */}
          <div className="bg-purple-50 dark:bg-purple-900/10 p-6 rounded-2xl border border-purple-100 dark:border-purple-800 shadow-sm">
            <div className="flex justify-between items-center mb-4 border-b border-purple-100 dark:border-purple-800/50 pb-3">
              <div>
                <h3 className="font-bold text-purple-900 dark:text-purple-100 text-sm uppercase">Biến thể màu sắc (Tùy chọn)</h3>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Sử dụng khi sản phẩm có nhiều màu vân gỗ/sơn khác nhau</p>
              </div>
              <button type="button" onClick={addColorRow} className="text-sm bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-300 px-3 py-1.5 rounded hover:bg-purple-300 dark:hover:bg-purple-700 font-bold transition-colors">
                + Thêm màu
              </button>
            </div>
            
            <div className="space-y-3">
              {colors.map((color, index) => (
                <div key={index} className="flex gap-4 items-start bg-white dark:bg-gray-800 p-4 rounded-xl border border-purple-100 dark:border-gray-700 shadow-sm">
                  {/* Nhập tên màu */}
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Tên màu</label>
                    <input 
                      type="text" 
                      placeholder="VD: Óc chó, Trắng Sứ..." 
                      value={color.name} 
                      onChange={(e) => handleColorNameChange(index, e.target.value)} 
                      className="w-full border dark:border-gray-600 p-2.5 rounded-lg text-sm dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  {/* Upload ảnh cho màu */}
                  <div className="w-24">
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 text-center">Hình ảnh</label>
                    <div className="relative aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center overflow-hidden group bg-gray-50 dark:bg-gray-700 cursor-pointer hover:border-purple-500 transition-colors">
                      {color.image ? (
                        <img src={color.image} className="w-full h-full object-cover" alt="Color variant"/>
                      ) : (
                        <span className="text-2xl text-gray-300 group-hover:text-purple-400 transition-colors">+</span>
                      )}
                      <input 
                          type="file" 
                          accept="image/*" 
                          className="absolute inset-0 opacity-0 cursor-pointer" 
                          onChange={(e) => handleColorImageUpload(index, e)} 
                      />
                    </div>
                  </div>
                  
                  {/* Nút Xóa */}
                  <div className="pt-6">
                    <button type="button" onClick={() => removeColorRow(index)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors" title="Xóa màu này">
                      ✕
                    </button>
                  </div>
                </div>
              ))}
              {colors.length === 0 && (
                 <div className="text-center py-6 border-2 border-dashed border-purple-200 dark:border-purple-800/50 rounded-xl text-purple-400 dark:text-purple-500 text-sm">
                    Sản phẩm này hiện chưa có biến thể màu sắc. <br/> (Sẽ hiển thị ảnh đại diện mặc định)
                 </div>
              )}
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: THIẾT LẬP NHANH */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border dark:border-gray-700 shadow-sm sticky top-24">
            <h3 className="font-bold text-gray-800 dark:text-white mb-6 border-b dark:border-gray-700 pb-2 text-sm uppercase tracking-widest">Thiết lập hiển thị</h3>
            
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
                  
                  {/* Select Thương hiệu liên kết với Specs */}
                  <select value={specs.find(s => s.key === 'Thương hiệu')?.value || ''} onChange={handleBrandChange} className="w-full bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 p-3 rounded-xl font-bold dark:text-white outline-none">
                    <option value="">-- Chọn thương hiệu --</option>
                    {brandOptions.map(brand => (<option key={brand} value={brand}>{brand}</option>))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-400 mb-2">Giá niêm yết (VNĐ)</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 p-3 rounded-xl font-black text-xl text-blue-600 outline-none focus:ring-2 focus:ring-blue-500" />
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

              <button type="submit" disabled={saving || uploadingImg} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-xl shadow-blue-200 dark:shadow-none transition-all active:scale-95 disabled:opacity-50 tracking-widest">
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