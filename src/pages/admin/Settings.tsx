import { useState, useEffect } from 'react';
import { doorService } from '../../services/doorService';
import { WebsiteInfo, HeroSlide, USP, Project, FAQ, ProcessStep, WarrantyPolicy } from '../../interfaces/door';

// --- MOCK DATA (Dữ liệu mẫu để khởi tạo nếu DB trống) ---
const DEFAULT_SLIDES: HeroSlide[] = [
  { id: '1', title: 'CASAR LUXURY', subtitle: 'CỬA COMPOSITE', description: 'Mô tả mẫu...', image: '', cta: 'Xem ngay', link: '/san-pham' }
];
const DEFAULT_USPS: USP[] = [
  { id: '1', icon: '🛡️', title: 'Chống nước', desc: 'Kháng nước tuyệt đối 100%' }
];
const DEFAULT_PROJECTS: Project[] = [
  { id: '1', title: 'Biệt thự Vinhome', image: '' }
];
const DEFAULT_FAQS: FAQ[] = [
  { id: '1', q: 'Cửa có bền không?', a: 'Rất bền, bảo hành 5 năm.' }
];
const DEFAULT_PROCESS: ProcessStep[] = [
  { id: '1', step: '01', title: 'Tiếp nhận', desc: 'Tư vấn và báo giá' }
];
const DEFAULT_WARRANTY: WarrantyPolicy = {
    periods: [{ product: "Cửa Composite", time: "05 Năm", scope: "Cong vênh, mối mọt" }],
    conditions: ["Tem bảo hành còn nguyên vẹn."],
    refusals: ["Hư hỏng do tác động vật lý."]
};

