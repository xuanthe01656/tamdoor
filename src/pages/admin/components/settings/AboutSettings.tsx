import { useState, useEffect } from 'react';
import { doorService } from '../../../../services/doorService';

interface StatItem { value: string; label: string; }
interface CoreValueItem { title: string; desc: string; }
interface StoryBullet { title: string; desc: string; }

interface AboutData {
  stats: StatItem[];
  coreValues: CoreValueItem[];
  story: {
    title: string;
    paragraphs: string[];
    bullets: StoryBullet[];
  };
}

interface Props { initialData?: AboutData; }

const AboutSettings = ({ initialData }: Props) => {
  const [about, setAbout] = useState<AboutData>({
    stats: [],
    coreValues: [],
    story: { title: 'Tầm nhìn & Sứ mệnh', paragraphs: [], bullets: [] }
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setAbout({
        stats: initialData.stats || [],
        coreValues: initialData.coreValues || [],
        story: initialData.story || { title: 'Tầm nhìn & Sứ mệnh', paragraphs: [], bullets: [] }
      });
    }
  }, [initialData]);

  // --- Xử lý Stats & Core Values ---
  const handleAddStat = () => setAbout({ ...about, stats: [...about.stats, { value: '', label: '' }] });
  const handleUpdateStat = (idx: number, field: keyof StatItem, val: string) => {
    const newStats = [...about.stats]; newStats[idx] = { ...newStats[idx], [field]: val };
    setAbout({ ...about, stats: newStats });
  };
  const handleDeleteStat = (idx: number) => setAbout({ ...about, stats: about.stats.filter((_, i) => i !== idx) });

  const handleAddCoreValue = () => setAbout({ ...about, coreValues: [...about.coreValues, { title: '', desc: '' }] });
  const handleUpdateCoreValue = (idx: number, field: keyof CoreValueItem, val: string) => {
    const newValues = [...about.coreValues]; newValues[idx] = { ...newValues[idx], [field]: val };
    setAbout({ ...about, coreValues: newValues });
  };
  const handleDeleteCoreValue = (idx: number) => setAbout({ ...about, coreValues: about.coreValues.filter((_, i) => i !== idx) });

  // --- Xử lý Story (Đoạn văn & Bullet) ---
  const handleAddParagraph = () => setAbout({ ...about, story: { ...about.story, paragraphs: [...about.story.paragraphs, ''] } });
  const handleUpdateParagraph = (idx: number, val: string) => {
    const newParas = [...about.story.paragraphs]; newParas[idx] = val;
    setAbout({ ...about, story: { ...about.story, paragraphs: newParas } });
  };
  const handleDeleteParagraph = (idx: number) => setAbout({ ...about, story: { ...about.story, paragraphs: about.story.paragraphs.filter((_, i) => i !== idx) } });

  const handleAddBullet = () => setAbout({ ...about, story: { ...about.story, bullets: [...about.story.bullets, { title: '', desc: '' }] } });
  const handleUpdateBullet = (idx: number, field: keyof StoryBullet, val: string) => {
    const newBullets = [...about.story.bullets]; newBullets[idx] = { ...newBullets[idx], [field]: val };
    setAbout({ ...about, story: { ...about.story, bullets: newBullets } });
  };
  const handleDeleteBullet = (idx: number) => setAbout({ ...about, story: { ...about.story, bullets: about.story.bullets.filter((_, i) => i !== idx) } });

  const handleSave = async () => {
    setSaving(true);
    await doorService.updateSettings({ about });
    setSaving(false);
    alert('✅ Đã lưu cấu hình trang Giới thiệu (About Us)!');
  };

  return (
    <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
      <div className="flex justify-between items-center mb-6 border-b pb-3 dark:border-gray-700">
        <h3 className="text-xl font-bold dark:text-blue-400">ℹ️ 9. Trang Giới thiệu (About Us)</h3>
      </div>

      <div className="space-y-8">
        {/* PHẦN 1: TẦM NHÌN & SỨ MỆNH (STORY) */}
        <div className="bg-blue-50/50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
          <h4 className="font-bold text-lg dark:text-white mb-4">A. Nội dung Tầm nhìn & Sứ mệnh</h4>
          
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Tiêu đề chính</label>
            <input 
              type="text" value={about.story.title} onChange={e => setAbout({...about, story: {...about.story, title: e.target.value}})}
              className="w-full md:w-1/2 p-2 font-bold border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white outline-none" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Các đoạn văn */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-gray-600 dark:text-gray-400">Các đoạn văn bản</span>
                <button onClick={handleAddParagraph} className="text-xs text-blue-600 font-bold">+ Thêm đoạn</button>
              </div>
              <div className="space-y-2">
                {about.story.paragraphs.map((p, idx) => (
                  <div key={idx} className="flex gap-2">
                    <textarea value={p} onChange={e => handleUpdateParagraph(idx, e.target.value)} rows={2} className="flex-1 p-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white outline-none" placeholder={`Đoạn văn ${idx + 1}`} />
                    <button onClick={() => handleDeleteParagraph(idx)} className="text-red-500 hover:text-red-700 font-bold px-1">✕</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Các mục tiêu nhỏ (Bullets) */}
            <div>
               <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-gray-600 dark:text-gray-400">Các điểm nhấn (01, 02...)</span>
                <button onClick={handleAddBullet} className="text-xs text-blue-600 font-bold">+ Thêm điểm nhấn</button>
              </div>
              <div className="space-y-2">
                {about.story.bullets.map((b, idx) => (
                  <div key={idx} className="flex gap-2 items-start bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-600 rounded">
                    <div className="flex-1 space-y-2">
                      <input type="text" value={b.title} onChange={e => handleUpdateBullet(idx, 'title', e.target.value)} placeholder="Tiêu đề (VD: Tiên phong công nghệ)" className="w-full p-2 text-sm font-bold border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 dark:text-white outline-none" />
                      <input type="text" value={b.desc} onChange={e => handleUpdateBullet(idx, 'desc', e.target.value)} placeholder="Mô tả ngắn gọn" className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 dark:text-white outline-none" />
                    </div>
                    <button onClick={() => handleDeleteBullet(idx)} className="text-red-500 hover:text-red-700 font-bold px-1 py-1">✕</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* PHẦN 2: THỐNG KÊ (STATS) */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-bold dark:text-white">B. Các con số ấn tượng</h4>
              <button onClick={handleAddStat} className="text-sm text-blue-600 dark:text-blue-400 font-bold">+ Thêm con số</button>
            </div>
            <div className="space-y-3">
              {about.stats.map((stat, idx) => (
                <div key={idx} className="flex gap-2 items-center bg-gray-50 dark:bg-gray-900/50 p-2 rounded border dark:border-gray-700">
                  <input type="text" placeholder="VD: 10+" value={stat.value} onChange={e => handleUpdateStat(idx, 'value', e.target.value)} className="w-24 p-2 font-bold text-blue-600 dark:text-blue-400 text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 outline-none" />
                  <input type="text" placeholder="VD: Năm kinh nghiệm" value={stat.label} onChange={e => handleUpdateStat(idx, 'label', e.target.value)} className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white outline-none" />
                  <button onClick={() => handleDeleteStat(idx)} className="text-red-500 hover:text-red-700 px-2 font-bold">✕</button>
                </div>
              ))}
            </div>
          </div>

          {/* PHẦN 3: GIÁ TRỊ CỐT LÕI */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-bold dark:text-white">C. Giá trị cốt lõi (Tín - Tâm - Tầm)</h4>
              <button onClick={handleAddCoreValue} className="text-sm text-blue-600 dark:text-blue-400 font-bold">+ Thêm giá trị</button>
            </div>
            <div className="space-y-3">
              {about.coreValues.map((item, idx) => (
                <div key={idx} className="flex gap-3 bg-gray-50 dark:bg-gray-900/50 p-3 rounded border dark:border-gray-700 items-start">
                  <div className="flex-1 space-y-2">
                    <input type="text" placeholder="Tiêu đề (VD: Tín)" value={item.title} onChange={e => handleUpdateCoreValue(idx, 'title', e.target.value)} className="w-full p-2 font-bold border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white outline-none" />
                    <textarea placeholder="Mô tả chi tiết..." value={item.desc} rows={2} onChange={e => handleUpdateCoreValue(idx, 'desc', e.target.value)} className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white outline-none" />
                  </div>
                  <button onClick={() => handleDeleteCoreValue(idx)} className="text-red-500 hover:text-red-700 px-2 py-1 font-bold">✕</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-right border-t border-gray-200 dark:border-gray-700 pt-4">
        <button onClick={handleSave} disabled={saving} className="bg-blue-600 text-white px-8 py-2.5 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition shadow-lg">
          {saving ? '⏳ Đang lưu...' : '💾 Lưu Trang Giới thiệu'}
        </button>
      </div>
    </section>
  );
};

export default AboutSettings;