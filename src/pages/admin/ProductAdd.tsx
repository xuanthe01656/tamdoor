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
  // 👇 THÊM STATE NÀY ĐỂ QUẢN LÝ BƯỚC
  const [isExcelReady, setIsExcelReady] = useState(false);

  // --- 1. STATE DỮ LIỆU CẤU HÌNH ---
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

  // --- 2. TEMPLATES ---
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
    name: '', type: 'door', category: '', price: 0, image: '', description: '',
  });

  const [features, setFeatures] = useState<string[]>(['Chống nước tuyệt đối 100%', 'Không cong vênh, co ngót']);
  const [specs, setSpecs] = useState<ProductSpecification[]>(DOOR_SPECS_TEMPLATE);

  // Auto-select Category & Logic Template
  useEffect(() => {
    if (categoryOptions.length > 0 && !formData.category) {
      setFormData(prev => ({ ...prev, category: categoryOptions[0] }));
    }
  }, [categoryOptions]);

  useEffect(() => {
    if (formData.type === 'door') setSpecs(DOOR_SPECS_TEMPLATE);
    else setSpecs(ACCESSORY_SPECS_TEMPLATE);
  }, [formData.type]);

  // --- HANDLERS ---
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'price' ? Number(value) : value });
  };

  // --- A. UPLOAD ẢNH ĐƠN ---
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImg(true);
    const url = await doorService.uploadImage(file);
    setUploadingImg(false);
    if (url) setFormData(prev => ({ ...prev, image: url }));
  };

  // --- B. IMPORT EXCEL ---

  // B1. Đọc file Excel
  const handleExcelSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      
      if (data.length > 0) {
        setExcelData(data);
        setIsExcelReady(true); // Đánh dấu là đã có Excel
        
        // ⚠️ BỎ WINDOW.CONFIRM Ở ĐÂY ĐỂ TRÁNH LỖI TRÌNH DUYỆT
        // Thay vào đó, hiển thị thông báo nhẹ và đổi nút bấm trên giao diện
        alert(`✅ Đã đọc thành công ${data.length} dòng dữ liệu.\n👇 Bấm nút màu cam "CHỌN ẢNH" bên dưới để tiếp tục.`);
      } else {
        alert("File Excel trống!");
      }
    };
    reader.readAsBinaryString(file);
  };

  // B2. Chọn ảnh và Upload
  const handleImagesSelectAndUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (excelData.length === 0) return;

    setLoading(true);
    setImportStatus("Đang khởi tạo...");

    const finalProducts: any[] = [];

    for (let i = 0; i < excelData.length; i++) {
        const item: any = excelData[i];
        
        // 1. Xử lý Ảnh
        const imageNameFromExcel = item['Tên file ảnh']; 
        setImportStatus(`Đang xử lý ${i + 1}/${excelData.length}: ${item['Tên sản phẩm']}...`);

        let imageUrl = '';
        if (imageNameFromExcel) {
            const matchingFile = Array.from(files).find(f => 
                f.name.toLowerCase().trim() === imageNameFromExcel.toString().toLowerCase().trim()
            );
            if (matchingFile) {
                const uploadedUrl = await doorService.uploadImage(matchingFile);
                if (uploadedUrl) imageUrl = uploadedUrl;
            }
        }

        // 2. Xử lý Thông số
        let parsedSpecs: ProductSpecification[] = [];
        if (item['Thông số']) {
            const specsArray = item['Thông số'].toString().split(';');
            parsedSpecs = specsArray.map((specStr: string) => {
                const [key, ...rest] = specStr.split(':');
                return { key: key?.trim(), value: rest.join(':').trim() };
            }).filter((s: ProductSpecification) => s.key && s.value);
        }
        if (parsedSpecs.length === 0) {
            parsedSpecs = (item['Loại'] && item['Loại'].toLowerCase().includes('phụ kiện')) 
                ? ACCESSORY_SPECS_TEMPLATE : DOOR_SPECS_TEMPLATE;
        }

        // 3. Tạo object
        finalProducts.push({
            name: item['Tên sản phẩm'] || 'Sản phẩm mới',
            price: item['Giá'] || 0,
            category: item['Danh mục'] || (categoryOptions[0] || 'Khác'),
            type: (item['Loại'] && item['Loại'].toLowerCase().includes('phụ kiện')) ? 'accessory' : 'door',
            image: imageUrl || 'https://placehold.co/400x600?text=No+Image',
            description: item['Mô tả'] || '',
            features: item['Đặc điểm'] ? item['Đặc điểm'].toString().split(';') : [],
            specifications: parsedSpecs
        });
    }

    setImportStatus("Đang lưu vào Database...");
    const result = await doorService.addMultipleProducts(finalProducts);
    
    setLoading(false);
    setImportStatus("");
    setExcelData([]);
    setIsExcelReady(false); // Reset trạng thái
    
    alert(`✅ Hoàn tất!\n- Thành công: ${result.successCount}\n- Thất bại: ${result.failCount}`);
    navigate('/admin/products');
  };

  // Logic Features & Specs
  const handleFeatureChange = (index: number, value: string) => { const newFeatures = [...features]; newFeatures[index] = value; setFeatures(newFeatures); };
  const addFeatureRow = () => setFeatures([...features, '']);
  const removeFeatureRow = (index: number) => setFeatures(features.filter((_, i) => i !== index));

  const handleSpecChange = (index: number, field: 'key' | 'value', value: string) => { const newSpecs = [...specs]; newSpecs[index][field] = value; setSpecs(newSpecs); };
  const addSpecRow = () => setSpecs([...specs, { key: '', value: '' }]);
  const removeSpecRow = (index: number) => setSpecs(specs.filter((_, i) => i !== index));

  // Submit Thủ công
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    if (!formData.name || !formData.image) { alert("Thiếu tên hoặc ảnh!"); setLoading(false); return; }
    const finalData = { ...formData, features: features.filter(f => f.trim() !== ''), specifications: specs.filter(s => s.key.trim() !== '' && s.value.trim() !== '') };
    const success = await doorService.addProduct(finalData);
    setLoading(false);
    if (success) { alert("✅ Đã thêm!"); navigate('/admin/products'); }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100 mb-20">
      
      {/* HEADER & IMPORT ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b pb-4 gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">Thêm sản phẩm mới</h1>
           <p className="text-sm text-gray-500">Nhập thủ công hoặc Import Excel + Ảnh hàng loạt</p>
        </div>
        
        <div className="flex gap-3 items-center">
            {/* Input Ẩn */}
            <input type="file" accept=".xlsx, .xls" className="hidden" ref={fileInputRef} onChange={handleExcelSelect} />
            <input type="file" multiple accept="image/*" className="hidden" ref={imageFolderInputRef} onChange={handleImagesSelectAndUpload} />

            {/* HIỂN THỊ TRẠNG THÁI LOADING */}
            {loading && importStatus && (
                <span className="text-sm text-blue-600 font-bold animate-pulse">{importStatus}</span>
            )}

            {/* NÚT CHUYỂN ĐỔI TRẠNG THÁI (FIX LỖI TRÌNH DUYỆT) */}
            {!loading && (
                <>
                    {!isExcelReady ? (
                        // BƯỚC 1: CHỌN EXCEL
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm transition-all shadow-sm"
                        >
                            📥 Bước 1: Nhập Excel
                        </button>
                    ) : (
                        // BƯỚC 2: CHỌN ẢNH (CHỈ HIỆN SAU KHI ĐÃ CÓ EXCEL)
                        <div className="flex gap-2">
                             <button 
                                onClick={() => imageFolderInputRef.current?.click()}
                                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm transition-all shadow-sm animate-bounce"
                            >
                                📂 Bước 2: Chọn Folder Ảnh
                            </button>
                            <button 
                                onClick={() => { setIsExcelReady(false); setExcelData([]); }}
                                className="text-red-500 text-sm hover:underline"
                            >
                                (Hủy)
                            </button>
                        </div>
                    )}
                </>
            )}
            
            <button onClick={() => navigate('/admin/products')} className="text-gray-500 hover:text-gray-700 font-medium px-2">Quay lại</button>
        </div>
      </div>
      
      {/* FORM THỦ CÔNG (Phần dưới giữ nguyên) */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <h3 className="font-bold text-gray-800 border-l-4 border-blue-500 pl-3">A. Thông tin chung</h3>
            <div><label className="block text-sm font-bold text-gray-700 mb-2">Tên sản phẩm <span className="text-red-500">*</span></label><input type="text" name="name" required className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none" placeholder="VD: Cửa nhựa Composite..." value={formData.name} onChange={handleChange} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Mô tả ngắn</label><textarea name="description" rows={3} onChange={handleChange} value={formData.description} className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none"></textarea></div>
          </div>

          <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
             <div className="flex justify-between mb-2"><h3 className="font-bold">B. Đặc điểm</h3><button type="button" onClick={addFeatureRow} className="text-blue-600 font-bold text-sm">+ Thêm</button></div>
             {features.map((feat, i) => (<div key={i} className="flex gap-2 mb-2"><input value={feat} onChange={e=>handleFeatureChange(i,e.target.value)} className="flex-1 border p-2 rounded text-sm"/><button type="button" onClick={()=>removeFeatureRow(i)} className="text-red-500">✕</button></div>))}
          </div>

          <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
             <div className="flex justify-between mb-2"><h3 className="font-bold">C. Thông số</h3><button type="button" onClick={addSpecRow} className="text-gray-600 font-bold text-sm">+ Thêm</button></div>
             {specs.map((s, i) => (<div key={i} className="flex gap-2 mb-2"><input value={s.key} onChange={e=>handleSpecChange(i,'key',e.target.value)} placeholder="Tên" className="w-1/3 border p-2 rounded text-sm"/><input value={s.value} onChange={e=>handleSpecChange(i,'value',e.target.value)} placeholder="Giá trị" className="flex-1 border p-2 rounded text-sm"/><button type="button" onClick={()=>removeSpecRow(i)} className="text-red-500">✕</button></div>))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm sticky top-6">
            <h3 className="font-bold text-gray-800 border-b pb-2 mb-4">Thiết lập</h3>
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">Loại & Danh mục</label>
              <div className="flex gap-2 mb-3">
                 <label className={`flex-1 p-2 border rounded text-center cursor-pointer ${formData.type==='door'?'bg-blue-50 border-blue-500 text-blue-700 font-bold':''}`}><input type="radio" name="type" value="door" checked={formData.type==='door'} onChange={handleChange} className="hidden"/>🚪 Cửa</label>
                 <label className={`flex-1 p-2 border rounded text-center cursor-pointer ${formData.type==='accessory'?'bg-purple-50 border-purple-500 text-purple-700 font-bold':''}`}><input type="radio" name="type" value="accessory" checked={formData.type==='accessory'} onChange={handleChange} className="hidden"/>🔧 Phụ kiện</label>
              </div>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full border p-2 rounded">{categoryOptions.map((c,i)=><option key={i} value={c}>{c}</option>)}</select>
            </div>
            <div className="mb-4"><label className="block text-sm font-bold text-gray-700 mb-2">Giá bán (VNĐ)</label><input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border p-2 rounded font-bold text-lg" placeholder="0"/></div>
            
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Hình ảnh sản phẩm</label>
              <div className="relative group">
                 <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={handleImageFileChange} disabled={uploadingImg}/>
                 <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-all ${uploadingImg ? 'bg-gray-100' : 'border-blue-300 bg-blue-50 hover:bg-blue-100'}`}>
                    {uploadingImg ? <span className="text-blue-600 font-bold animate-pulse">⏳ Đang tải...</span> : <span className="text-blue-600 font-bold">☁️ Chọn ảnh từ máy</span>}
                 </div>
              </div>
              <input type="text" name="image" value={formData.image} onChange={handleChange} className="w-full border p-2 rounded text-sm mt-2" placeholder="Hoặc dán link ảnh..."/>
              <div className="mt-2 aspect-[3/4] bg-gray-100 rounded border flex items-center justify-center overflow-hidden relative">
                {formData.image ? <img src={formData.image} alt="Preview" className="w-full h-full object-cover"/> : <span className="text-gray-400 text-xs">Preview</span>}
              </div>
            </div>

            <button type="submit" disabled={loading || uploadingImg} className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Đang xử lý...' : '💾 ĐĂNG SẢN PHẨM'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductAdd;