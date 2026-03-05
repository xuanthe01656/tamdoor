import { useState, useEffect } from 'react';
import { WebsiteInfo } from '../../../../interfaces/door';
import { doorService } from '../../../../services/doorService';

interface Props {
  initialData?: WebsiteInfo;
}

const CompanyInfoSettings = ({ initialData }: Props) => {
  const [info, setInfo] = useState<WebsiteInfo>({
    companyName: '',
    address: '',
    phone: '',
    zalo: '',
    email: '',
    taxId: '',
    facebook: '',
    mapIframe: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setInfo(initialData);
    }
  }, [initialData]);

  const handleChange = (field: keyof WebsiteInfo, value: string) => {
    setInfo({ ...info, [field]: value });
  };

  const handleSave = async () => {
    setSaving(true);
    // Lưu object companyInfo vào document 'cms' trên Firestore
    await doorService.updateSettings({ companyInfo: info });
    setSaving(false);
    alert('✅ Đã lưu Thông tin Công ty thành công!');
  };

  return (
    <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
      <div className="flex justify-between items-center mb-6 border-b pb-3 dark:border-gray-700">
        <h3 className="text-xl font-bold dark:text-blue-400">🏢 8. Thông tin Liên hệ & Website</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cột 1 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Tên Công ty / Thương hiệu</label>
            <input 
              type="text" value={info.companyName} onChange={e => handleChange('companyName', e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="VD: CASARDOOR"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Mã số thuế (Tax ID)</label>
            <input 
              type="text" value={info.taxId} onChange={e => handleChange('taxId', e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Địa chỉ trụ sở</label>
            <textarea 
              value={info.address} onChange={e => handleChange('address', e.target.value)} rows={2}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Google Map Iframe (Link nhúng)</label>
            <textarea 
              value={info.mapIframe} onChange={e => handleChange('mapIframe', e.target.value)} rows={3}
              className="w-full p-2 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 font-mono" 
              placeholder='<iframe src="https://www.google.com/maps/embed?..." ></iframe>'
            />
          </div>
        </div>

        {/* Cột 2 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Hotline / Số điện thoại</label>
            <input 
              type="text" value={info.phone} onChange={e => handleChange('phone', e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 font-bold text-blue-600 dark:text-blue-400" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Email liên hệ</label>
            <input 
              type="email" value={info.email} onChange={e => handleChange('email', e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Link Zalo</label>
            <input 
              type="text" value={info.zalo} onChange={e => handleChange('zalo', e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
              placeholder="VD: https://zalo.me/0901234567"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Link Facebook / Fanpage</label>
            <input 
              type="text" value={info.facebook} onChange={e => handleChange('facebook', e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
              placeholder="VD: https://facebook.com/casardoor"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 text-right border-t border-gray-200 dark:border-gray-700 pt-4">
        <button onClick={handleSave} disabled={saving} className="bg-blue-600 text-white px-8 py-2.5 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition shadow-lg">
          {saving ? '⏳ Đang lưu...' : '💾 Lưu Thông tin'}
        </button>
      </div>
    </section>
  );
};

export default CompanyInfoSettings;