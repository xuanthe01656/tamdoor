import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import logoFull from '../../assets/logo.png'

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

  // Cập nhật cấu trúc NavLinks có thêm subMenu
  const navLinks = [
    { name: 'Trang Chủ', path: '/' },
    { 
      name: 'Sản Phẩm', 
      path: '/san-pham',
      // Thêm menu con
      subMenu: [
        { name: 'Cửa Cao Cấp', path: '/san-pham?tab=door' },
        { name: 'Phụ Kiện', path: '/san-pham?tab=accessory' },
      ]
    },
    { name: 'Về Chúng Tôi', path: '/ve-chung-toi' },
    { name: 'Liên Hệ', path: '/lien-he' },
  ];

  return (
    <>
      <header className={`fixed w-full top-0 left-0 z-[999] transition-all duration-300 ${
        isScrolled ? 'bg-white/95 shadow-md' : 'bg-white'
      }`}>
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20 relative">
            
            {/* LOGO */}
            <NavLink to="/" className="relative z-[1001] shrink-0">
              <img 
                src={logoFull} 
                alt="CasarDoor Logo" 
                className="h-14 md:h-20 w-auto object-contain"
              />
            </NavLink>
  
            {/* DESKTOP NAV - Có Dropdown */}
            <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center space-x-2">
              {navLinks.map((link) => (
                <div key={link.path} className="relative group">
                  {/* Link chính */}
                  <NavLink
                    to={link.path}
                    className={({ isActive }) => `
                      px-5 py-2.5 rounded-full text-[13px] font-bold uppercase tracking-widest transition-all block
                      ${isActive ? 'bg-blue-700 text-white shadow-md' : 'text-gray-600 hover:text-blue-700'}
                    `}
                  >
                    {link.name}
                    {/* Mũi tên nhỏ chỉ xuống nếu có subMenu */}
                    {link.subMenu && (
                      <span className="ml-1 text-[10px] align-middle">▼</span>
                    )}
                  </NavLink>

                  {/* Dropdown Menu (Chỉ hiện khi hover vào group) */}
                  {link.subMenu && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 w-48">
                      {/* Container trắng của Dropdown */}
                      <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden py-2">
                        {link.subMenu.map((subItem) => (
                          <NavLink
                            key={subItem.path}
                            to={subItem.path}
                            className={({ isActive }) => `
                              block px-6 py-3 text-xs font-bold uppercase tracking-wider transition-colors
                              ${isActive ? 'text-blue-700 bg-blue-50' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-700'}
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
              className="lg:hidden w-12 h-12 relative z-[1001] flex items-center justify-center focus:outline-none ml-auto"
              aria-label="Menu"
            >
              <div className="relative w-6 h-5">
                <span className={`absolute left-0 block w-6 h-1 bg-gray-900 transition-all duration-300 rounded-full ${
                  isOpen ? 'top-2 rotate-45' : 'top-0'
                }`}></span>
                <span className={`absolute left-0 top-2 block w-6 h-1 bg-gray-900 transition-all duration-300 rounded-full ${
                  isOpen ? 'opacity-0 invisible' : 'opacity-100'
                }`}></span>
                <span className={`absolute left-0 block w-6 h-1 bg-gray-900 transition-all duration-300 rounded-full ${
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
        <div className="flex flex-col h-full justify-center items-center space-y-8">
          {navLinks.map((link) => (
            <div key={link.path} className="flex flex-col items-center">
              <NavLink
                to={link.path}
                className={({ isActive }) => `
                  text-2xl font-black uppercase tracking-tighter transition-all
                  ${isActive ? 'text-blue-700 scale-110' : 'text-gray-400'}
                `}
                onClick={() => !link.subMenu && setIsOpen(false)} // Đóng menu nếu không có subMenu
              >
                {link.name}
              </NavLink>
              
              {/* Hiển thị luôn subMenu ở Mobile cho dễ bấm */}
              {link.subMenu && (
                <div className="flex flex-col items-center mt-4 space-y-3">
                  {link.subMenu.map((subItem) => (
                    <NavLink
                      key={subItem.path}
                      to={subItem.path}
                      className="text-sm font-bold uppercase text-gray-500 tracking-widest hover:text-blue-700"
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