import { useState, useEffect } from 'react';
import { Project } from '../../../../interfaces/door';
import { doorService } from '../../../../services/doorService';

interface Props { initialData: Project[]; }

const ProjectSettings = ({ initialData }: Props) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (initialData) setProjects(initialData); }, [initialData]);

  const handleAdd = () => setProjects([...projects, { id: Date.now().toString(), title: '', image: '', link: '' }]);
  const handleUpdate = (id: string, field: keyof Project, value: string) => setProjects(projects.map(p => p.id === id ? { ...p, [field]: value } : p));
  const handleDelete = (id: string) => setProjects(projects.filter(p => p.id !== id));

  const handleSave = async () => {
    setSaving(true);
    await doorService.updateSettings({ projects });
    setSaving(false);
    alert('✅ Đã lưu cấu hình Dự án!');
  };

  return (
    <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold dark:text-blue-400">🏢 3. Dự án tiêu biểu</h3>
        <button onClick={handleAdd} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-bold shadow">+ Thêm Dự án</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((proj) => (
          <div key={proj.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-900/50">
            <div className="aspect-video bg-gray-200 dark:bg-gray-800 rounded mb-3 flex items-center justify-center overflow-hidden border dark:border-gray-700">
              {proj.image ? <img src={proj.image} alt="preview" className="w-full h-full object-cover" /> : <span className="text-xs text-gray-400">Ảnh dự án</span>}
            </div>
            <input type="text" placeholder="Link ảnh dự án" value={proj.image} onChange={e => handleUpdate(proj.id, 'image', e.target.value)} className="w-full p-2 mb-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" placeholder="Tên dự án" value={proj.title} onChange={e => handleUpdate(proj.id, 'title', e.target.value)} className="w-full p-2 mb-2 font-bold border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
            <div className="flex justify-between items-center mt-2">
              <input type="text" placeholder="Link bài viết (Tùy chọn)" value={proj.link || ''} onChange={e => handleUpdate(proj.id, 'link', e.target.value)} className="w-2/3 p-2 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
              <button onClick={() => handleDelete(proj.id)} className="text-red-500 hover:text-red-700 text-sm font-bold p-2">Xóa</button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-right border-t border-gray-200 dark:border-gray-700 pt-4">
        <button onClick={handleSave} disabled={saving} className="bg-blue-600 text-white px-8 py-2.5 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition shadow-lg">{saving ? '⏳ Đang lưu...' : '💾 Lưu Dự án'}</button>
      </div>
    </section>
  );
};
export default ProjectSettings;