import { useState, useEffect } from 'react';
import { WarrantyPolicy } from '../../../../interfaces/door';
import { doorService } from '../../../../services/doorService';

interface Props { initialData: WarrantyPolicy; }

const WarrantySettings = ({ initialData }: Props) => {
  const [warranty, setWarranty] = useState<WarrantyPolicy>({ periods: [], conditions: [], refusals: [] });
  const [saving, setSaving] = useState(false);

  useEffect(() => { 
    if (initialData && Object.keys(initialData).length > 0) setWarranty(initialData); 
  }, [initialData]);

  // --- Xử lý Bảng thời gian bảo hành (Periods) ---
  const handleAddPeriod = () => setWarranty({ ...warranty, periods: [...warranty.periods, { product: '', time: '', scope: '' }] });
  const handleUpdatePeriod = (index: number, field: string, value: string) => {
    const newPeriods = [...warranty.periods];
    newPeriods[index] = { ...newPeriods[index], [field]: value } as any;
    setWarranty({ ...warranty, periods: newPeriods });
  };
  const handleDeletePeriod = (index: number) => setWarranty({ ...warranty, periods: warranty.periods.filter((_, i) => i !== index) });

  // --- Xử lý Điều kiện (Conditions) & Từ chối (Refusals) dạng mảng string ---
  const handleAddStringItem = (key: 'conditions' | 'refusals') => setWarranty({ ...warranty, [key]: [...warranty[key], ''] });
  const handleUpdateStringItem = (key: 'conditions' | 'refusals', index: number, value: string) => {
    const newArr = [...warranty[key]];
    newArr[index] = value;
    setWarranty({ ...warranty, [key]: newArr });
  };
  const handleDeleteStringItem = (key: 'conditions' | 'refusals', index: number) => {
    setWarranty({ ...warranty, [key]: warranty[key].filter((_, i) => i !== index) });
  };

  const handleSave = async () => {
    setSaving(true);
    await doorService.updateSettings({ warranty });
    setSaving(false);
    alert('✅ Đã lưu Chính sách bảo hành!');
  };

  return (
    <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
      <h3 className="text-xl font-bold dark:text-blue-400 mb-6">🛡️ 6. Chính sách bảo hành</h3>

      {/* 6.1. Bảng thời gian bảo hành */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-bold dark:text-white">A. Thời gian & Phạm vi bảo hành</h4>
          <button onClick={handleAddPeriod} className="text-sm bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded font-bold">+ Thêm dòng</button>
        </div>
        <div className="space-y-2">
          {warranty.periods.map((p, idx) => (
            <div key={idx} className="flex gap-2">
              <input type="text" placeholder="Sản phẩm" value={p.product} onChange={e => handleUpdatePeriod(idx, 'product', e.target.value)} className="flex-1 p-2 border dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 dark:text-white outline-none" />
              <input type="text" placeholder="Thời gian (VD: 05 Năm)" value={p.time} onChange={e => handleUpdatePeriod(idx, 'time', e.target.value)} className="w-32 p-2 border dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 dark:text-white outline-none" />
              <input type="text" placeholder="Phạm vi bảo hành" value={p.scope} onChange={e => handleUpdatePeriod(idx, 'scope', e.target.value)} className="flex-1 p-2 border dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 dark:text-white outline-none" />
              <button onClick={() => handleDeletePeriod(idx)} className="text-red-500 px-2 font-bold">✕</button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 6.2. Điều kiện bảo hành */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-bold dark:text-white">B. Điều kiện bảo hành</h4>
            <button onClick={() => handleAddStringItem('conditions')} className="text-sm text-blue-600 dark:text-blue-400 font-bold">+ Thêm điều kiện</button>
          </div>
          {warranty.conditions.map((cond, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input value={cond} onChange={e => handleUpdateStringItem('conditions', idx, e.target.value)} className="flex-1 p-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white outline-none text-sm" />
              <button onClick={() => handleDeleteStringItem('conditions', idx)} className="text-red-500">✕</button>
            </div>
          ))}
        </div>

        {/* 6.3. Từ chối bảo hành */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-bold text-red-600 dark:text-red-400">C. Trường hợp từ chối bảo hành</h4>
            <button onClick={() => handleAddStringItem('refusals')} className="text-sm text-red-600 dark:text-red-400 font-bold">+ Thêm trường hợp</button>
          </div>
          {warranty.refusals.map((refusal, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input value={refusal} onChange={e => handleUpdateStringItem('refusals', idx, e.target.value)} className="flex-1 p-2 border border-red-200 dark:border-red-900/50 rounded bg-red-50/50 dark:bg-gray-700 dark:text-white outline-none text-sm" />
              <button onClick={() => handleDeleteStringItem('refusals', idx)} className="text-red-500">✕</button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 text-right border-t border-gray-200 dark:border-gray-700 pt-4">
        <button onClick={handleSave} disabled={saving} className="bg-blue-600 text-white px-8 py-2.5 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition shadow-lg">{saving ? '⏳ Đang lưu...' : '💾 Lưu Chính sách'}</button>
      </div>
    </section>
  );
};
export default WarrantySettings;