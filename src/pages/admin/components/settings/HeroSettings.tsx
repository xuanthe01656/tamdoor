import { useState, useEffect } from 'react';
import { HeroSlide } from '../../../../interfaces/door';
import { doorService } from '../../../../services/doorService';

interface Props { initialData: HeroSlide[]; }

const HeroSettings = ({ initialData }: Props) => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (initialData) setSlides(initialData); }, [initialData]);

  const handleAdd = () => {
    setSlides([...slides, { id: Date.now().toString(), title: '', subtitle: '', description: '', image: '', cta: 'Xem ngay', link: '/san-pham' }]);
  };

  const handleUpdate = (id: string, field: keyof HeroSlide, value: string) => {
    setSlides(slides.map(slide => slide.id === id ? { ...slide, [field]: value } : slide));
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa Banner này?')) setSlides(slides.filter(slide => slide.id !== id));
  };

  const handleSave = async () => {
    setSaving(true);
    await doorService.updateSettings({ heroSlides: slides });
    setSaving(false);
    alert('✅ Đã lưu cấu hình Hero Banner!');
  };

  return (
    <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold dark:text-blue-400">🖼️ 1. Cấu hình Hero Banner</h3>
        <button onClick={handleAdd} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-bold shadow">+ Thêm Banner</button>
      </div>

      <div className="space-y-6">
        {slides.map((slide, index) => (
          <div key={slide.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex flex-col md:flex-row gap-6 bg-gray-50 dark:bg-gray-900/50">
            <div className="w-full md:w-1/3">
              <label className="text-xs font-bold text-gray-500 mb-1 block">Link ảnh Banner</label>
              <input type="text" value={slide.image} onChange={(e) => handleUpdate(slide.id, 'image', e.target.value)} className="w-full p-2 mb-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://..." />
              <div className="aspect-video bg-gray-200 dark:bg-gray-800 rounded flex items-center justify-center overflow-hidden border dark:border-gray-700">
                {slide.image ? <img src={slide.image} alt="preview" className="w-full h-full object-cover" /> : <span className="text-xs text-gray-400">Preview</span>}
              </div>
            </div>
            <div className="w-full md:w-2/3 space-y-3">
              <div className="flex gap-2">
                <div className="flex-1"><label className="text-xs font-bold text-gray-500 mb-1 block">Tiêu đề chính</label><input type="text" value={slide.title} onChange={(e) => handleUpdate(slide.id, 'title', e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" /></div>
                <div className="flex-1"><label className="text-xs font-bold text-gray-500 mb-1 block">Tiêu đề phụ</label><input type="text" value={slide.subtitle} onChange={(e) => handleUpdate(slide.id, 'subtitle', e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" /></div>
              </div>
              <div><label className="text-xs font-bold text-gray-500 mb-1 block">Mô tả</label><textarea value={slide.description} onChange={(e) => handleUpdate(slide.id, 'description', e.target.value)} rows={2} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" /></div>
              <div className="flex gap-2 items-end">
                <div className="w-1/3"><label className="text-xs font-bold text-gray-500 mb-1 block">Chữ nút bấm (CTA)</label><input type="text" value={slide.cta} onChange={(e) => handleUpdate(slide.id, 'cta', e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 text-sm" /></div>
                <div className="flex-1"><label className="text-xs font-bold text-gray-500 mb-1 block">Link điều hướng</label><input type="text" value={slide.link} onChange={(e) => handleUpdate(slide.id, 'link', e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 text-sm" /></div>
              </div>
              <div className="text-right pt-2"><button onClick={() => handleDelete(slide.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 px-3 py-1 rounded text-sm font-bold transition">🗑️ Xóa Banner này</button></div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-right border-t border-gray-200 dark:border-gray-700 pt-4">
        <button onClick={handleSave} disabled={saving} className="bg-blue-600 text-white px-8 py-2.5 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition shadow-lg">{saving ? '⏳ Đang lưu...' : '💾 Lưu Banner'}</button>
      </div>
    </section>
  );
};
export default HeroSettings;