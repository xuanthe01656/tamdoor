import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { doorService } from '../../services/doorService';
import { Door, ProductSpecification, ProductColor } from '../../interfaces/door'; // Đã thêm ProductColor

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
  const [colors, setColors] = useState<ProductColor[]>([]); // STATE QUẢN LÝ MÀU SẮC

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

  // Upload ảnh đại diện
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

        // 1. Upload ảnh ĐẠI DIỆN
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

        // 3. XỬ LÝ MÀU SẮC (Cú pháp: "Màu 1:anh1.jpg;Màu 2:anh2.png")
        let parsedColors: ProductColor[] = [];
        if (item['Màu sắc']) {
            const colorStrings = item['Màu sắc'].toString().split(';');
            for (const colorStr of colorStrings) {
                const [colorName, colorImgName] = colorStr.split(':');
                if (colorName && colorImgName) {
                    let colorImgUrl = '';
                    // Tìm file ảnh màu trong đống file được chọn ở Bước 2
                    const matchingColorFile = Array.from(files).find(f => 
                        f.name.toLowerCase().trim() === colorImgName.toString().toLowerCase().trim()
                    );
                    
                    if (matchingColorFile) {
                        setImportStatus(`Đang tải ảnh màu: ${colorName}...`);
                        colorImgUrl = await doorService.uploadImage(matchingColorFile) || '';
                    }

                    parsedColors.push({
                        name: colorName.trim(),
                        image: colorImgUrl
                    });
                }
            }
        }

        finalProducts.push({
            name: item['Tên sản phẩm'] || 'Sản phẩm mới',
            price: item['Giá'] || 0,
            category: item['Danh mục'] || (categoryOptions[0] || 'Khác'),
            type: (item['Loại']?.toLowerCase().includes('phụ kiện')) ? 'accessory' : 'door',
            image: imageUrl || 'https://via.placeholder.com/400x600?text=No+Image',
            description: item['Mô tả'] || '',
            features: item['Đặc điểm'] ? item['Đặc điểm'].toString().split(';') : [],
            specifications: parsedSpecs.length ? parsedSpecs : (item['Loại']?.toLowerCase().includes('phụ kiện') ? ACCESSORY_SPECS_TEMPLATE : DOOR_SPECS_TEMPLATE),
            colors: parsedColors // ĐÃ THÊM MẢNG MÀU SẮC VÀO ĐÂY
        });
    }

    setImportStatus("Đang lưu vào Database...");
    const result = await doorService.addMultipleProducts(finalProducts);
    setLoading(false);
    alert(`✅ Hoàn tất! Thành công: ${result.successCount}, Thất bại: ${result.failCount}`);
    navigate(fixPath('/products'));
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
        specifications: specs.filter(s => s.key.trim() !== '' && s.value.trim() !== ''),
        colors: colors.filter(c => c.name.trim() !== '' && c.image !== '') // Lọc bỏ màu chưa nhập thông tin
    };
    const success = await doorService.addProduct(finalData);
    setLoading(false);
    if (success) navigate(fixPath('/products'));
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
                        <button onClick={() => fileInputRef.current?.click()} className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-green-700 transition-colors">📥 Bước 1: Excel</button>
                    ) : (
                        <div className="flex gap-2">
                             <button onClick={() => imageFolderInputRef.current?.click()} className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold text-sm animate-bounce">📂 Bước 2: Chọn Ảnh</button>
                             <button onClick={() => setIsExcelReady(false)} className="text-red-500 font-bold hover:text-red-600">✕</button>
                        </div>
                    )}
                </>
            )}
            <button onClick={() => navigate(fixPath('/products'))} className="text-gray-500 font-medium px-2 hover:text-gray-800 dark:hover:text-white">Quay lại</button>
        </div>
      </div>
      
      {/* FORM CHÍNH */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <h3 className="font-bold text-gray-800 dark:text-white border-l-4 border-blue-500 pl-3">A. Thông tin chung</h3>
            <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Tên sản phẩm *</label>
                <input type="text" name="name" required className="w-full border dark:border-gray-600 rounded-lg px-4 py-3 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" value={formData.name} onChange={handleChange} placeholder="VD: Cửa Nhựa Composite Mẫu 01" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mô tả ngắn</label>
                <textarea name="description" rows={3} onChange={handleChange} value={formData.description} className="w-full border dark:border-gray-600 rounded-lg px-4 py-3 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" placeholder="Thông tin giới thiệu về sản phẩm..."></textarea>
            </div>
          </div>

          {/* ĐẶC ĐIỂM */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-100 dark:border-blue-800">
              <div className="flex justify-between mb-2">
                  <h3 className="font-bold dark:text-blue-100">B. Đặc điểm nổi bật</h3>
                  <button type="button" onClick={() => setFeatures([...features, ''])} className="text-blue-600 font-bold text-sm hover:underline">+ Thêm dòng</button>
              </div>
              {features.map((feat, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                      <input value={feat} onChange={e=>handleFeatureChange(i,e.target.value)} placeholder="VD: Chống nước 100%" className="flex-1 border dark:border-gray-600 p-2 rounded text-sm dark:bg-gray-800 dark:text-white outline-none focus:border-blue-500"/>
                      <button type="button" onClick={()=>setFeatures(features.filter((_, idx)=>idx!==i))} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 px-2 rounded">✕</button>
                  </div>
              ))}
          </div>

          {/* BIẾN THỂ MÀU SẮC */}
          <div className="bg-purple-50 dark:bg-purple-900/10 p-5 rounded-xl border border-purple-100 dark:border-purple-800">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-purple-900 dark:text-purple-100">C. Biến thể màu sắc (Tùy chọn)</h3>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Sử dụng khi sản phẩm có nhiều màu vân gỗ/sơn khác nhau</p>
              </div>
              <button type="button" onClick={addColorRow} className="text-sm bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-300 px-3 py-1.5 rounded hover:bg-purple-300 dark:hover:bg-purple-700 font-bold transition-colors">
                + Thêm màu
              </button>
            </div>
            
            <div className="space-y-3">
              {colors.map((color, index) => (
                <div key={index} className="flex gap-4 items-start bg-white dark:bg-gray-800 p-3 rounded-lg border border-purple-100 dark:border-gray-700 shadow-sm">
                  {/* Nhập tên màu */}
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Tên màu</label>
                    <input 
                      type="text" 
                      placeholder="VD: Óc chó, Trắng Sứ..." 
                      value={color.name} 
                      onChange={(e) => handleColorNameChange(index, e.target.value)} 
                      className="w-full border dark:border-gray-600 p-2 rounded text-sm dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  {/* Upload ảnh cho màu */}
                  <div className="w-20">
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 text-center">Ảnh</label>
                    <div className="relative aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded flex items-center justify-center overflow-hidden group bg-gray-50 dark:bg-gray-700 cursor-pointer hover:border-purple-500 transition-colors">
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
                    <button type="button" onClick={() => removeColorRow(index)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors" title="Xóa màu này">
                      ✕
                    </button>
                  </div>
                </div>
              ))}
              {colors.length === 0 && (
                 <div className="text-center py-4 border-2 border-dashed border-purple-200 dark:border-purple-800 rounded-lg text-purple-400 dark:text-purple-500 text-sm">
                    Chưa có biến thể màu nào. Sản phẩm sẽ chỉ dùng ảnh đại diện.
                 </div>
              )}
            </div>
          </div>

          {/* THÔNG SỐ */}
          <div className="bg-gray-50 dark:bg-gray-700/30 p-5 rounded-xl border border-gray-200 dark:border-gray-600">
              <div className="flex justify-between mb-2">
                  <h3 className="font-bold dark:text-gray-200">D. Thông số kỹ thuật</h3>
                  <button type="button" onClick={() => setSpecs([...specs, { key: '', value: '' }])} className="text-gray-600 font-bold text-sm hover:underline">+ Thêm dòng</button>
              </div>
              {specs.map((s, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                      <input value={s.key} onChange={e=>handleSpecChange(i,'key',e.target.value)} placeholder="Tên thông số (VD: Bảo hành)" className="w-1/3 border dark:border-gray-600 p-2 rounded text-sm dark:bg-gray-800 dark:text-white outline-none focus:border-gray-400"/>
                      <input value={s.value} onChange={e=>handleSpecChange(i,'value',e.target.value)} placeholder="Giá trị (VD: 5 năm)" className="flex-1 border dark:border-gray-600 p-2 rounded text-sm dark:bg-gray-800 dark:text-white outline-none focus:border-gray-400"/>
                      <button type="button" onClick={()=>setSpecs(specs.filter((_, idx)=>idx!==i))} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 px-2 rounded">✕</button>
                  </div>
              ))}
          </div>
        </div>

        {/* CỘT PHẢI: THIẾT LẬP */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm sticky top-6">
            <h3 className="font-bold text-gray-800 dark:text-white border-b dark:border-gray-700 pb-2 mb-4 uppercase text-sm tracking-widest">Thiết lập hiển thị</h3>
            
            <div className="mb-4">
              <label className="block text-xs font-black uppercase text-gray-400 mb-2">Loại sản phẩm</label>
              <div className="flex gap-2">
                  <button type="button" onClick={() => setFormData({...formData, type: 'door'})} className={`flex-1 p-2 border rounded font-bold transition-colors ${formData.type==='door' ? 'bg-blue-600 text-white border-blue-600' : 'dark:bg-gray-700 text-gray-500 dark:border-gray-600'}`}>🚪 Cửa</button>
                  <button type="button" onClick={() => setFormData({...formData, type: 'accessory'})} className={`flex-1 p-2 border rounded font-bold transition-colors ${formData.type==='accessory' ? 'bg-purple-600 text-white border-purple-600' : 'dark:bg-gray-700 text-gray-500 dark:border-gray-600'}`}>🔧 Phụ kiện</button>
              </div>
            </div>

            <div className="mb-4">
               <label className="block text-xs font-black uppercase text-gray-400 mb-2">Danh mục</label>
               <select name="category" value={formData.category} onChange={handleChange} className="w-full border dark:border-gray-600 p-2 rounded dark:bg-gray-700 dark:text-white font-bold outline-none focus:ring-2 focus:ring-blue-500">
                   {categoryOptions.map((c,i)=><option key={i} value={c}>{c}</option>)}
               </select>
            </div>

            <div className="mb-4">
               <label className="block text-xs font-black uppercase text-gray-400 mb-2">Thương hiệu</label>
               <select className="w-full border dark:border-gray-600 p-2 rounded dark:bg-gray-700 dark:text-white font-bold outline-none focus:ring-2 focus:ring-blue-500" value={specs.find(s => s.key === 'Thương hiệu')?.value || ''} onChange={handleBrandChange}>
                 <option value="">-- Chọn thương hiệu --</option>
                 {brandOptions.map((b, i) => <option key={i} value={b}>{b}</option>)}
               </select>
            </div>

            <div className="mb-4">
                <label className="block text-xs font-black uppercase text-gray-400 mb-2">Giá bán (VNĐ)</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border dark:border-gray-600 p-2 rounded font-black text-xl text-blue-600 dark:bg-gray-700 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            
            <div className="mb-6">
              <label className="block text-xs font-black uppercase text-gray-400 mb-2">Ảnh đại diện</label>
              <div className="relative border-2 border-dashed dark:border-gray-600 rounded-lg p-4 text-center group bg-gray-50 dark:bg-gray-900/30 cursor-pointer hover:border-blue-500 transition-colors">
                  <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={handleImageFileChange} disabled={uploadingImg}/>
                  {uploadingImg ? <span className="text-blue-500 font-bold animate-pulse">Đang tải...</span> : <span className="text-blue-500 font-bold group-hover:text-blue-600">☁️ Bấm chọn ảnh từ máy</span>}
              </div>
              <div className="mt-3 aspect-[3/4] bg-gray-100 dark:bg-gray-700 rounded overflow-hidden border dark:border-gray-600 flex items-center justify-center">
                {formData.image ? (
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover"/>
                ) : (
                  <span className="text-gray-400 text-xs font-medium">Chưa có ảnh</span>
                )}
              </div>
            </div>

            <button type="submit" disabled={loading || uploadingImg} className="w-full py-4 bg-blue-700 text-white rounded-xl font-black shadow-xl hover:bg-blue-800 disabled:opacity-50 uppercase tracking-widest transition-transform active:scale-95">
              {loading ? 'Đang lưu...' : 'Lưu sản phẩm'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductAdd;