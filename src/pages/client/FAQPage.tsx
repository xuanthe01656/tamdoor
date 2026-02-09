import { useState, useEffect } from 'react';
import { doorService } from '../../services/doorService';
import { FAQ, WebsiteInfo } from '../../interfaces/door';

const FAQPage = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [info, setInfo] = useState<WebsiteInfo | null>(null); // State lưu thông tin web (SĐT)
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => { 
    window.scrollTo(0, 0);

    const fetchData = async () => {
        // 1. Lấy danh sách câu hỏi
        const faqData = await doorService.getFAQs();
        setFaqs(faqData);

        // 2. Lấy thông tin cấu hình (để hiển thị số điện thoại)
        const settings = await doorService.getSettings();
        if (settings?.websiteInfo) {
            setInfo(settings.websiteInfo);
        }
    };
    fetchData();
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6">
        
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-black uppercase text-gray-900 mb-4">Câu hỏi thường gặp</h1>
          <p className="text-gray-600">Giải đáp nhanh các thắc mắc về sản phẩm và dịch vụ</p>
        </div>

        <div className="space-y-4">
          {faqs.map((item, index) => (
            <div 
              key={item.id || index} // Dùng ID nếu có, fallback index
              className={`border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 ${openIndex === index ? 'shadow-lg border-blue-200' : 'hover:border-blue-300'}`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-5 bg-white text-left focus:outline-none"
              >
                <span className={`font-bold text-lg pr-4 ${openIndex === index ? 'text-blue-700' : 'text-gray-800'}`}>
                  {item.q}
                </span>
                <span className={`transform transition-transform duration-300 text-2xl text-blue-500 font-light flex-shrink-0 ${openIndex === index ? 'rotate-180' : ''}`}>
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              
              <div 
                className={`bg-gray-50 px-5 text-gray-600 text-sm leading-relaxed overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 py-5 opacity-100' : 'max-h-0 py-0 opacity-0'
                }`}
              >
                {/* Cho phép xuống dòng nếu trong câu trả lời có ký tự xuống dòng */}
                <div className="whitespace-pre-line">
                    {item.a}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Box (Số điện thoại động) */}
        <div className="mt-12 bg-blue-50 p-6 rounded-xl text-center border border-blue-100">
          <p className="font-bold text-gray-900 mb-2">Bạn vẫn còn thắc mắc khác?</p>
          <a href={`tel:${info?.phone}`} className="text-blue-700 font-black text-lg hover:underline block">
            Gọi ngay: {info?.phone || 'ĐANG CẬP NHẬT'}
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;