const Settings = () => {
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // --- STATE DỮ LIỆU ---
  // 1. Info & Product
  const [info, setInfo] = useState<WebsiteInfo>({ companyName: '', address: '', phone: '', email: '', taxId: '', zalo: '', facebook: '', mapIframe: '' });
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  
  // 2. CMS Content
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [usps, setUsps] = useState<USP[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [process, setProcess] = useState<ProcessStep[]>([]);
  const [warranty, setWarranty] = useState<WarrantyPolicy>(DEFAULT_WARRANTY);

  // State tạm cho input thêm mới danh mục
  const [newCat, setNewCat] = useState("");
  const [newBrand, setNewBrand] = useState("");

  // --- LOAD DỮ LIỆU ---
  useEffect(() => {
    const loadData = async () => {
      const settings = await doorService.getSettings();
      if (settings) {
        if (settings.websiteInfo) setInfo(settings.websiteInfo);
        setCategories(settings.categories || []);
        setBrands(settings.brands || []);
        
        // Load CMS Data (Nếu có thì lấy, không thì lấy Default)
        setSlides(settings.heroSlides || DEFAULT_SLIDES);
        setUsps(settings.usps || DEFAULT_USPS);
        setProjects(settings.projects || DEFAULT_PROJECTS);
        setFaqs(settings.faqs || DEFAULT_FAQS);
        setProcess(settings.process || DEFAULT_PROCESS);
        if (settings.warranty) setWarranty(settings.warranty);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  // --- HÀM LƯU CHUNG ---
  const handleSave = async (key: string, data: any) => {
    setSaving(true);
    let success = false;
    
    // Lưu ý: Cần đảm bảo doorService đã có các hàm này (saveSlides, saveUSPs...)
    // Nếu chưa có, bạn dùng hàm saveSettings({ [key]: data }) cũng được.
    if (key === 'info') success = await doorService.saveWebsiteInfo(data);
    else if (key === 'product') success = await doorService.saveSettings({ categories, brands });
    else if (key === 'slides') success = await doorService.saveSlides(data);
    else if (key === 'usps') success = await doorService.saveUSPs(data);
    else if (key === 'projects') success = await doorService.saveProjects(data);
    else if (key === 'faqs') success = await doorService.saveFAQs(data);
    else if (key === 'process') success = await doorService.saveProcess(data);
    else if (key === 'warranty') success = await doorService.saveWarranty(data);

    setSaving(false);
    if (success) alert("✅ Đã lưu thành công!");
    else alert("❌ Lỗi khi lưu!");
  };

  // --- HELPER FUNCTIONS (CRUD Mảng Object) ---
  const updateItem = (setter: any, list: any[], index: number, field: string, value: any) => {
    const newList = [...list];
    newList[index] = { ...newList[index], [field]: value };
    setter(newList);
  };
  
  const addItem = (setter: any, list: any[], emptyItem: any) => {
    setter([...list, { ...emptyItem, id: Date.now().toString() }]);
  };

  const removeItem = (setter: any, list: any[], index: number) => {
    if(window.confirm("Bạn có chắc muốn xóa dòng này?")) {
        setter(list.filter((_, i) => i !== index));
    }
  };

  // Helper cho Danh mục/Thương hiệu (Mảng String đơn giản)
  const addSimpleItem = (state: string[], setter: any, value: string, setValue: any) => {
      if (value.trim() && !state.includes(value)) {
          setter([...state, value.trim()]);
          setValue("");
      }
  };
  const removeSimpleItem = (state: string[], setter: any, index: number) => {
      setter(state.filter((_, i) => i !== index));
  };

  // Helper cho Warranty (Mảng String trong Object)
  const updateWarrantyArray = (field: 'conditions' | 'refusals', index: number, value: string) => {
      const newList = [...warranty[field]];
      newList[index] = value;
      setWarranty({ ...warranty, [field]: newList });
  };
  const addWarrantyArray = (field: 'conditions' | 'refusals') => {
      setWarranty({ ...warranty, [field]: [...warranty[field], ""] });
  };
  const removeWarrantyArray = (field: 'conditions' | 'refusals', index: number) => {
      setWarranty({ ...warranty, [field]: warranty[field].filter((_, i) => i !== index) });
  };

  if (loading) return <div className="p-10 text-center dark:text-gray-400">⏳ Đang tải...</div>;

  return (
    <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 mb-20 transition-colors duration-300">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">⚙️ Quản trị nội dung (CMS)</h1>

      {/* TABS HEADER */}
      <div className="flex overflow-x-auto border-b dark:border-gray-700 mb-6 gap-2 pb-2 custom-scrollbar">
         {[
            {id: 'info', label: '🏢 Thông tin chung'},
            {id: 'product', label: '📦 Danh mục & Hãng'},
            {id: 'slides', label: '🖼️ Banner Slider'},
            {id: 'usps', label: '🛡️ Lý do chọn'},
            {id: 'projects', label: '🏗️ Dự án'},
            {id: 'faqs', label: '❓ FAQs'},
            {id: 'process', label: '🔄 Quy trình'},
            {id: 'warranty', label: '💎 Bảo hành'}
         ].map(tab => (
            <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 whitespace-nowrap rounded-t-lg font-bold text-sm transition-colors border-b-2 
                    ${activeTab === tab.id 
                        ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            >
                {tab.label}
            </button>
         ))}
      </div>

      {/* --- 1. INFO TAB --- */}
      {activeTab === 'info' && (
         <div className="space-y-6 animate-fade-in">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="col-span-2">
                     <label className="block text-sm font-bold mb-1 dark:text-gray-300">Tên công ty</label>
                     <input value={info.companyName} onChange={e => setInfo({...info, companyName: e.target.value})} className="w-full border dark:border-gray-600 p-3 rounded dark:bg-gray-700 dark:text-white"/>
                 </div>
                 <div>
                     <label className="block text-sm font-bold mb-1 dark:text-gray-300">Hotline</label>
                     <input value={info.phone} onChange={e => setInfo({...info, phone: e.target.value})} className="w-full border dark:border-gray-600 p-3 rounded dark:bg-gray-700 dark:text-white"/>
                 </div>
                 <div>
                     <label className="block text-sm font-bold mb-1 dark:text-gray-300">Zalo</label>
                     <input value={info.zalo} onChange={e => setInfo({...info, zalo: e.target.value})} className="w-full border dark:border-gray-600 p-3 rounded dark:bg-gray-700 dark:text-white"/>
                 </div>
                 <div>
                     <label className="block text-sm font-bold mb-1 dark:text-gray-300">Email</label>
                     <input value={info.email} onChange={e => setInfo({...info, email: e.target.value})} className="w-full border dark:border-gray-600 p-3 rounded dark:bg-gray-700 dark:text-white"/>
                 </div>
                 <div>
                     <label className="block text-sm font-bold mb-1 dark:text-gray-300">Facebook Link</label>
                     <input value={info.facebook} onChange={e => setInfo({...info, facebook: e.target.value})} className="w-full border dark:border-gray-600 p-3 rounded dark:bg-gray-700 dark:text-white"/>
                 </div>
                 <div className="col-span-2">
                     <label className="block text-sm font-bold mb-1 dark:text-gray-300">Địa chỉ</label>
                     <input value={info.address} onChange={e => setInfo({...info, address: e.target.value})} className="w-full border dark:border-gray-600 p-3 rounded dark:bg-gray-700 dark:text-white"/>
                 </div>
                 <div className="col-span-2">
                     <label className="block text-sm font-bold mb-1 dark:text-gray-300">Google Map Iframe</label>
                     <textarea rows={3} value={info.mapIframe} onChange={e => setInfo({...info, mapIframe: e.target.value})} className="w-full border dark:border-gray-600 p-3 rounded dark:bg-gray-700 dark:text-white font-mono text-xs"/>
                 </div>
             </div>
             <button onClick={() => handleSave('info', info)} disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 w-full md:w-auto">Lưu Thông Tin</button>
         </div>
      )}

      {/* --- 2. PRODUCT SETTINGS TAB --- */}
      {activeTab === 'product' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
             {/* Danh mục */}
             <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded border dark:border-gray-600">
                <h3 className="font-bold mb-3 dark:text-blue-300">📂 Quản lý Danh mục</h3>
                <div className="flex gap-2 mb-3">
                    <input value={newCat} onChange={e => setNewCat(e.target.value)} className="flex-1 border dark:border-gray-500 rounded px-2 py-1 dark:bg-gray-800 dark:text-white" placeholder="Thêm mới..."/>
                    <button onClick={() => addSimpleItem(categories, setCategories, newCat, setNewCat)} className="bg-blue-600 text-white px-3 rounded font-bold">+</button>
                </div>
                <ul className="space-y-2 max-h-60 overflow-y-auto">
                    {categories.map((c, i) => (
                        <li key={i} className="flex justify-between bg-white dark:bg-gray-800 p-2 rounded border dark:border-gray-600">
                            <span className="dark:text-gray-200">{c}</span>
                            <button onClick={() => removeSimpleItem(categories, setCategories, i)} className="text-red-500">✕</button>
                        </li>
                    ))}
                </ul>
             </div>

             {/* Thương hiệu */}
             <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded border dark:border-gray-600">
                <h3 className="font-bold mb-3 dark:text-purple-300">🏷️ Quản lý Thương hiệu</h3>
                <div className="flex gap-2 mb-3">
                    <input value={newBrand} onChange={e => setNewBrand(e.target.value)} className="flex-1 border dark:border-gray-500 rounded px-2 py-1 dark:bg-gray-800 dark:text-white" placeholder="Thêm mới..."/>
                    <button onClick={() => addSimpleItem(brands, setBrands, newBrand, setNewBrand)} className="bg-purple-600 text-white px-3 rounded font-bold">+</button>
                </div>
                <ul className="space-y-2 max-h-60 overflow-y-auto">
                    {brands.map((b, i) => (
                        <li key={i} className="flex justify-between bg-white dark:bg-gray-800 p-2 rounded border dark:border-gray-600">
                            <span className="dark:text-gray-200">{b}</span>
                            <button onClick={() => removeSimpleItem(brands, setBrands, i)} className="text-red-500">✕</button>
                        </li>
                    ))}
                </ul>
             </div>
             <div className="md:col-span-2 text-right">
                <button onClick={() => handleSave('product', {categories, brands})} disabled={saving} className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700">Lưu Danh mục & Hãng</button>
             </div>
        </div>
      )}

      {/* --- 3. SLIDES TAB --- */}
      {activeTab === 'slides' && (
        <div className="space-y-6 animate-fade-in">
            {slides.map((slide, idx) => (
                <div key={slide.id} className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded border dark:border-gray-600 relative group">
                    <button onClick={() => removeItem(setSlides, slides, idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold z-10">✕ Xóa</button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold mb-1 dark:text-gray-300">Tiêu đề lớn</label>
                            <input value={slide.title} onChange={e => updateItem(setSlides, slides, idx, 'title', e.target.value)} className="w-full border dark:border-gray-500 p-2 rounded text-sm dark:bg-gray-800 dark:text-white"/>
                        </div>
                        <div>
                            <label className="block text-xs font-bold mb-1 dark:text-gray-300">Tiêu đề phụ</label>
                            <input value={slide.subtitle} onChange={e => updateItem(setSlides, slides, idx, 'subtitle', e.target.value)} className="w-full border dark:border-gray-500 p-2 rounded text-sm dark:bg-gray-800 dark:text-white"/>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold mb-1 dark:text-gray-300">Mô tả</label>
                            <textarea rows={2} value={slide.description} onChange={e => updateItem(setSlides, slides, idx, 'description', e.target.value)} className="w-full border dark:border-gray-500 p-2 rounded text-sm dark:bg-gray-800 dark:text-white"></textarea>
                        </div>
                        <div>
                            <label className="block text-xs font-bold mb-1 dark:text-gray-300">Link ảnh (URL)</label>
                            <input value={slide.image} onChange={e => updateItem(setSlides, slides, idx, 'image', e.target.value)} className="w-full border dark:border-gray-500 p-2 rounded text-sm dark:bg-gray-800 dark:text-white"/>
                        </div>
                        <div>
                            <label className="block text-xs font-bold mb-1 dark:text-gray-300">Nút bấm (CTA)</label>
                            <div className="flex gap-2">
                                <input value={slide.cta} onChange={e => updateItem(setSlides, slides, idx, 'cta', e.target.value)} className="w-1/2 border dark:border-gray-500 p-2 rounded text-sm dark:bg-gray-800 dark:text-white" placeholder="Tên nút"/>
                                <input value={slide.link} onChange={e => updateItem(setSlides, slides, idx, 'link', e.target.value)} className="w-1/2 border dark:border-gray-500 p-2 rounded text-sm dark:bg-gray-800 dark:text-white" placeholder="Link đến..."/>
                            </div>
                        </div>
                    </div>
                    {slide.image && <img src={slide.image} alt="Preview" className="h-20 w-auto mt-2 rounded object-cover border dark:border-gray-600"/>}
                </div>
            ))}
            <button onClick={() => addItem(setSlides, slides, { title: 'Tiêu đề', subtitle: '', description: '', image: '', cta: 'Xem ngay', link: '/' })} className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 rounded hover:bg-gray-50 dark:hover:bg-gray-700 font-bold">+ Thêm Slide</button>
            <div className="text-right pt-4 border-t dark:border-gray-700">
                <button onClick={() => handleSave('slides', slides)} disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded font-bold">Lưu Slide</button>
            </div>
        </div>
      )}

      {/* 4. USP TAB */}
      {activeTab === 'usps' && (
         <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {usps.map((u, idx) => (
                    <div key={u.id} className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded border dark:border-gray-600 relative">
                        <button onClick={() => removeItem(setUsps, usps, idx)} className="absolute top-2 right-2 text-red-500 font-bold">✕</button>
                        <div className="flex gap-2 mb-2">
                            <input value={u.icon} onChange={e => updateItem(setUsps, usps, idx, 'icon', e.target.value)} className="w-12 text-center border dark:border-gray-500 p-2 rounded dark:bg-gray-800 dark:text-white" placeholder="Icon"/>
                            <input value={u.title} onChange={e => updateItem(setUsps, usps, idx, 'title', e.target.value)} className="flex-1 border dark:border-gray-500 p-2 rounded font-bold dark:bg-gray-800 dark:text-white" placeholder="Tiêu đề"/>
                        </div>
                        <textarea rows={2} value={u.desc} onChange={e => updateItem(setUsps, usps, idx, 'desc', e.target.value)} className="w-full border dark:border-gray-500 p-2 rounded text-sm dark:bg-gray-800 dark:text-white" placeholder="Mô tả"></textarea>
                    </div>
                ))}
            </div>
            <button onClick={() => addItem(setUsps, usps, { icon: '⭐', title: '', desc: '' })} className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 rounded font-bold">+ Thêm Lý do</button>
            <div className="text-right pt-4 border-t dark:border-gray-700">
                <button onClick={() => handleSave('usps', usps)} disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded font-bold">Lưu USP</button>
            </div>
         </div>
      )}

      {/* 5. PROJECTS TAB */}
      {activeTab === 'projects' && (
          <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((p, idx) => (
                    <div key={p.id} className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded border dark:border-gray-600 relative">
                        <button onClick={() => removeItem(setProjects, projects, idx)} className="absolute top-2 right-2 text-red-500 font-bold">✕</button>
                        <input value={p.title} onChange={e => updateItem(setProjects, projects, idx, 'title', e.target.value)} className="w-full border dark:border-gray-500 p-2 rounded mb-2 font-bold dark:bg-gray-800 dark:text-white" placeholder="Tên dự án"/>
                        <input value={p.image} onChange={e => updateItem(setProjects, projects, idx, 'image', e.target.value)} className="w-full border dark:border-gray-500 p-2 rounded text-sm dark:bg-gray-800 dark:text-white" placeholder="Link ảnh"/>
                        {p.image && <img src={p.image} className="h-20 w-full object-cover mt-2 rounded border dark:border-gray-600"/>}
                    </div>
                ))}
              </div>
              <button onClick={() => addItem(setProjects, projects, { title: '', image: '' })} className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 rounded font-bold">+ Thêm Dự án</button>
              <div className="text-right pt-4 border-t dark:border-gray-700">
                <button onClick={() => handleSave('projects', projects)} disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded font-bold">Lưu Dự án</button>
            </div>
          </div>
      )}

      {/* 6. FAQS TAB */}
      {activeTab === 'faqs' && (
          <div className="space-y-4 animate-fade-in">
              {faqs.map((f, idx) => (
                  <div key={f.id} className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded border dark:border-gray-600 relative">
                      <button onClick={() => removeItem(setFaqs, faqs, idx)} className="absolute top-2 right-2 text-red-500 font-bold">✕</button>
                      <input value={f.q} onChange={e => updateItem(setFaqs, faqs, idx, 'q', e.target.value)} className="w-full border dark:border-gray-500 p-2 rounded mb-2 font-bold dark:bg-gray-800 dark:text-white" placeholder="Câu hỏi?"/>
                      <textarea rows={2} value={f.a} onChange={e => updateItem(setFaqs, faqs, idx, 'a', e.target.value)} className="w-full border dark:border-gray-500 p-2 rounded text-sm dark:bg-gray-800 dark:text-white" placeholder="Trả lời..."></textarea>
                  </div>
              ))}
              <button onClick={() => addItem(setFaqs, faqs, { q: '', a: '' })} className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 rounded font-bold">+ Thêm Câu hỏi</button>
              <div className="text-right pt-4 border-t dark:border-gray-700">
                <button onClick={() => handleSave('faqs', faqs)} disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded font-bold">Lưu FAQs</button>
            </div>
          </div>
      )}

      {/* 7. PROCESS TAB */}
      {activeTab === 'process' && (
          <div className="space-y-4 animate-fade-in">
              {process.map((p, idx) => (
                  <div key={p.id} className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded border dark:border-gray-600 relative flex gap-4">
                      <button onClick={() => removeItem(setProcess, process, idx)} className="absolute top-2 right-2 text-red-500 font-bold">✕</button>
                      <div className="w-16">
                          <input value={p.step} onChange={e => updateItem(setProcess, process, idx, 'step', e.target.value)} className="w-full border dark:border-gray-500 p-2 rounded text-center font-black text-2xl dark:bg-gray-800 dark:text-white" placeholder="01"/>
                      </div>
                      <div className="flex-1">
                          <input value={p.title} onChange={e => updateItem(setProcess, process, idx, 'title', e.target.value)} className="w-full border dark:border-gray-500 p-2 rounded mb-2 font-bold dark:bg-gray-800 dark:text-white" placeholder="Tên bước"/>
                          <textarea rows={2} value={p.desc} onChange={e => updateItem(setProcess, process, idx, 'desc', e.target.value)} className="w-full border dark:border-gray-500 p-2 rounded text-sm dark:bg-gray-800 dark:text-white" placeholder="Mô tả..."></textarea>
                      </div>
                  </div>
              ))}
              <button onClick={() => addItem(setProcess, process, { step: '01', title: '', desc: '' })} className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 rounded font-bold">+ Thêm Bước</button>
              <div className="text-right pt-4 border-t dark:border-gray-700">
                <button onClick={() => handleSave('process', process)} disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded font-bold">Lưu Quy trình</button>
            </div>
          </div>
      )}

      {/* 8. WARRANTY TAB (Phức tạp hơn chút) */}
      {activeTab === 'warranty' && (
          <div className="space-y-8 animate-fade-in">
              {/* Bảng thời gian bảo hành */}
              <div>
                  <h3 className="font-bold mb-2 dark:text-blue-300">1. Thời gian bảo hành</h3>
                  {warranty.periods.map((p, idx) => (
                      <div key={idx} className="flex gap-2 mb-2">
                          <input value={p.product} onChange={e => {const newP = [...warranty.periods]; newP[idx].product = e.target.value; setWarranty({...warranty, periods: newP})}} className="flex-1 border dark:border-gray-500 p-2 rounded dark:bg-gray-800 dark:text-white" placeholder="Sản phẩm"/>
                          <input value={p.time} onChange={e => {const newP = [...warranty.periods]; newP[idx].time = e.target.value; setWarranty({...warranty, periods: newP})}} className="w-24 border dark:border-gray-500 p-2 rounded dark:bg-gray-800 dark:text-white" placeholder="Thời gian"/>
                          <input value={p.scope} onChange={e => {const newP = [...warranty.periods]; newP[idx].scope = e.target.value; setWarranty({...warranty, periods: newP})}} className="flex-1 border dark:border-gray-500 p-2 rounded dark:bg-gray-800 dark:text-white" placeholder="Phạm vi"/>
                          <button onClick={() => {const newP = warranty.periods.filter((_,i)=>i!==idx); setWarranty({...warranty, periods: newP})}} className="text-red-500">✕</button>
                      </div>
                  ))}
                  <button onClick={() => setWarranty({...warranty, periods: [...warranty.periods, {product:'', time:'', scope:''}]})} className="text-sm text-blue-600 font-bold">+ Thêm dòng</button>
              </div>

              {/* Điều kiện */}
              <div>
                  <h3 className="font-bold mb-2 dark:text-green-300">2. Điều kiện hợp lệ</h3>
                  {warranty.conditions.map((c, idx) => (
                      <div key={idx} className="flex gap-2 mb-2">
                          <input value={c} onChange={e => updateWarrantyArray('conditions', idx, e.target.value)} className="flex-1 border dark:border-gray-500 p-2 rounded dark:bg-gray-800 dark:text-white"/>
                          <button onClick={() => removeWarrantyArray('conditions', idx)} className="text-red-500">✕</button>
                      </div>
                  ))}
                  <button onClick={() => addWarrantyArray('conditions')} className="text-sm text-green-600 font-bold">+ Thêm điều kiện</button>
              </div>

              {/* Từ chối */}
              <div>
                  <h3 className="font-bold mb-2 dark:text-red-300">3. Từ chối bảo hành</h3>
                  {warranty.refusals.map((r, idx) => (
                      <div key={idx} className="flex gap-2 mb-2">
                          <input value={r} onChange={e => updateWarrantyArray('refusals', idx, e.target.value)} className="flex-1 border dark:border-gray-500 p-2 rounded dark:bg-gray-800 dark:text-white"/>
                          <button onClick={() => removeWarrantyArray('refusals', idx)} className="text-red-500">✕</button>
                      </div>
                  ))}
                  <button onClick={() => addWarrantyArray('refusals')} className="text-sm text-red-600 font-bold">+ Thêm trường hợp</button>
              </div>

              <div className="text-right pt-4 border-t dark:border-gray-700">
                <button onClick={() => handleSave('warranty', warranty)} disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded font-bold">Lưu Chính sách</button>
            </div>
          </div>
      )}

    </div>
  );
};

export default Settings;