import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { doorService, WarrantyPolicy } from '../../services/doorService';

const WarrantyPage = () => {
  const [policy, setPolicy] = useState<WarrantyPolicy | null>(null);

  useEffect(() => { 
    window.scrollTo(0, 0);
    doorService.getWarrantyPolicy().then(data => setPolicy(data));
  }, []);

  if (!policy) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="pt-24 pb-20 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6">
        
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-black uppercase text-gray-900 mb-4">Chính sách bảo hành</h1>
          <p className="text-gray-600">Cam kết chất lượng và dịch vụ hậu mãi uy tín.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          
          {/* Section 1: Thời gian bảo hành */}
          <div className="p-8 border-b border-gray-100">
            <h2 className="text-xl font-bold text-blue-700 mb-6">1. Thời gian bảo hành</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
                    <th className="p-4 rounded-tl-lg">Sản phẩm</th>
                    <th className="p-4">Thời hạn</th>
                    <th className="p-4 rounded-tr-lg">Phạm vi</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-600">
                  {policy.periods.map((p, idx) => (
                    <tr key={idx} className="border-b border-gray-100 last:border-0">
                      <td className="p-4 font-bold">{p.product}</td>
                      <td className="p-4 text-blue-600 font-bold">{p.time}</td>
                      <td className="p-4">{p.scope}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Điều kiện */}
          <div className="p-8 border-b border-gray-100 bg-blue-50/30">
            <h2 className="text-xl font-bold text-blue-700 mb-4">2. Điều kiện bảo hành hợp lệ</h2>
            <ul className="list-disc pl-5 space-y-3 text-gray-700 text-sm leading-relaxed">
              {policy.conditions.map((item, idx) => <li key={idx}>{item}</li>)}
            </ul>
          </div>

          {/* Section 3: Từ chối bảo hành */}
          <div className="p-8">
            <h2 className="text-xl font-bold text-red-600 mb-4">3. Trường hợp từ chối bảo hành</h2>
            <ul className="list-disc pl-5 space-y-3 text-gray-700 text-sm leading-relaxed">
              {policy.refusals.map((item, idx) => <li key={idx}>{item}</li>)}
            </ul>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link to="/lien-he" className="inline-block px-8 py-3 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-800 transition-all">
            Gửi yêu cầu bảo hành
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WarrantyPage;