import { useState, useEffect } from 'react';
import { doorService } from '../../services/doorService';

const Settings = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // State cho input nhập mới
  const [newCat, setNewCat] = useState("");
  const [newBrand, setNewBrand] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const data = await doorService.getSettings();
    if (data) {
      setCategories(data.categories || []);
      setBrands(data.brands || []);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const success = await doorService.saveSettings({ categories, brands });
    setSaving(false);
    if (success) alert("✅ Đã lưu cấu hình thành công!");
    else alert("❌ Lỗi khi lưu!");
  };

  // --- HÀM XỬ LÝ DANH MỤC ---
  const addCategory = () => {
    if (newCat.trim() && !categories.includes(newCat)) {
      setCategories([...categories, newCat.trim()]);
      setNewCat("");
    }
  };
  const removeCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  // --- HÀM XỬ LÝ THƯƠNG HIỆU ---
  const addBrand = () => {
    if (newBrand.trim() && !brands.includes(newBrand)) {
      setBrands([...brands, newBrand.trim()]);
      setNewBrand("");
    }
  };
  const removeBrand = (index: number) => {
    setBrands(brands.filter((_, i) => i !== index));
  };

  if (loading) return <div className="p-10">Đang tải cấu hình...</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Cấu hình hệ thống</h1>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-bold disabled:opacity-50"
        >
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* QUẢN LÝ DANH MỤC */}
        <div className="bg-gray-50 p-5 rounded-lg border">
          <h3 className="font-bold text-lg mb-4 text-blue-700">📂 Quản lý Danh mục</h3>
          <div className="flex gap-2 mb-4">
            <input 
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              placeholder="Nhập danh mục mới..."
              className="flex-1 border rounded px-3 py-2 outline-none"
              onKeyDown={(e) => e.key === 'Enter' && addCategory()}
            />
            <button onClick={addCategory} className="bg-blue-600 text-white px-3 py-2 rounded font-bold">+</button>
          </div>
          <ul className="space-y-2 max-h-60 overflow-y-auto">
            {categories.map((cat, idx) => (
              <li key={idx} className="flex justify-between items-center bg-white p-2 rounded shadow-sm border">
                <span>{cat}</span>
                <button onClick={() => removeCategory(idx)} className="text-red-500 hover:text-red-700 px-2">✕</button>
              </li>
            ))}
          </ul>
        </div>

        {/* QUẢN LÝ THƯƠNG HIỆU */}
        <div className="bg-gray-50 p-5 rounded-lg border">
          <h3 className="font-bold text-lg mb-4 text-purple-700">🏷️ Quản lý Thương hiệu</h3>
          <div className="flex gap-2 mb-4">
            <input 
              value={newBrand}
              onChange={(e) => setNewBrand(e.target.value)}
              placeholder="Nhập thương hiệu mới..."
              className="flex-1 border rounded px-3 py-2 outline-none"
              onKeyDown={(e) => e.key === 'Enter' && addBrand()}
            />
            <button onClick={addBrand} className="bg-purple-600 text-white px-3 py-2 rounded font-bold">+</button>
          </div>
          <ul className="space-y-2 max-h-60 overflow-y-auto">
            {brands.map((brand, idx) => (
              <li key={idx} className="flex justify-between items-center bg-white p-2 rounded shadow-sm border">
                <span>{brand}</span>
                <button onClick={() => removeBrand(idx)} className="text-red-500 hover:text-red-700 px-2">✕</button>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
};

export default Settings;