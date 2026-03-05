import { useState, useEffect } from 'react';
import { ProcessStep } from '../../../../interfaces/door';
import { doorService } from '../../../../services/doorService';

interface Props { initialData: ProcessStep[]; }

const ProcessSettings = ({ initialData }: Props) => {
  const [process, setProcess] = useState<ProcessStep[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (initialData) setProcess(initialData); }, [initialData]);

  const handleAdd = () => setProcess([...process, { id: Date.now().toString(), step: `0${process.length + 1}`.slice(-2), title: '', desc: '' }]);
  const handleUpdate = (id: string, field: keyof ProcessStep, value: string) => setProcess(process.map(p => p.id === id ? { ...p, [field]: value } : p));
  const handleDelete = (id: string) => setProcess(process.filter(p => p.id !== id));

  const handleSave = async () => {
    setSaving(true);
    await doorService.updateSettings({ process });
    setSaving(false);
    alert('✅ Đã lưu Quy trình làm việc!');
  };

  return (
    <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold dark:text-blue-400">🔄 4. Quy trình làm việc</h3>
        <button onClick={handleAdd} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-bold shadow">+ Thêm Bước</button>
      </div>
      <div className="space-y-3">
        {process.map((p) => (
          <div key={p.id} className="flex gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-900/50 items-center">
            <input type="text" value={p.step} onChange={e => handleUpdate(p.id, 'step', e.target.value)} className="w-16 p-2 text-center font-bold text-xl border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 outline-none" placeholder="01" />
            <div className="flex-1 flex gap-2">
              <input type="text" placeholder="Tên bước" value={p.title} onChange={e => handleUpdate(p.id, 'title', e.target.value)} className="w-1/3 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 font-bold" />
              <input type="text" placeholder="Mô tả chi tiết" value={p.desc} onChange={e => handleUpdate(p.id, 'desc', e.target.value)} className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700 px-3">✕</button>
          </div>
        ))}
      </div>
      <div className="mt-6 text-right border-t border-gray-200 dark:border-gray-700 pt-4">
        <button onClick={handleSave} disabled={saving} className="bg-blue-600 text-white px-8 py-2.5 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition shadow-lg">{saving ? '⏳ Đang lưu...' : '💾 Lưu Quy trình'}</button>
      </div>
    </section>
  );
};
export default ProcessSettings;