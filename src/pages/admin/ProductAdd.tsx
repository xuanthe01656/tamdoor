import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doorService } from '../../services/doorService';
import { Door, ProductSpecification } from '../../interfaces/door';

const ProductAdd = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // --- 1. STATE DỮ LIỆU CẤU HÌNH (Lấy từ Firebase) ---
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [brandOptions, setBrandOptions] = useState<string[]>([]);

  // Load cấu hình khi vào trang
  useEffect(() => {
    const fetchSettings = async () => {
      const settings = await doorService.getSettings();
      if (settings.categories) setCategoryOptions(settings.categories);
      if (settings.brands) setBrandOptions(settings.brands);
    };
    fetchSettings();
  }, []);

  // --- 2. TEMPLATE CỨNG (Chỉ giữ lại cấu trúc Key, Value để trống hoặc mặc định chung) ---
  const DOOR_SPECS_TEMPLATE = [
    { key: 'Thương hiệu', value: '' }, 
    { key: 'Chất liệu', value: 'Nhựa gỗ Composite nguyên khối' },
    { key: 'Kích thước chuẩn', value: '900 x 2200 mm' },
    { key: 'Độ dày cánh', value: '40 mm (± 2mm)' },
    { key: 'Hệ khung bao', value: '45 x 100 mm (Nẹp cài thông minh)' },
    { key: 'Bề mặt', value: 'Phủ phim PVC vân gỗ cao cấp' },
    { key: 'Bảo hành', value: '5 năm' },
  ];

  const ACCESSORY_SPECS_TEMPLATE = [
    { key: 'Thương hiệu', value: '' },
    { key: 'Chất liệu', value: 'Inox 304' },
    { key: 'Màu sắc', value: 'Đen mờ / Vàng Gold' },
    { key: 'Xuất xứ', value: 'Chính hãng' },
    { key: 'Bảo hành', value: '12 tháng' },
  ];

  // --- 3. STATE FORM ---
  const [formData, setFormData] = useState<Partial<Door>>({
    name: '',
    type: 'door',
    category: '',
    price: 0,
    image: '',
    description: '',
  });

  const [features, setFeatures] = useState<string[]>([
    'Chống nước tuyệt đối 100%, không ẩm mốc',
    'Không cong vênh, co ngót theo thời tiết',
    'Cách âm, cách nhiệt, đóng mở êm ái',
    'Thiết kế hiện đại, màu sắc vân gỗ tự nhiên'
  ]);

  const [specs, setSpecs] = useState<ProductSpecification[]>(DOOR_SPECS_TEMPLATE);

  // Set category mặc định khi load xong options
  useEffect(() => {
    if (categoryOptions.length > 0 && !formData.category) {
      setFormData(prev => ({ ...prev, category: categoryOptions[0] }));
    }
  }, [categoryOptions]);

  // Logic đổi Template khi chọn Loại
  useEffect(() => {
    if (formData.type === 'door') {
      setSpecs(DOOR_SPECS_TEMPLATE);
      // Cố gắng tìm danh mục chứa chữ "Cửa"
      const doorCat = categoryOptions.find(c => c.includes('Cửa')) || categoryOptions[0];
      if (doorCat) setFormData(prev => ({ ...prev, category: doorCat }));
    } else {
      setSpecs(ACCESSORY_SPECS_TEMPLATE);
      // Cố gắng tìm danh mục chứa chữ "Phụ kiện" hoặc "Khóa"
      const accCat = categoryOptions.find(c => c.includes('Phụ kiện') || c.includes('Khóa'));
      if (accCat) setFormData(prev => ({ ...prev, category: accCat }));
    }
  }, [formData.type, categoryOptions]);

  // --- HANDLERS ---
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' ? Number(value) : value
    });
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };
  const addFeatureRow = () => setFeatures([...features, '']);
  const removeFeatureRow = (index: number) => setFeatures(features.filter((_, i) => i !== index));

  const handleSpecChange = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
  };
  const addSpecRow = () => setSpecs([...specs, { key: '', value: '' }]);
  const removeSpecRow = (index: number) => setSpecs(specs.filter((_, i) => i !== index));

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.name || !formData.image) {
      alert("Vui lòng nhập tên và link ảnh!");
      setLoading(false);
      return;
    }

    const finalData = {
      ...formData,
      features: features.filter(f => f.trim() !== ''),
      specifications: specs.filter(s => s.key.trim() !== '' && s.value.trim() !== '')
    };

    const success = await doorService.addProduct(finalData);
    setLoading(false);
    if (success) {
      alert("✅ Thêm sản phẩm thành công!");
      navigate('/admin/products');
    } else {
      alert("❌ Có lỗi xảy ra!");
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100 mb-20">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">Thêm sản phẩm mới</h1>
        <button onClick={() => navigate('/admin/products')} className="text-gray-500 hover:text-gray-700 font-medium">
          Quay lại danh sách
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CỘT TRÁI (Lớn) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* A. THÔNG TIN CƠ BẢN */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-800 border-l-4 border-blue-500 pl-3">A. Thông tin chung</h3>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Tên sản phẩm <span className="text-red-500">*</span></label>
              <input 
                type="text" name="name" required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder={formData.type === 'door' ? "VD: Cửa nhựa Composite Sungyu SYB-686" : "VD: Khóa cửa Huy Hoàng EX-123"}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả ngắn (SEO)</label>
              <textarea name="description" rows={3} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none" placeholder="Mô tả ngắn gọn..."></textarea>
            </div>
          </div>

          {/* B. ĐẶC ĐIỂM NỔI BẬT */}
          <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800">B. Đặc điểm nổi bật</h3>
              <button type="button" onClick={addFeatureRow} className="text-sm bg-white border border-blue-500 text-blue-600 px-3 py-1 rounded hover:bg-blue-100 font-medium">+ Thêm dòng</button>
            </div>
            <div className="space-y-3">
              {features.map((feat, index) => (
                <div key={index} className="flex gap-2">
                  <span className="flex items-center text-blue-500 font-bold">•</span>
                  <input type="text" value={feat} onChange={(e) => handleFeatureChange(index, e.target.value)} className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"/>
                  <button type="button" onClick={() => removeFeatureRow(index)} className="text-red-400 font-bold px-2">✕</button>
                </div>
              ))}
            </div>
          </div>

          {/* C. THÔNG SỐ KỸ THUẬT */}
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-gray-800">C. Thông số kỹ thuật</h3>
                <p className="text-xs text-gray-500 italic mt-1">
                  Mẫu: <span className="font-bold text-blue-600">{formData.type === 'door' ? 'Cửa' : 'Phụ kiện'}</span>
                </p>
              </div>
              <button type="button" onClick={addSpecRow} className="text-sm bg-white border border-gray-400 text-gray-700 px-3 py-1 rounded hover:bg-gray-200 font-medium">+ Thêm dòng</button>
            </div>
            <div className="space-y-3">
              {/* Datalist cho Thương hiệu */}
              <datalist id="brand-list">
                {brandOptions.map((brand, idx) => <option key={idx} value={brand} />)}
              </datalist>

              {specs.map((spec, index) => (
                <div key={index} className="flex gap-3">
                  <input 
                    type="text" placeholder="Tên thông số" value={spec.key}
                    onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                    className="w-1/3 border border-gray-300 rounded px-3 py-2 text-sm outline-none font-medium bg-white"
                  />
                  <input 
                    type="text" 
                    placeholder="Giá trị" 
                    value={spec.value}
                    // Nếu key là "Thương hiệu" thì dùng datalist để gợi ý
                    list={spec.key === 'Thương hiệu' ? "brand-list" : undefined}
                    onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm outline-none bg-white focus:border-blue-500"
                  />
                  <button type="button" onClick={() => removeSpecRow(index)} className="text-red-400 font-bold px-2">✕</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CỘT PHẢI (Nhỏ) */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm sticky top-6">
            <h3 className="font-bold text-gray-800 border-b pb-2 mb-4">Phân loại & Giá</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Loại sản phẩm</label>
              <div className="flex gap-2">
                <label className={`flex-1 flex items-center justify-center gap-2 cursor-pointer p-3 rounded-lg border transition-all ${formData.type === 'door' ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold' : 'border-gray-200 text-gray-500'}`}>
                  <input type="radio" name="type" value="door" checked={formData.type === 'door'} onChange={handleChange} className="hidden" /> 
                  🚪 CỬA
                </label>
                <label className={`flex-1 flex items-center justify-center gap-2 cursor-pointer p-3 rounded-lg border transition-all ${formData.type === 'accessory' ? 'bg-purple-50 border-purple-500 text-purple-700 font-bold' : 'border-gray-200 text-gray-500'}`}>
                  <input type="radio" name="type" value="accessory" checked={formData.type === 'accessory'} onChange={handleChange} className="hidden" /> 
                  🔧 PHỤ KIỆN
                </label>
              </div>
            </div>

            {/* DANH MỤC - Dùng Select Box Động */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">Danh mục hiển thị</label>
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleChange} 
                className="w-full border border-gray-300 rounded px-3 py-2 outline-none bg-white"
              >
                {categoryOptions.length === 0 && <option value="">Đang tải danh mục...</option>}
                {categoryOptions.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">Giá bán (VNĐ)</label>
              <input type="number" name="price" onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 outline-none font-bold text-gray-800 text-lg" placeholder="0"/>
              <p className="text-xs text-blue-600 mt-1 italic">* Để 0 sẽ hiển thị "LIÊN HỆ"</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Link hình ảnh <span className="text-red-500">*</span></label>
              <input type="text" name="image" required onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 outline-none text-sm" placeholder="https://..."/>
              <div className="mt-3 aspect-[3/4] bg-gray-100 rounded border border-gray-300 flex items-center justify-center overflow-hidden relative">
                {formData.image ? (
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=Lỗi+Link'; }}/>
                ) : (
                  <span className="text-gray-400 text-xs">Preview Ảnh</span>
                )}
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50">
              {loading ? 'Đang lưu...' : '💾 LƯU SẢN PHẨM'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductAdd;