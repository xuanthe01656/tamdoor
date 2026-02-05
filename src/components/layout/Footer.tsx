import { Link } from 'react-router-dom';
import { COMPANY_INFO } from '../../data/companyInfo';

const Footer = () => {
  return (
    <footer className="bg-[#0f172a] text-gray-400 pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* 1. BRAND INFO */}
        <div className="space-y-6">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white group-hover:bg-blue-500 transition-colors">
              {COMPANY_INFO.brandName.charAt(0)}
            </div>
            <span className="text-2xl font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors">
              {COMPANY_INFO.brandName}
            </span>
          </Link>
          <p className="text-sm leading-relaxed text-gray-500">
            Tiên phong trong giải pháp cửa cao cấp tại Việt Nam. Chúng tôi kiến tạo không gian sống hiện đại, an toàn và đầy cảm hứng.
          </p>
        </div>

        {/* 2. SẢN PHẨM CHÍNH (Load từ Config) */}
        <div>
          <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest border-b border-blue-900/50 pb-2 inline-block">
            Sản phẩm nổi bật
          </h4>
          <ul className="space-y-4 text-sm">
            {COMPANY_INFO.footerLinks.products.map((item, index) => (
              <li key={index}>
                <Link to={item.link} className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-blue-500 transition-colors"></span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* 3. HỖ TRỢ (Load từ Config) */}
        <div>
          <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest border-b border-blue-900/50 pb-2 inline-block">
            Hỗ trợ khách hàng
          </h4>
          <ul className="space-y-4 text-sm">
            {COMPANY_INFO.footerLinks.support.map((item, index) => (
              <li key={index}>
                <Link to={item.link} className="hover:text-blue-400 transition-colors">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* 4. CONTACT INFO (Load từ Config) */}
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-blue-500/30 transition-colors">
          <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">
            Liên hệ trực tiếp
          </h4>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-blue-400 font-bold uppercase mb-1">Hotline tư vấn</p>
              <a 
                href={`tel:${COMPANY_INFO.hotline.replace(/\s/g, '')}`} 
                className="text-white font-black text-xl hover:text-blue-400 transition-colors"
              >
                {COMPANY_INFO.hotline}
              </a>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Email</p>
              <a href={`mailto:${COMPANY_INFO.email}`} className="text-sm hover:text-blue-400">
                {COMPANY_INFO.email}
              </a>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Showroom</p>
              <p className="text-sm leading-tight text-gray-300">
                {COMPANY_INFO.address}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-[0.2em] text-gray-600">
        <p>© 2026 {COMPANY_INFO.brandName} - Premium Door Solutions</p>
        
        <div className="flex space-x-8 mt-4 md:mt-0">
          <a href={COMPANY_INFO.socials.facebook} target="_blank" rel="noreferrer" className="hover:text-blue-500 transition-colors">Facebook</a>
          <a href="#" className="hover:text-red-500 transition-colors">Youtube</a>
          <a href={COMPANY_INFO.socials.zalo} target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">Zalo</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;