import { useState, useEffect } from 'react';
import { doorService } from '../../../../services/doorService';

interface Props {
  initialCategories: string[];
  initialBrands: string[];
}

const CategoryBrandSettings = ({ initialCategories, initialBrands }: Props) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialCategories) setCategories(initialCategories);
    if (initialBrands) setBrands(initialBrands);
  }, [initialCategories, initialBrands]);

  // --- Xử lý mảng string chung ---
  const handleAddItem = (type: 'categories' | 'brands') => {
    if (type === 'categories') setCategories([...categories, '']);
    else setBrands([...brands, '']);
  };

  const handleUpdateItem = (type: 'categories' | 'brands', index: number, value: string) => {
    if (type === 'categories') {
      const newArr = [...categories];
      newArr[index] = value;
      setCategories(newArr);
    } else {
      const newArr = [...brands];
      newArr[index] = value;
      setBrands(newArr);
    }
  };

  const handleDeleteItem = (type: 'categories' | 'brands', index: number) => {
    if (type === 'categories') setCategories(categories.filter((_, i) => i !== index));
    else setBrands(brands.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    // Lưu các mảng rỗng bị bỏ qua (filter những dòng user tạo nhưng không gõ chữ)
    const cleanCategories = categories.filter(c => c.trim() !== '');
    const cleanBrands = brands.filter(b => b.trim() !== '');
    
    await doorService.updateSettings({ categories: cleanCategories, brands: cleanBrands });
    setCategories(cleanCategories);
    setBrands(cleanBrands);
    setSaving(false);
    alert('✅ Đã lưu Danh mục & Thương hiệu!');
  };

  return (
    <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
      <h3 className="text-xl font-bold dark:text-blue-400 mb-6">🏷️ 7. Quản lý Phân loại Sản phẩm</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* CỘT 1: DANH MỤC */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-bold dark:text-white">A. Danh mục sản phẩm (Categories)</h4>
            <button onClick={() => handleAddItem('categories')} className="text-sm text-blue-600 dark:text-blue-400 font-bold">+ Thêm danh mục</button>
          </div>
          <div className="space-y-2">
            {categories.map((cat, idx) => (
              <div key={idx} className="flex gap-2">
                <input 
                  type="text" 
                  value={cat} 
                  placeholder="VD: Cửa Nhựa Composite"
                  onChange={e => handleUpdateItem('categories', idx, e.target.value)} 
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium" 
                />
                <button onClick={() => handleDeleteItem('categories', idx)} className="text-red-500 hover:text-red-700 font-bold px-2">✕</button>
              </div>
            ))}
            {categories.length === 0 && <p className="text-sm text-gray-400 italic">Chưa có danh mục nào.</p>}
          </div>
        </div>

        {/* CỘT 2: THƯƠNG HIỆU */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-bold dark:text-white">B. Thương hiệu (Brands)</h4>
            <button onClick={() => handleAddItem('brands')} className="text-sm text-blue-600 dark:text-blue-400 font-bold">+ Thêm thương hiệu</button>
          </div>
          <div className="space-y-2">
            {brands.map((brand, idx) => (
              <div key={idx} className="flex gap-2">
                <input 
                  type="text" 
                  value={brand} 
                  placeholder="VD: CasarDoor, KOS..."
                  onChange={e => handleUpdateItem('brands', idx, e.target.value)} 
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium" 
                />
                <button onClick={() => handleDeleteItem('brands', idx)} className="text-red-500 hover:text-red-700 font-bold px-2">✕</button>
              </div>
            ))}
             {brands.length === 0 && <p className="text-sm text-gray-400 italic">Chưa có thương hiệu nào.</p>}
          </div>
        </div>
      </div>

      <div className="mt-6 text-right border-t border-gray-200 dark:border-gray-700 pt-4">
        <button onClick={handleSave} disabled={saving} className="bg-blue-600 text-white px-8 py-2.5 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition shadow-lg">
          {saving ? '⏳ Đang lưu...' : '💾 Lưu Phân loại'}
        </button>
      </div>
    </section>
  );
};

export default CategoryBrandSettings;