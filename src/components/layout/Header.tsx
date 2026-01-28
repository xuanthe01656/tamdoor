import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

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
    { name: 'Sản Phẩm', path: '/san-pham' },
    { name: 'Về Chúng Tôi', path: '/ve-chung-toi' },
    { name: 'Liên Hệ', path: '/lien-he' },
  ];

  return (
    <>
      <header className={`fixed w-full top-0 left-0 z-[999] transition-all duration-300 ${
        isScrolled ? 'bg-white/95 shadow-md' : 'bg-white'
      }`}>
        {/* Container chính: Cần w-full để tràn canh, và mx-auto để cân giữa nội dung bên trong */}
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20 relative">
            
            {/* LOGO - Nằm sát trái */}
            <NavLink to="/" className="relative z-[1001] flex items-center space-x-2 shrink-0">
              <div className="w-9 h-9 bg-blue-700 flex items-center justify-center rounded-lg shadow-lg">
                <span className="text-white font-black text-lg">T</span>
              </div>
              <span className="text-xl font-bold tracking-tighter text-gray-900">
                TAM<span className="text-blue-700">DOOR</span>
              </span>
            </NavLink>
  
            {/* DESKTOP NAV - Căn giữa tuyệt đối so với màn hình */}
            <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center space-x-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) => `
                    px-4 py-2 rounded-full text-[13px] font-bold uppercase tracking-widest transition-all
                    ${isActive ? 'bg-blue-700 text-white shadow-md' : 'text-gray-600 hover:text-blue-700'}
                  `}
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>
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
  
      {/* OVERLAY MOBILE (Giữ nguyên) */}
      <div className={`fixed inset-0 z-[998] bg-white transition-transform duration-500 ease-in-out lg:hidden ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full justify-center items-center space-y-10">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `
                text-3xl font-black uppercase tracking-tighter transition-all
                ${isActive ? 'text-blue-700 scale-110' : 'text-gray-400'}
              `}
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
};

export default Header;