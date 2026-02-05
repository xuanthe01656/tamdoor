import { useState, useEffect } from 'react';
import { doorService, FAQItem } from '../../services/doorService';

const FAQPage = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => { 
    window.scrollTo(0, 0);
    doorService.getFAQs().then(data => setFaqs(data));
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
              key={index} 
              className={`border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 ${openIndex === index ? 'shadow-lg border-blue-200' : 'hover:border-blue-300'}`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-5 bg-white text-left focus:outline-none"
              >
                <span className={`font-bold text-lg ${openIndex === index ? 'text-blue-700' : 'text-gray-800'}`}>
                  {item.q}
                </span>
                <span className={`transform transition-transform duration-300 text-2xl text-blue-500 ${openIndex === index ? 'rotate-180' : ''}`}>
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              
              <div 
                className={`bg-gray-50 px-5 text-gray-600 text-sm leading-relaxed overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-40 py-5 opacity-100' : 'max-h-0 py-0 opacity-0'
                }`}
              >
                {item.a}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Box */}
        <div className="mt-12 bg-blue-50 p-6 rounded-xl text-center border border-blue-100">
          <p className="font-bold text-gray-900 mb-2">Bạn vẫn còn thắc mắc khác?</p>
          <a href="tel:0901234567" className="text-blue-700 font-black text-lg hover:underline">
            Gọi ngay: 0901 234 567
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;