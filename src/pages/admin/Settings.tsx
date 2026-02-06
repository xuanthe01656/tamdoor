import { useState, useEffect } from 'react';
import { doorService } from '../../services/doorService';
import { WebsiteInfo } from '../../interfaces/door';

const Settings = () => {
  // --- STATE CHUNG ---
  const [activeTab, setActiveTab] = useState<'info' | 'product'>('info'); // Tab đang chọn
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // --- STATE TAB 1: THÔNG TIN WEBSITE ---
  const [info, setInfo] = useState<WebsiteInfo>({
    companyName: '', address: '', phone: '', email: '', 
    taxId: '', zalo: '', facebook: '', mapIframe: ''
  });

  // --- STATE TAB 2: DANH MỤC & THƯƠNG HIỆU ---
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [newCat, setNewCat] = useState("");
  const [newBrand, setNewBrand] = useState("");

  // --- LOAD DỮ LIỆU ---
  useEffect(() => {
    const loadData = async () => {
      const settings = await doorService.getSettings();
      if (settings) {
        setCategories(settings.categories || []);
        setBrands(settings.brands || []);
        if (settings.websiteInfo) {
            setInfo(settings.websiteInfo);
        }
      }
      setLoading(false);
    };
    loadData();
  }, []);

  // --- HÀM XỬ LÝ TAB INFO ---
  const handleInfoChange = (e: any) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  const saveInfo = async () => {
    setSaving(true);
    const success = await doorService.saveWebsiteInfo(info);
    setSaving(false);
    if (success) alert("✅ Đã cập nhật thông tin Website!");
    else alert("❌ Lỗi khi lưu thông tin!");
  };

  // --- HÀM XỬ LÝ TAB PRODUCT ---
  const saveProductSettings = async () => {
    setSaving(true);
    const success = await doorService.saveSettings({ categories, brands });
    setSaving(false);
    if (success) alert("✅ Đã lưu danh mục & thương hiệu!");
    else alert("❌ Lỗi khi lưu!");
  };

  const addCategory = () => {
    if (newCat.trim() && !categories.includes(newCat)) {
      setCategories([...categories, newCat.trim()]);
      setNewCat("");
    }
  };
  const removeCategory = (index: number) => setCategories(categories.filter((_, i) => i !== index));

  const addBrand = () => {
    if (newBrand.trim() && !brands.includes(newBrand)) {
      setBrands([...brands, newBrand.trim()]);
      setNewBrand("");
    }
  };
  const removeBrand = (index: number) => setBrands(brands.filter((_, i) => i !== index));


  if (loading) return <div className="p-10 text-center text-gray-500 dark:text-gray-400">⏳ Đang tải cấu hình...</div>;

  return (
    // DARK MODE: bg-gray-800 border-gray-700
    <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 mb-20 transition-colors duration-300">
      {/* DARK MODE: text-white */}
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">⚙️ Cấu hình hệ thống</h1>

      {/* --- THANH TAB NAVIGATION --- */}
      <div className="flex border-b dark:border-gray-700 mb-6">
        <button 
          onClick={() => setActiveTab('info')}
          // DARK MODE: text-blue-400 border-blue-400 hover:text-blue-300
          className={`px-6 py-3 font-bold text-sm transition-colors 
            ${activeTab==='info' 
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' 
                : 'text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-300'}`}
        >
          🏢 THÔNG TIN CHUNG (FOOTER)
        </button>
        <button 
          onClick={() => setActiveTab('product')}
          className={`px-6 py-3 font-bold text-sm transition-colors 
            ${activeTab==='product' 
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' 
                : 'text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-300'}`}
        >
          📦 DANH MỤC & THƯƠNG HIỆU
        </button>
      </div>

      {/* --- NỘI DUNG TAB 1: THÔNG TIN WEBSITE --- */}
      {activeTab === 'info' && (
        <div className="animate-fade-in space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* INPUT FIELDS: dark:bg-gray-700 dark:border-gray-600 dark:text-white */}
            <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Tên công ty / Cửa hàng</label>
              <input type="text" name="companyName" value={info.companyName} onChange={handleInfoChange} className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white" placeholder="VD: Công Ty TNHH MTV Casar Door"/>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Hotline / SĐT</label>
              <input type="text" name="phone" value={info.phone} onChange={handleInfoChange} className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg dark:bg-gray-700 dark:text-white" placeholder="0909..."/>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Zalo</label>
              <input type="text" name="zalo" value={info.zalo} onChange={handleInfoChange} className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg dark:bg-gray-700 dark:text-white" placeholder="0909..."/>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Mã số thuế (MST)</label>
              <input type="text" name="taxId" value={info.taxId} onChange={handleInfoChange} className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg dark:bg-gray-700 dark:text-white" placeholder="Nhập MST..."/>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <input type="text" name="email" value={info.email} onChange={handleInfoChange} className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg dark:bg-gray-700 dark:text-white" placeholder="admin@example.com"/>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Địa chỉ hiển thị</label>
              <input type="text" name="address" value={info.address} onChange={handleInfoChange} className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg dark:bg-gray-700 dark:text-white" placeholder="Số 123, Đường ABC..."/>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Facebook Fanpage (Link)</label>
              <input type="text" name="facebook" value={info.facebook} onChange={handleInfoChange} className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg dark:bg-gray-700 dark:text-white" placeholder="https://facebook.com/..."/>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Mã nhúng bản đồ (Google Map Iframe)</label>
              <textarea name="mapIframe" rows={3} value={info.mapIframe} onChange={handleInfoChange} className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg text-xs font-mono dark:bg-gray-700 dark:text-white" placeholder='<iframe src="http://googleusercontent.com/maps..." ... ></iframe>'></textarea>
              <p className="text-xs text-gray-400 mt-1 italic">* Vào Google Maps -&gt; Chia sẻ -&gt; Nhúng bản đồ -&gt; Copy mã HTML dán vào đây.</p>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t dark:border-gray-700">
            <button onClick={saveInfo} disabled={saving} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none disabled:opacity-50">
                {saving ? 'Đang lưu...' : '💾 LƯU THÔNG TIN'}
            </button>
          </div>
        </div>
      )}

      {/* --- NỘI DUNG TAB 2: DANH MỤC & THƯƠNG HIỆU --- */}
      {activeTab === 'product' && (
        <div className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                {/* QUẢN LÝ DANH MỤC: dark:bg-gray-700/30 dark:border-gray-600 */}
                <div className="bg-gray-50 dark:bg-gray-700/30 p-5 rounded-lg border border-gray-200 dark:border-gray-600">
                  <h3 className="font-bold text-lg mb-4 text-blue-700 dark:text-blue-400">📂 Quản lý Danh mục</h3>
                  <div className="flex gap-2 mb-4">
                    <input 
                      value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder="Nhập danh mục mới..."
                      className="flex-1 border dark:border-gray-500 rounded px-3 py-2 outline-none dark:bg-gray-800 dark:text-white" onKeyDown={(e) => e.key === 'Enter' && addCategory()}
                    />
                    <button onClick={addCategory} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded font-bold transition-colors">+</button>
                  </div>
                  <ul className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                    {categories.map((cat, idx) => (
                      // ITEM: dark:bg-gray-800 dark:border-gray-600
                      <li key={idx} className="flex justify-between items-center bg-white dark:bg-gray-800 p-2 rounded shadow-sm border border-gray-100 dark:border-gray-600">
                        <span className="dark:text-gray-200">{cat}</span>
                        <button onClick={() => removeCategory(idx)} className="text-red-500 hover:text-red-700 dark:hover:text-red-400 px-2 transition-colors">✕</button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* QUẢN LÝ THƯƠNG HIỆU: dark:bg-gray-700/30 dark:border-gray-600 */}
                <div className="bg-gray-50 dark:bg-gray-700/30 p-5 rounded-lg border border-gray-200 dark:border-gray-600">
                  <h3 className="font-bold text-lg mb-4 text-purple-700 dark:text-purple-400">🏷️ Quản lý Thương hiệu</h3>
                  <div className="flex gap-2 mb-4">
                    <input 
                      value={newBrand} onChange={(e) => setNewBrand(e.target.value)} placeholder="Nhập thương hiệu mới..."
                      className="flex-1 border dark:border-gray-500 rounded px-3 py-2 outline-none dark:bg-gray-800 dark:text-white" onKeyDown={(e) => e.key === 'Enter' && addBrand()}
                    />
                    <button onClick={addBrand} className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded font-bold transition-colors">+</button>
                  </div>
                  <ul className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                    {brands.map((brand, idx) => (
                      <li key={idx} className="flex justify-between items-center bg-white dark:bg-gray-800 p-2 rounded shadow-sm border border-gray-100 dark:border-gray-600">
                        <span className="dark:text-gray-200">{brand}</span>
                        <button onClick={() => removeBrand(idx)} className="text-red-500 hover:text-red-700 dark:hover:text-red-400 px-2 transition-colors">✕</button>
                      </li>
                    ))}
                  </ul>
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t dark:border-gray-700">
                <button onClick={saveProductSettings} disabled={saving} className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-bold disabled:opacity-50 shadow-lg shadow-green-200 dark:shadow-none transition-all">
                  {saving ? "Đang lưu..." : "💾 LƯU DANH MỤC & THƯƠNG HIỆU"}
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default Settings;