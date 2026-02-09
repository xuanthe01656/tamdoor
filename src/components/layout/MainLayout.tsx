import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import FloatingContact from '../client/FloatingContact';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-grow bg-white">
        <Outlet />
      </main>
      <Footer />
      <FloatingContact />
    </div>
  );
};

export default MainLayout;