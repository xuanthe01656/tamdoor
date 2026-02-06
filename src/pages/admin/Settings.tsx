import { useState, useEffect } from 'react';
import { doorService } from '../../services/doorService';
import { WebsiteInfo } from '../../interfaces/door'; // Nhớ import interface này

const Settings = () => {
  // --- STATE CHUNG ---
  const [activeTab, setActiveTab] = useState<'info' | 'product'>('info'); // Tab đang chọn
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // --- STATE TAB 1: THÔNG TIN WEBSITE (Mới) ---
  const [info, setInfo] = useState<WebsiteInfo>({
    companyName: '', address: '', phone: '', email: '', 
    taxId: '', zalo: '', facebook: '', mapIframe: ''
  });

  // --- STATE TAB 2: DANH MỤC & THƯƠNG HIỆU (Cũ) ---
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [newCat, setNewCat] = useState("");
  const [newBrand, setNewBrand] = useState("");

  // --- LOAD DỮ LIỆU ---
  useEffect(() => {
    const loadData = async () => {
      const settings = await doorService.getSettings();
      if (settings) {
        // Load Categories & Brands
        setCategories(settings.categories || []);
        setBrands(settings.brands || []);
        
        // Load Website Info
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
    // Gọi hàm lưu riêng cho Info (như đã update trong doorService)
    const success = await doorService.saveWebsiteInfo(info);
    setSaving(false);
    if (success) alert("✅ Đã cập nhật thông tin Website!");
    else alert("❌ Lỗi khi lưu thông tin!");
  };

  // --- HÀM XỬ LÝ TAB PRODUCT (Giữ nguyên logic cũ) ---
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


  if (loading) return <div className="p-10 text-center text-gray-500">⏳ Đang tải cấu hình...</div>;

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100 mb-20">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">⚙️ Cấu hình hệ thống</h1>

      {/* --- THANH TAB NAVIGATION --- */}
      <div className="flex border-b mb-6">
        <button 
          onClick={() => setActiveTab('info')}
          className={`px-6 py-3 font-bold text-sm transition-colors ${activeTab==='info' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
        >
          🏢 THÔNG TIN CHUNG (FOOTER)
        </button>
        <button 
          onClick={() => setActiveTab('product')}
          className={`px-6 py-3 font-bold text-sm transition-colors ${activeTab==='product' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
        >
          📦 DANH MỤC & THƯƠNG HIỆU
        </button>
      </div>

      {/* --- NỘI DUNG TAB 1: THÔNG TIN WEBSITE --- */}
      {activeTab === 'info' && (
        <div className="animate-fade-in space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Tên công ty / Cửa hàng</label>
              <input type="text" name="companyName" value={info.companyName} onChange={handleInfoChange} className="w-full border border-gray-300 p-3 rounded-lg focus:border-blue-500 outline-none" placeholder="VD: Công Ty TNHH MTV Casar Door"/>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Hotline / SĐT</label>
              <input type="text" name="phone" value={info.phone} onChange={handleInfoChange} className="w-full border border-gray-300 p-3 rounded-lg" placeholder="0909..."/>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Zalo</label>
              <input type="text" name="zalo" value={info.zalo} onChange={handleInfoChange} className="w-full border border-gray-300 p-3 rounded-lg" placeholder="0909..."/>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Mã số thuế (MST)</label>
              <input type="text" name="taxId" value={info.taxId} onChange={handleInfoChange} className="w-full border border-gray-300 p-3 rounded-lg" placeholder="Nhập MST..."/>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
              <input type="text" name="email" value={info.email} onChange={handleInfoChange} className="w-full border border-gray-300 p-3 rounded-lg" placeholder="admin@example.com"/>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Địa chỉ hiển thị</label>
              <input type="text" name="address" value={info.address} onChange={handleInfoChange} className="w-full border border-gray-300 p-3 rounded-lg" placeholder="Số 123, Đường ABC..."/>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Facebook Fanpage (Link)</label>
              <input type="text" name="facebook" value={info.facebook} onChange={handleInfoChange} className="w-full border border-gray-300 p-3 rounded-lg" placeholder="https://facebook.com/..."/>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Mã nhúng bản đồ (Google Map Iframe)</label>
              <textarea name="mapIframe" rows={3} value={info.mapIframe} onChange={handleInfoChange} className="w-full border border-gray-300 p-3 rounded-lg text-xs font-mono" placeholder='<iframe src="http://googleusercontent.com/maps..." ... ></iframe>'></textarea>
              <p className="text-xs text-gray-400 mt-1 italic">* Vào Google Maps -&gt; Chia sẻ -&gt; Nhúng bản đồ -&gt; Copy mã HTML dán vào đây.</p>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <button onClick={saveInfo} disabled={saving} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50">
                {saving ? 'Đang lưu...' : '💾 LƯU THÔNG TIN'}
            </button>
          </div>
        </div>
      )}

      {/* --- NỘI DUNG TAB 2: DANH MỤC & THƯƠNG HIỆU (Code cũ của bạn) --- */}
      {activeTab === 'product' && (
        <div className="animate-fade-in">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                {/* QUẢN LÝ DANH MỤC */}
                <div className="bg-gray-50 p-5 rounded-lg border">
                  <h3 className="font-bold text-lg mb-4 text-blue-700">📂 Quản lý Danh mục</h3>
                  <div className="flex gap-2 mb-4">
                    <input 
                      value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder="Nhập danh mục mới..."
                      className="flex-1 border rounded px-3 py-2 outline-none" onKeyDown={(e) => e.key === 'Enter' && addCategory()}
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
                      value={newBrand} onChange={(e) => setNewBrand(e.target.value)} placeholder="Nhập thương hiệu mới..."
                      className="flex-1 border rounded px-3 py-2 outline-none" onKeyDown={(e) => e.key === 'Enter' && addBrand()}
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

            <div className="flex justify-end pt-4 border-t">
                <button onClick={saveProductSettings} disabled={saving} className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-bold disabled:opacity-50 shadow-lg shadow-green-200">
                  {saving ? "Đang lưu..." : "💾 LƯU DANH MỤC & THƯƠNG HIỆU"}
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default Settings;