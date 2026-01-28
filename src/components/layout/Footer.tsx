// src/components/layout/Footer.tsx
const Footer = () => {
    return (
      <footer className="bg-[#0f172a] text-gray-400 pt-20 pb-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white">T</div>
              <span className="text-2xl font-bold text-white tracking-tight">TAMDOOR</span>
            </div>
            <p className="text-sm leading-relaxed">
              Tiên phong trong giải pháp cửa cao cấp tại Việt Nam. Chúng tôi kiến tạo không gian sống hiện đại và an toàn.
            </p>
          </div>
  
          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Sản phẩm chính</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-blue-500 transition-colors">Cửa Nhôm Xingfa</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Cửa Cuốn Công Nghệ Đức</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Cửa Kính Cường Lực</a></li>
            </ul>
          </div>
  
          {/* Support */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Hỗ trợ</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-blue-500 transition-colors">Báo giá thi công</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Chính sách bảo hành</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Quy trình làm việc</a></li>
            </ul>
          </div>
  
          {/* Contact */}
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Liên hệ trực tiếp</h4>
            <div className="space-y-3">
              <p className="text-sm text-blue-400 font-bold italic">Hotline Miền Nam:</p>
              <p className="text-white font-bold text-lg">0901 234 567</p>
              <p className="text-xs">Đ/c: 123 Đường TamDoor, TP. Hồ Chí Minh</p>
            </div>
          </div>
        </div>
  
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-[0.2em]">
          <p>© 2026 TamDoor - Premium Door Solutions</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Facebook</a>
            <a href="#" className="hover:text-white">Youtube</a>
            <a href="#" className="hover:text-white">Zalo</a>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;