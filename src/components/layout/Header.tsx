import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import logoFull from '../../assets/logo.png';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
  }, [isOpen]);

  const navLinks = [
    { name: 'Trang Chủ', path: '/' },
    { 
      name: 'Sản Phẩm', 
      path: '/san-pham',
      subMenu: [
        { name: 'Cửa Cao Cấp', path: '/san-pham?tab=door' },
        { name: 'Phụ Kiện', path: '/san-pham?tab=accessory' },
      ]
    },
    { name: 'Về Chúng Tôi', path: '/ve-chung-toi' },
    { name: 'Liên Hệ', path: '/lien-he' },
    { 
      name: 'Hỗ Trợ Khách Hàng',
      path: '#', // Tránh lỗi React Router khi path rỗng
      subMenu: [
        { name: 'Báo giá thi công', path: '/lien-he' },
        { name: 'Chính sách bảo hành', path: '/chinh-sach-bao-hanh' },
        { name: 'Quy trình làm việc', path: '/quy-trinh-lam-viec' },
        { name: 'Câu hỏi thường gặp', path: '/cau-hoi-thuong-gap' },
      ]
    },
  ];

  // Hàm kiểm tra Menu có đang Active hay không (Bao gồm kiểm tra cả menu con)
  const checkIsActive = (link: any) => {
    // 1. Kiểm tra nếu pathname trùng khớp hoàn toàn với link chính (trừ dấu #)
    if (link.path !== '#' && pathname === link.path) return true;
    
    // 2. Nếu có menu con, kiểm tra xem pathname hiện tại có thuộc menu con không
    if (link.subMenu) {
      // Loại bỏ phần query (ví dụ: ?tab=door) để so sánh chính xác pathname
      return link.subMenu.some((subItem: any) => pathname === subItem.path.split('?')[0]);
    }
    
    return false;
  };

  return (
    <>
      <header className={`fixed w-full top-0 left-0 z-[999] transition-all duration-300 ${
        isScrolled ? 'bg-white/95 shadow-md' : 'bg-white'
      }`}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-20">
            
            {/* LOGO */}
            <NavLink to="/" className="relative z-[1001] shrink-0">
              <img 
                src={logoFull} 
                alt="CasarDoor Logo" 
                className="h-12 md:h-16 lg:h-20 w-auto object-contain transition-all"
              />
            </NavLink>
  
            {/* DESKTOP NAV - Sử dụng flex-1 để tự động căn giữa trong khoảng trống còn lại */}
            <nav className="hidden lg:flex flex-1 justify-center items-center gap-1 xl:gap-2 pl-4">
              {navLinks.map((link) => (
                <div key={link.name} className="relative group">
                  {/* Link chính */}
                  <NavLink
                    to={link.path}
                    onClick={(e) => link.path === '#' && e.preventDefault()}
                    // Đã thay {({ isActive }) => ... } bằng hàm checkIsActive tự viết
                    className={() => `
                      px-3 xl:px-4 py-2.5 rounded-full text-[12px] xl:text-[13px] font-bold uppercase tracking-widest transition-all block whitespace-nowrap
                      ${checkIsActive(link) ? 'bg-[#003D20] text-white shadow-md' : 'text-gray-600 hover:text-blue-700'}
                    `}
                  >
                    {link.name}
                    {link.subMenu && (
                      <span className="ml-1.5 text-[10px] align-middle transition-transform duration-300 group-hover:rotate-180 inline-block">▼</span>
                    )}
                  </NavLink>

                  {/* Dropdown Menu Desktop */}
                  {link.subMenu && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 w-60">
                      <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden py-2">
                        {link.subMenu.map((subItem) => (
                          <NavLink
                            key={subItem.path}
                            to={subItem.path}
                            // Với menu con, ta vẫn dùng hàm mũi tên lấy isActive mặc định của NavLink hoặc tự bắt logic nếu cần
                            className={({ isActive }) => `
                              block px-6 py-3 text-xs font-bold uppercase tracking-wider transition-colors
                              ${isActive || pathname === subItem.path.split('?')[0] ? 'text-blue-700 bg-blue-50' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-700'}
                            `}
                          >
                            {subItem.name}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden w-12 h-12 relative z-[1001] flex items-center justify-end focus:outline-none"
              aria-label="Menu"
            >
              <div className="relative w-6 h-5">
                <span className={`absolute left-0 block w-6 h-0.5 bg-gray-900 transition-all duration-300 rounded-full ${
                  isOpen ? 'top-2 rotate-45' : 'top-0'
                }`}></span>
                <span className={`absolute left-0 top-2 block w-6 h-0.5 bg-gray-900 transition-all duration-300 rounded-full ${
                  isOpen ? 'opacity-0 invisible' : 'opacity-100'
                }`}></span>
                <span className={`absolute left-0 block w-6 h-0.5 bg-gray-900 transition-all duration-300 rounded-full ${
                  isOpen ? 'top-2 -rotate-45' : 'top-4'
                }`}></span>
              </div>
            </button>
          </div>
        </div>
      </header>
  
      {/* OVERLAY MOBILE */}
      <div className={`fixed inset-0 z-[998] bg-white transition-transform duration-500 ease-in-out lg:hidden ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full w-full overflow-y-auto pt-28 pb-10 items-center space-y-8 px-6">
          {navLinks.map((link) => (
            <div key={link.name} className="flex flex-col items-center w-full">
              <NavLink
                to={link.path}
                onClick={(e) => {
                  if (link.path === '#') e.preventDefault();
                  if (!link.subMenu) setIsOpen(false);
                }}
                // Cập nhật hàm active cho giao diện Mobile
                className={() => `
                  text-xl sm:text-2xl font-black uppercase tracking-tighter transition-all text-center
                  ${checkIsActive(link) ? 'text-blue-700 scale-105' : 'text-gray-800'}
                `}
              >
                {link.name}
              </NavLink>
              
              {/* Hiển thị SubMenu ở Mobile */}
              {link.subMenu && (
                <div className="flex flex-col items-center mt-4 space-y-4 w-full bg-gray-50 py-4 rounded-2xl">
                  {link.subMenu.map((subItem) => (
                    <NavLink
                      key={subItem.path}
                      to={subItem.path}
                      className={({ isActive }) => `
                        text-sm font-bold uppercase tracking-widest transition-colors text-center
                        ${isActive || pathname === subItem.path.split('?')[0] ? 'text-blue-700' : 'text-gray-500 hover:text-blue-700'}
                      `}
                      onClick={() => setIsOpen(false)}
                    >
                      {subItem.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Header;