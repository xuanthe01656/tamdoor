import { useState, useEffect } from 'react';
import { USP } from '../../../../interfaces/door';
import { doorService } from '../../../../services/doorService';

interface Props { initialData: USP[]; }

const UspSettings = ({ initialData }: Props) => {
  const [usps, setUsps] = useState<USP[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (initialData) setUsps(initialData); }, [initialData]);

  const handleAdd = () => setUsps([...usps, { id: Date.now().toString(), icon: '⭐', title: '', desc: '' }]);
  const handleUpdate = (id: string, field: keyof USP, value: string) => setUsps(usps.map(u => u.id === id ? { ...u, [field]: value } : u));
  const handleDelete = (id: string) => setUsps(usps.filter(u => u.id !== id));

  const handleSave = async () => {
    setSaving(true);
    await doorService.updateSettings({ usps });
    setSaving(false);
    alert('✅ Đã lưu cấu hình Lợi thế cạnh tranh!');
  };

  return (
    <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold dark:text-blue-400">⭐ 2. Lợi thế cạnh tranh (USP)</h3>
        <button onClick={handleAdd} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-bold shadow">+ Thêm USP</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {usps.map((usp) => (
          <div key={usp.id} className="flex gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-900/50 items-start">
            <input type="text" value={usp.icon} onChange={e => handleUpdate(usp.id, 'icon', e.target.value)} className="w-14 h-14 text-center text-2xl border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 outline-none focus:ring-2 focus:ring-blue-500" title="Emoji hoặc Icon text" />
            <div className="flex-1 space-y-2">
              <input type="text" placeholder="Tiêu đề (VD: Chống nước)" value={usp.title} onChange={e => handleUpdate(usp.id, 'title', e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 font-bold" />
              <textarea placeholder="Mô tả chi tiết" value={usp.desc} onChange={e => handleUpdate(usp.id, 'desc', e.target.value)} rows={2} className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button onClick={() => handleDelete(usp.id)} className="text-red-500 hover:text-red-700 px-2 py-1">✕</button>
          </div>
        ))}
      </div>
      <div className="mt-6 text-right border-t border-gray-200 dark:border-gray-700 pt-4">
        <button onClick={handleSave} disabled={saving} className="bg-blue-600 text-white px-8 py-2.5 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition shadow-lg">{saving ? '⏳ Đang lưu...' : '💾 Lưu USP'}</button>
      </div>
    </section>
  );
};
export default UspSettings;