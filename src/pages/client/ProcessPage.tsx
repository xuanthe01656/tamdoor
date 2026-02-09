import { useEffect, useState } from 'react';
import { doorService } from '../../services/doorService';
import { ProcessStep } from '../../interfaces/door';

const ProcessPage = () => {
  const [steps, setSteps] = useState<ProcessStep[]>([]);

  useEffect(() => { 
    window.scrollTo(0, 0); 
    
    // Hàm lấy dữ liệu (CMS hoặc Mock)
    const fetchData = async () => {
        const data = await doorService.getProcessSteps();
        setSteps(data);
    };
    fetchData();
  }, []);

  return (
    <div className="pt-24 pb-20 min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6">
        
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-gray-900 mb-6">
            Quy trình làm việc
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Quy trình chuẩn hóa giúp đảm bảo tiến độ và chất lượng hoàn hảo.
          </p>
        </div>

        <div className="relative">
          {/* Đường kẻ dọc (Trục giữa trên PC, Trục trái trên Mobile) */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-blue-100 md:-translate-x-1/2"></div>

          <div className="space-y-12">
            {steps.map((item, index) => (
              <div key={item.id || index} className={`relative flex items-center flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                
                {/* Content Box */}
                <div className="w-full md:w-1/2 pl-16 md:pl-0 md:px-12 mb-4 md:mb-0">
                  <div className={`bg-white p-6 rounded-2xl shadow-lg border border-gray-100 relative hover:-translate-y-1 transition-transform duration-300 group ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                    {/* Số bước mờ nền */}
                    <span className="text-5xl font-black text-blue-50 absolute -top-4 right-4 z-0 opacity-50 group-hover:text-blue-100 transition-colors select-none">
                        {item.step}
                    </span>
                    
                    <h3 className="text-xl font-bold text-blue-700 mb-2 relative z-10">{item.title}</h3>
                    <p className="text-gray-600 text-sm relative z-10 leading-relaxed">{item.desc}</p>
                  </div>
                </div>

                {/* Dot (Điểm tròn trên trục) */}
                <div className="absolute left-4 md:left-1/2 w-8 h-8 bg-blue-600 rounded-full border-4 border-white shadow-md -translate-x-1/2 flex items-center justify-center z-10">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                
                {/* Space holder (Khoảng trống đối diện để cân bằng layout 50-50 trên PC) */}
                <div className="w-full md:w-1/2 hidden md:block"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessPage;