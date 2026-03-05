import { useState, useEffect } from 'react';
import { doorService } from '../../../../services/doorService';

const CategoryBrandSettings = () => {
  // --- TÁCH STATE THÀNH 2 LOẠI DANH MỤC ---
  const [doorCategories, setDoorCategories] = useState<string[]>([]);
  const [accessoryCategories, setAccessoryCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // State quản lý Tab hiển thị ('door' hoặc 'accessory')
  const [activeTab, setActiveTab] = useState<'door' | 'accessory'>('door');

  // TỰ ĐỘNG GỌI DATA TỪ CMS KHI LOAD COMPONENT
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      const settings = await doorService.getSettings(); // Đã trỏ thẳng vào cms trong service
      
      // Fallback: Nếu doorCategories chưa có, tạm lấy từ categories cũ để bảo toàn dữ liệu
      setDoorCategories(settings.doorCategories?.length ? settings.doorCategories : settings.categories || []);
      setAccessoryCategories(settings.accessoryCategories || []);
      setBrands(settings.brands || []);
      
      setLoading(false);
    };
    
    fetchSettings();
  }, []);

  // --- Xử lý mảng ---
  const handleAddItem = (type: 'door' | 'accessory' | 'brands') => {
    if (type === 'door') setDoorCategories([...doorCategories, '']);
    else if (type === 'accessory') setAccessoryCategories([...accessoryCategories, '']);
    else setBrands([...brands, '']);
  };

  const handleUpdateItem = (type: 'door' | 'accessory' | 'brands', index: number, value: string) => {
    if (type === 'door') {
      const newArr = [...doorCategories];
      newArr[index] = value;
      setDoorCategories(newArr);
    } else if (type === 'accessory') {
      const newArr = [...accessoryCategories];
      newArr[index] = value;
      setAccessoryCategories(newArr);
    } else {
      const newArr = [...brands];
      newArr[index] = value;
      setBrands(newArr);
    }
  };

  const handleDeleteItem = (type: 'door' | 'accessory' | 'brands', index: number) => {
    if (type === 'door') setDoorCategories(doorCategories.filter((_, i) => i !== index));
    else if (type === 'accessory') setAccessoryCategories(accessoryCategories.filter((_, i) => i !== index));
    else setBrands(brands.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    // Lọc bỏ các ô input rỗng
    const cleanDoorCats = doorCategories.filter(c => c.trim() !== '');
    const cleanAccCats = accessoryCategories.filter(c => c.trim() !== '');
    const cleanBrands = brands.filter(b => b.trim() !== '');
    
    // Tự động gộp lại thành mảng categories chung (Phòng hờ các component cũ đang gọi settings.categories ngoài Frontend chưa update)
    const combinedCategories = [...cleanDoorCats, ...cleanAccCats];

    // Cập nhật Database (Lưu thẳng vào CMS)
    await doorService.updateSettings({ 
      doorCategories: cleanDoorCats, 
      accessoryCategories: cleanAccCats,
      categories: combinedCategories, 
      brands: cleanBrands 
    });
    
    setDoorCategories(cleanDoorCats);
    setAccessoryCategories(cleanAccCats);
    setBrands(cleanBrands);
    setSaving(false);
    alert('✅ Đã lưu Danh mục & Thương hiệu vào CMS thành công!');
  };

  // Xác định mảng danh mục nào đang được hiển thị theo Tab
  const activeCategories = activeTab === 'door' ? doorCategories : accessoryCategories;

  if (loading) {
    return (
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8 text-center">
         <p className="text-gray-500 font-bold animate-pulse">⏳ Đang tải cấu hình phân loại từ hệ thống...</p>
      </section>
    );
  }

  return (
    <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
      <h3 className="text-xl font-bold dark:text-blue-400 mb-6">🏷️ 7. Quản lý Phân loại Sản phẩm</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* CỘT 1: DANH MỤC (CÓ TAB) */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold dark:text-white">A. Danh mục sản phẩm</h4>
            <button onClick={() => handleAddItem(activeTab)} className="text-sm text-blue-600 dark:text-blue-400 font-bold hover:underline">
              + Thêm danh mục
            </button>
          </div>

          {/* CHUYỂN TAB */}
          <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg mb-4">
            <button 
              onClick={() => setActiveTab('door')}
              className={`flex-1 py-1.5 text-sm font-bold rounded-md transition-colors ${activeTab === 'door' ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
            >
              🚪 Cửa
            </button>
            <button 
              onClick={() => setActiveTab('accessory')}
              className={`flex-1 py-1.5 text-sm font-bold rounded-md transition-colors ${activeTab === 'accessory' ? 'bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
            >
              🔧 Phụ kiện
            </button>
          </div>

          {/* LIST DANH MỤC THEO TAB ĐANG CHỌN */}
          <div className="space-y-2">
            {activeCategories.map((cat, idx) => (
              <div key={idx} className="flex gap-2">
                <input 
                  type="text" 
                  value={cat} 
                  placeholder={activeTab === 'door' ? "VD: Cửa Nhựa Composite" : "VD: Bản lề, Khóa từ"}
                  onChange={e => handleUpdateItem(activeTab, idx, e.target.value)} 
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium" 
                />
                <button onClick={() => handleDeleteItem(activeTab, idx)} className="text-red-500 hover:text-red-700 font-bold px-2">✕</button>
              </div>
            ))}
            {activeCategories.length === 0 && <p className="text-sm text-gray-400 italic text-center py-2">Chưa có danh mục nào.</p>}
          </div>
        </div>

        {/* CỘT 2: THƯƠNG HIỆU */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold dark:text-white">B. Thương hiệu (Brands)</h4>
            <button onClick={() => handleAddItem('brands')} className="text-sm text-blue-600 dark:text-blue-400 font-bold hover:underline">
              + Thêm thương hiệu
            </button>
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
             {brands.length === 0 && <p className="text-sm text-gray-400 italic text-center py-2">Chưa có thương hiệu nào.</p>}
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