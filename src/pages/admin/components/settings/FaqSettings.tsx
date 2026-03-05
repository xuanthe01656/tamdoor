import { useState, useEffect } from 'react';
import { FAQ } from '../../../../interfaces/door';
import { doorService } from '../../../../services/doorService';

interface Props { initialData: FAQ[]; }

const FaqSettings = ({ initialData }: Props) => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (initialData) setFaqs(initialData); }, [initialData]);

  const handleAdd = () => setFaqs([...faqs, { id: Date.now().toString(), q: '', a: '' }]);
  const handleUpdate = (id: string, field: keyof FAQ, value: string) => setFaqs(faqs.map(faq => faq.id === id ? { ...faq, [field]: value } : faq));
  const handleDelete = (id: string) => setFaqs(faqs.filter(faq => faq.id !== id));

  const handleSave = async () => {
    setSaving(true);
    await doorService.updateSettings({ faqs });
    setSaving(false);
    alert('✅ Đã lưu danh sách FAQ!');
  };

  return (
    <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold dark:text-blue-400">❓ 5. Câu hỏi thường gặp (FAQ)</h3>
        <button onClick={handleAdd} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-bold shadow">+ Thêm Câu Hỏi</button>
      </div>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={faq.id} className="flex gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-900/50">
            <div className="font-bold text-gray-400 mt-2">#{index + 1}</div>
            <div className="flex-1 space-y-3">
              <input type="text" placeholder="Câu hỏi?" value={faq.q} onChange={(e) => handleUpdate(faq.id, 'q', e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 font-bold" />
              <textarea placeholder="Câu trả lời..." value={faq.a} rows={2} onChange={(e) => handleUpdate(faq.id, 'a', e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button onClick={() => handleDelete(faq.id)} className="text-red-500 hover:text-red-700 px-2">🗑️</button>
          </div>
        ))}
      </div>
      <div className="mt-6 text-right border-t border-gray-200 dark:border-gray-700 pt-4">
        <button onClick={handleSave} disabled={saving} className="bg-blue-600 text-white px-8 py-2.5 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition shadow-lg">{saving ? '⏳ Đang lưu...' : '💾 Lưu FAQ'}</button>
      </div>
    </section>
  );
};
export default FaqSettings;