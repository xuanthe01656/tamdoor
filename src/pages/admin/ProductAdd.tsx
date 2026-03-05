import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { doorService } from '../../services/doorService';
import { Door, ProductSpecification } from '../../interfaces/door';

const ProductAdd = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageFolderInputRef = useRef<HTMLInputElement>(null);

  // State Import Excel
  const [excelData, setExcelData] = useState<any[]>([]); 
  const [importStatus, setImportStatus] = useState(""); 
  const [isExcelReady, setIsExcelReady] = useState(false);

  // --- 1. LOGIC SUBDOMAIN ROUTER ---
  const isAdminSubdomain = window.location.hostname.startsWith('admin.');
  const fixPath = (path: string) => isAdminSubdomain ? path : `/admin${path}`;

  // --- 2. STATE DỮ LIỆU CẤU HÌNH ---
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [brandOptions, setBrandOptions] = useState<string[]>([]);

  useEffect(() => {
    const fetchSettings = async () => {
      const settings = await doorService.getSettings();
      if (settings.categories) setCategoryOptions(settings.categories);
      if (settings.brands) setBrandOptions(settings.brands);
    };
    fetchSettings();
  }, []);

  // --- 3. TEMPLATES ---
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

  // --- 4. STATE FORM ---
  const [formData, setFormData] = useState<Partial<Door>>({
    name: '', type: 'door', category: '', price: 0, image: '', description: '',
  });

  const [features, setFeatures] = useState<string[]>(['Chống nước tuyệt đối 100%', 'Không cong vênh, co ngót']);
  const [specs, setSpecs] = useState<ProductSpecification[]>(DOOR_SPECS_TEMPLATE);

  // Auto-select Category
  useEffect(() => {
    if (categoryOptions.length > 0 && !formData.category) {
      setFormData(prev => ({ ...prev, category: categoryOptions[0] }));
    }
  }, [categoryOptions]);

  // Auto-switch Template
  useEffect(() => {
    if (formData.type === 'door') setSpecs(DOOR_SPECS_TEMPLATE);
    else setSpecs(ACCESSORY_SPECS_TEMPLATE);
  }, [formData.type]);

  // --- HANDLERS ---
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'price' ? Number(value) : value });
  };

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBrand = e.target.value;
    setSpecs(prevSpecs => prevSpecs.map(spec => 
        spec.key === 'Thương hiệu' ? { ...spec, value: selectedBrand } : spec
    ));
  };

  // Upload ảnh đơn
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImg(true);
    const url = await doorService.uploadImage(file);
    setUploadingImg(false);
    if (url) setFormData(prev => ({ ...prev, image: url }));
  };

  // --- B. IMPORT EXCEL HÀNG LOẠT ---
  const handleExcelSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws);
      if (data.length > 0) {
        setExcelData(data);
        setIsExcelReady(true);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleImagesSelectAndUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || excelData.length === 0) return;

    setLoading(true);
    const finalProducts: any[] = [];
    for (let i = 0; i < excelData.length; i++) {
        const item: any = excelData[i];
        setImportStatus(`Đang xử lý ${i + 1}/${excelData.length}: ${item['Tên sản phẩm']}`);

        // 1. Upload ảnh
        let imageUrl = '';
        const imgName = item['Tên file ảnh']; 
        if (imgName) {
            const matchingFile = Array.from(files).find(f => f.name.toLowerCase().trim() === imgName.toString().toLowerCase().trim());
            if (matchingFile) imageUrl = await doorService.uploadImage(matchingFile) || '';
        }

        // 2. Xử lý Specs từ chuỗi "Key:Val;Key:Val"
        let parsedSpecs: ProductSpecification[] = [];
        if (item['Thông số']) {
            parsedSpecs = item['Thông số'].toString().split(';').map((s: string) => {
                const parts = s.split(':');
                return { key: parts[0]?.trim(), value: parts[1]?.trim() };
            }).filter((s: any) => s.key && s.value);
        }

        finalProducts.push({
            name: item['Tên sản phẩm'] || 'Sản phẩm mới',
            price: item['Giá'] || 0,
            category: item['Danh mục'] || (categoryOptions[0] || 'Khác'),
            type: (item['Loại']?.toLowerCase().includes('phụ kiện')) ? 'accessory' : 'door',
            image: imageUrl || 'https://via.placeholder.com/400x600?text=No+Image',
            description: item['Mô tả'] || '',
            features: item['Đặc điểm'] ? item['Đặc điểm'].toString().split(';') : [],
            specifications: parsedSpecs.length ? parsedSpecs : (item['Loại']?.toLowerCase().includes('phụ kiện') ? ACCESSORY_SPECS_TEMPLATE : DOOR_SPECS_TEMPLATE)
        });
    }

    setImportStatus("Đang lưu vào Database...");
    const result = await doorService.addMultipleProducts(finalProducts);
    setLoading(false);
    alert(`✅ Hoàn tất! Thành công: ${result.successCount}, Thất bại: ${result.failCount}`);
    navigate(fixPath('/products')); // ĐÃ FIX ROUTER
  };

  // Helper quản lý mảng Features & Specs
  const handleFeatureChange = (index: number, value: string) => { const n = [...features]; n[index] = value; setFeatures(n); };
  const handleSpecChange = (index: number, field: 'key' | 'value', value: string) => { const n = [...specs]; n[index][field] = value; setSpecs(n); };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const finalData = { 
        ...formData, 
        features: features.filter(f => f.trim() !== ''), 
        specifications: specs.filter(s => s.key.trim() !== '' && s.value.trim() !== '') 
    };
    const success = await doorService.addProduct(finalData);
    setLoading(false);
    if (success) navigate(fixPath('/products')); // ĐÃ FIX ROUTER
  };

  return (
    <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 mb-20">
      
      {/* HEADER & TOOLS */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b dark:border-gray-700 pb-4 gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-800 dark:text-white uppercase tracking-tight">Thêm sản phẩm mới</h1>
           <p className="text-sm text-gray-500">Thủ công hoặc Import Excel hàng loạt</p>
        </div>
        
        <div className="flex gap-3 items-center">
            <input type="file" accept=".xlsx" className="hidden" ref={fileInputRef} onChange={handleExcelSelect} />
            <input type="file" multiple accept="image/*" className="hidden" ref={imageFolderInputRef} onChange={handleImagesSelectAndUpload} />

            {loading && importStatus ? (
                <span className="text-sm text-blue-600 font-bold animate-pulse">{importStatus}</span>
            ) : (
                <>
                    {!isExcelReady ? (
                        <button onClick={() => fileInputRef.current?.click()} className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm">📥 Bước 1: Excel</button>
                    ) : (
                        <div className="flex gap-2">
                             <button onClick={() => imageFolderInputRef.current?.click()} className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold text-sm animate-bounce">📂 Bước 2: Chọn Ảnh</button>
                             <button onClick={() => setIsExcelReady(false)} className="text-red-500 font-bold">✕</button>
                        </div>
                    )}
                </>
            )}
            <button onClick={() => navigate(fixPath('/products'))} className="text-gray-500 font-medium px-2">Quay lại</button>
        </div>
      </div>
      
      {/* FORM CHÍNH */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <h3 className="font-bold text-gray-800 dark:text-white border-l-4 border-blue-500 pl-3">A. Thông tin chung</h3>
            <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Tên sản phẩm *</label>
                <input type="text" name="name" required className="w-full border dark:border-gray-600 rounded-lg px-4 py-3 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" value={formData.name} onChange={handleChange} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mô tả ngắn</label>
                <textarea name="description" rows={3} onChange={handleChange} value={formData.description} className="w-full border dark:border-gray-600 rounded-lg px-4 py-3 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
          </div>

          {/* ĐẶC ĐIỂM */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-100 dark:border-blue-800">
              <div className="flex justify-between mb-2">
                  <h3 className="font-bold dark:text-blue-100">B. Đặc điểm nổi bật</h3>
                  <button type="button" onClick={() => setFeatures([...features, ''])} className="text-blue-600 font-bold text-sm">+ Thêm dòng</button>
              </div>
              {features.map((feat, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                      <input value={feat} onChange={e=>handleFeatureChange(i,e.target.value)} className="flex-1 border dark:border-gray-600 p-2 rounded text-sm dark:bg-gray-800 dark:text-white"/>
                      <button type="button" onClick={()=>setFeatures(features.filter((_, idx)=>idx!==i))} className="text-red-500">✕</button>
                  </div>
              ))}
          </div>

          {/* THÔNG SỐ */}
          <div className="bg-gray-50 dark:bg-gray-700/30 p-5 rounded-xl border border-gray-200 dark:border-gray-600">
              <div className="flex justify-between mb-2">
                  <h3 className="font-bold dark:text-gray-200">C. Thông số kỹ thuật</h3>
                  <button type="button" onClick={() => setSpecs([...specs, { key: '', value: '' }])} className="text-gray-600 font-bold text-sm">+ Thêm dòng</button>
              </div>
              {specs.map((s, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                      <input value={s.key} onChange={e=>handleSpecChange(i,'key',e.target.value)} placeholder="Tên" className="w-1/3 border dark:border-gray-600 p-2 rounded text-sm dark:bg-gray-800 dark:text-white"/>
                      <input value={s.value} onChange={e=>handleSpecChange(i,'value',e.target.value)} placeholder="Giá trị" className="flex-1 border dark:border-gray-600 p-2 rounded text-sm dark:bg-gray-800 dark:text-white"/>
                      <button type="button" onClick={()=>setSpecs(specs.filter((_, idx)=>idx!==i))} className="text-red-500">✕</button>
                  </div>
              ))}
          </div>
        </div>

        {/* CỘT PHẢI: THIẾT LẬP */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm sticky top-6">
            <h3 className="font-bold text-gray-800 dark:text-white border-b dark:border-gray-700 pb-2 mb-4 uppercase text-sm tracking-widest">Thiết lập</h3>
            
            <div className="mb-4">
              <label className="block text-xs font-black uppercase text-gray-400 mb-2">Loại sản phẩm</label>
              <div className="flex gap-2">
                  <button type="button" onClick={() => setFormData({...formData, type: 'door'})} className={`flex-1 p-2 border rounded font-bold ${formData.type==='door' ? 'bg-blue-600 text-white' : 'dark:bg-gray-700 text-gray-500'}`}>🚪 Cửa</button>
                  <button type="button" onClick={() => setFormData({...formData, type: 'accessory'})} className={`flex-1 p-2 border rounded font-bold ${formData.type==='accessory' ? 'bg-purple-600 text-white' : 'dark:bg-gray-700 text-gray-500'}`}>🔧 Phụ kiện</button>
              </div>
            </div>

            <div className="mb-4">
               <label className="block text-xs font-black uppercase text-gray-400 mb-2">Danh mục</label>
               <select name="category" value={formData.category} onChange={handleChange} className="w-full border dark:border-gray-600 p-2 rounded dark:bg-gray-700 dark:text-white font-bold">
                   {categoryOptions.map((c,i)=><option key={i} value={c}>{c}</option>)}
               </select>
            </div>

            <div className="mb-4">
               <label className="block text-xs font-black uppercase text-gray-400 mb-2">Thương hiệu</label>
               <select className="w-full border dark:border-gray-600 p-2 rounded dark:bg-gray-700 dark:text-white font-bold" value={specs.find(s => s.key === 'Thương hiệu')?.value || ''} onChange={handleBrandChange}>
                 <option value="">-- Chọn thương hiệu --</option>
                 {brandOptions.map((b, i) => <option key={i} value={b}>{b}</option>)}
               </select>
            </div>

            <div className="mb-4">
                <label className="block text-xs font-black uppercase text-gray-400 mb-2">Giá bán (VNĐ)</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border dark:border-gray-600 p-2 rounded font-black text-xl text-blue-600 dark:bg-gray-700" />
            </div>
            
            <div className="mb-6">
              <label className="block text-xs font-black uppercase text-gray-400 mb-2">Ảnh sản phẩm</label>
              <div className="relative border-2 border-dashed dark:border-gray-600 rounded-lg p-4 text-center group bg-gray-50 dark:bg-gray-900/30">
                  <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleImageFileChange} disabled={uploadingImg}/>
                  {uploadingImg ? <span className="text-blue-500 font-bold animate-pulse">Đang tải...</span> : <span className="text-blue-500 font-bold">☁️ Chọn ảnh máy</span>}
              </div>
              <div className="mt-3 aspect-[3/4] bg-gray-100 dark:bg-gray-700 rounded overflow-hidden border dark:border-gray-600">
                {formData.image && <img src={formData.image} alt="Preview" className="w-full h-full object-cover"/>}
              </div>
            </div>

            <button type="submit" disabled={loading || uploadingImg} className="w-full py-4 bg-blue-700 text-white rounded-xl font-black shadow-xl hover:bg-blue-800 disabled:opacity-50 uppercase tracking-widest">
              {loading ? 'Đang lưu...' : 'Lưu sản phẩm'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductAdd;