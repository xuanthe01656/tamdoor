import { useState } from 'react';
import { doorService } from '../../../../services/doorService';

interface Props {
  initialFilms: { name: string; image: string }[];
  initialCatalogue: string;
}

const PublicationSettings = ({ initialFilms, initialCatalogue }: Props) => {
  const [films, setFilms] = useState(initialFilms);
  const [catalogueUrl, setCatalogueUrl] = useState(initialCatalogue);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleAddFilm = () => setFilms([...films, { name: '', image: '' }]);

  const handleUploadFilmImage = async (index: number, file: File) => {
    setUploading(true);
    const url = await doorService.uploadImage(file);
    if (url) {
      const newFilms = [...films];
      newFilms[index].image = url;
      setFilms(newFilms);
    }
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    // Cập nhật cả colorFilms và catalogueUrl (nằm trong companyInfo)
    await doorService.updateSettings({
      colorFilms: films.filter(f => f.name && f.image),
      companyInfo: { catalogueUrl: catalogueUrl } // Sẽ merge vào companyInfo hiện có nhờ merge: true trong service
    });
    setSaving(false);
    alert("✅ Đã cập nhật Ấn phẩm!");
  };

  return (
    <div className="space-y-8">
      {/* 1. QUẢN LÝ CATALOGUE */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
        <h3 className="text-lg font-bold mb-4 dark:text-white">📄 Tài liệu Catalogue (PDF)</h3>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase">Đường dẫn file PDF (Google Drive/Cloudinary...)</label>
          <input 
            type="text" 
            value={catalogueUrl} 
            onChange={e => setCatalogueUrl(e.target.value)}
            placeholder="Dán link PDF tại đây..."
            className="w-full p-3 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </section>

      {/* 2. QUẢN LÝ MÀU FILM */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold dark:text-white">🎨 Bộ sưu tập Màu Film</h3>
          <button onClick={handleAddFilm} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold">+ Thêm màu</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {films.map((film, idx) => (
            <div key={idx} className="relative border dark:border-gray-700 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
              <button 
                onClick={() => setFilms(films.filter((_, i) => i !== idx))}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs shadow-lg z-10"
              >✕</button>
              
              <div className="aspect-square bg-white dark:bg-gray-700 rounded-lg mb-3 overflow-hidden border-2 border-dashed border-gray-200 dark:border-gray-600 relative group">
                {film.image ? (
                  <img src={film.image} className="w-full h-full object-cover" alt="Film preview" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs text-center p-2">Chưa có ảnh</div>
                )}
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={e => e.target.files && handleUploadFilmImage(idx, e.target.files[0])}
                />
              </div>

              <input 
                type="text" 
                value={film.name}
                onChange={e => {
                  const newFilms = [...films];
                  newFilms[idx].name = e.target.value;
                  setFilms(newFilms);
                }}
                placeholder="Tên màu (VD: Walnut 01)"
                className="w-full p-2 text-xs font-bold border dark:border-gray-600 rounded bg-white dark:bg-gray-800 dark:text-white outline-none"
              />
            </div>
          ))}
        </div>
      </section>

      <div className="text-right">
        <button 
          onClick={handleSave} 
          disabled={saving || uploading}
          className="bg-blue-700 text-white px-10 py-3 rounded-xl font-black shadow-lg hover:bg-blue-800 transition-all disabled:opacity-50"
        >
          {saving ? '⏳ ĐANG LƯU...' : '💾 LƯU ẤN PHẨM'}
        </button>
      </div>
    </div>
  );
};

export default PublicationSettings;