import { useState, useEffect } from 'react';
import { doorService } from '../../services/doorService';

const Catalogue = () => {
  const [pdfUrl, setPdfUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPdf = async () => {
      const settings = await doorService.getSettings();
      // Lấy link PDF từ CMS (ví dụ: settings.companyInfo.catalogueUrl)
      setPdfUrl(settings.companyInfo?.catalogueUrl || '');
      setLoading(false);
    };
    loadPdf();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 pt-32 pb-10 flex flex-col">
      <div className="max-w-7xl mx-auto px-4 w-full flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white uppercase tracking-widest">Catalogue 2026</h1>
        {pdfUrl && (
          <a href={pdfUrl} target="_blank" rel="noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-bold text-sm transition-all shadow-lg">
            Tải về PDF
          </a>
        )}
      </div>

      <div className="flex-grow max-w-7xl mx-auto w-full px-4">
        {loading ? (
          <div className="w-full h-[70vh] bg-gray-800 animate-pulse rounded-2xl" />
        ) : pdfUrl ? (
          <div className="w-full h-[80vh] rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
             <iframe src={`${pdfUrl}#toolbar=0`} className="w-full h-full" title="Catalogue"></iframe>
          </div>
        ) : (
          <div className="text-center text-gray-400 py-20">Đang cập nhật tài liệu...</div>
        )}
      </div>
    </div>
  );
};

export default Catalogue;