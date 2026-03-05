import { useState, useEffect } from 'react';
import { doorService } from '../../services/doorService';

const ColorFilm = () => {
  const [films, setFilms] = useState<{name: string, image: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFilms = async () => {
      const settings = await doorService.getSettings();
      // Giả sử bạn lưu mảng màu film trong settings.colorFilms
      setFilms(settings.colorFilms || []);
      setLoading(false);
    };
    loadFilms();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 text-center mb-16">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Bảng Màu Film</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">Khám phá bộ sưu tập vân gỗ và màu sắc đa dạng, mang lại vẻ đẹp đẳng cấp cho không gian sống.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {films.map((film, idx) => (
              <div key={idx} className="group bg-white p-2 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="aspect-square overflow-hidden rounded-xl mb-3">
                  <img src={film.image} alt={film.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="font-bold text-sm text-center py-2 uppercase tracking-tight">{film.name}</h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorFilm;