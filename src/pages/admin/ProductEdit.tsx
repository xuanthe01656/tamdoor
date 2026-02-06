import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doorService } from '../../services/doorService';
import { Door, ProductSpecification } from '../../interfaces/door';

const ProductEdit = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // State cấu hình (để đổ vào dropdown)
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [brandOptions, setBrandOptions] = useState<string[]>([]);

  // State dữ liệu Form
  const [formData, setFormData] = useState<Partial<Door>>({
    name: '', type: 'door', category: '', price: 0, image: '', description: '',
  });
  const [features, setFeatures] = useState<string[]>([]);
  const [specs, setSpecs] = useState<ProductSpecification[]>([]);

  // 1. LOAD DỮ LIỆU BAN ĐẦU
  useEffect(() => {
    const initData = async () => {
      if (!id) return;

      // a. Lấy cấu hình trước
      const settings = await doorService.getSettings();
      if (settings.categories) setCategoryOptions(settings.categories);
      if (settings.brands) setBrandOptions(settings.brands);

      // b. Lấy thông tin sản phẩm cần sửa
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
        // Nếu data cũ không có features/specs thì để mảng rỗng
        setFeatures(product.features || []);
        setSpecs(product.specifications || []);
      } else {
        alert("Không tìm thấy sản phẩm!");
        navigate('/admin/products');
      }
      setLoading(false);
    };

    initData();
  }, [id]);

  // --- CÁC HÀM XỬ LÝ (GIỐNG TRANG ADD) ---
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'price' ? Number(value) : value });
  };

  // Xử lý Features
  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };
  const addFeatureRow = () => setFeatures([...features, '']);
  const removeFeatureRow = (index: number) => setFeatures(features.filter((_, i) => i !== index));

  // Xử lý Specs
  const handleSpecChange = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
  };
  const addSpecRow = () => setSpecs([...specs, { key: '', value: '' }]);
  const removeSpecRow = (index: number) => setSpecs(specs.filter((_, i) => i !== index));

  // --- HÀM LƯU (UPDATE) ---
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);

    if (!formData.name || !formData.image) {
      alert("Vui lòng nhập tên và link ảnh!");
      setSaving(false);
      return;
    }

    const finalData = {
      ...formData,
      features: features.filter(f => f.trim() !== ''),
      specifications: specs.filter(s => s.key.trim() !== '' && s.value.trim() !== '')
    };

    const success = await doorService.updateProduct(id, finalData);
    setSaving(false);
    
    if (success) {
      alert("✅ Cập nhật thành công!");
      navigate('/admin/products');
    } else {
      alert("❌ Lỗi khi cập nhật!");
    }
  };

  if (loading) return <div className="p-20 text-center font-bold text-gray-500">⏳ Đang tải dữ liệu sản phẩm...</div>;

  return (
    <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100 mb-20">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-2xl font-bold text-blue-700">✏️ Chỉnh sửa sản phẩm</h1>
        <button onClick={() => navigate('/admin/products')} className="text-gray-500 hover:text-gray-700 font-medium">
          Quay lại danh sách
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CỘT TRÁI */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <h3 className="font-bold text-gray-800 border-l-4 border-blue-500 pl-3">A. Thông tin chung</h3>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Tên sản phẩm <span className="text-red-500">*</span></label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả ngắn</label>
              <textarea name="description" rows={3} value={formData.description} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none"></textarea>
            </div>
          </div>

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

          <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800">C. Thông số kỹ thuật</h3>
              <button type="button" onClick={addSpecRow} className="text-sm bg-white border border-gray-400 text-gray-700 px-3 py-1 rounded hover:bg-gray-200 font-medium">+ Thêm dòng</button>
            </div>
            <div className="space-y-3">
              <datalist id="brand-list-edit">{brandOptions.map((brand, idx) => <option key={idx} value={brand} />)}</datalist>
              {specs.map((spec, index) => (
                <div key={index} className="flex gap-3">
                  <input type="text" placeholder="Tên thông số" value={spec.key} onChange={(e) => handleSpecChange(index, 'key', e.target.value)} className="w-1/3 border border-gray-300 rounded px-3 py-2 text-sm outline-none font-medium bg-white" />
                  <input type="text" placeholder="Giá trị" value={spec.value} list={spec.key === 'Thương hiệu' ? "brand-list-edit" : undefined} onChange={(e) => handleSpecChange(index, 'value', e.target.value)} className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm outline-none bg-white focus:border-blue-500" />
                  <button type="button" onClick={() => removeSpecRow(index)} className="text-red-400 font-bold px-2">✕</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CỘT PHẢI */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm sticky top-6">
            <h3 className="font-bold text-gray-800 border-b pb-2 mb-4">Phân loại & Giá</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Loại sản phẩm</label>
              <div className="flex gap-2">
                <label className={`flex-1 flex items-center justify-center gap-2 cursor-pointer p-3 rounded-lg border ${formData.type === 'door' ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold' : 'border-gray-200 text-gray-500'}`}>
                  <input type="radio" name="type" value="door" checked={formData.type === 'door'} onChange={handleChange} className="hidden" /> 🚪 CỬA
                </label>
                <label className={`flex-1 flex items-center justify-center gap-2 cursor-pointer p-3 rounded-lg border ${formData.type === 'accessory' ? 'bg-purple-50 border-purple-500 text-purple-700 font-bold' : 'border-gray-200 text-gray-500'}`}>
                  <input type="radio" name="type" value="accessory" checked={formData.type === 'accessory'} onChange={handleChange} className="hidden" /> 🔧 PHỤ KIỆN
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">Danh mục hiển thị</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 outline-none bg-white">
                {categoryOptions.map((cat, idx) => (<option key={idx} value={cat}>{cat}</option>))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">Giá bán (VNĐ)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 outline-none font-bold text-gray-800 text-lg" />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Link hình ảnh</label>
              <input type="text" name="image" required value={formData.image} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 outline-none text-sm" />
              <div className="mt-3 aspect-[3/4] bg-gray-100 rounded border border-gray-300 flex items-center justify-center overflow-hidden relative">
                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x600?text=Lỗi+link'; }}/>
              </div>
            </div>

            <button type="submit" disabled={saving} className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50">
              {saving ? 'Đang lưu thay đổi...' : '💾 CẬP NHẬT'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductEdit;