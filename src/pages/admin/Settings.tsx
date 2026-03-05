import { useState, useEffect } from 'react';
import { doorService } from '../../services/doorService';

// Import các component con
import CompanyInfoSettings from './components/settings/CompanyInfoSettings';
import AboutSettings from './components/settings/AboutSettings';
import CategoryBrandSettings from './components/settings/CategoryBrandSettings';
import HeroSettings from './components/settings/HeroSettings';
import UspSettings from './components/settings/UspSettings';
import ProjectSettings from './components/settings/ProjectSettings';
import ProcessSettings from './components/settings/ProcessSettings';
import FaqSettings from './components/settings/FaqSettings';
import WarrantySettings from './components/settings/WarrantySettings';
import PublicationSettings from './components/settings/PublicationSettings';

// Định nghĩa danh sách các Tab
const TABS = [
  { id: 'hero', label: '🖼️ Banner' },
  { id: 'usp', label: '⭐ Lợi thế (USP)' },
  { id: 'project', label: '🏢 Dự án' },
  { id: 'process', label: '🔄 Quy trình' },
  { id: 'faq', label: '❓ FAQ' },
  { id: 'warranty', label: '🛡️ Bảo hành' },
  { id: 'category', label: '🏷️ Phân loại SP' },
  { id: 'general', label: '🏢 Thông tin chung' },
  { id: 'about', label: 'ℹ️ Giới thiệu' },
  { id: 'publication', label: '📚 Ấn phẩm' }
];

const Settings = () => {
  const [settingsData, setSettingsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // State quản lý Tab đang mở, mặc định là 'general'
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  // Lấy dữ liệu CMS 1 lần duy nhất khi vào trang
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      const data = await doorService.getSettings();
      setSettingsData(data);
      setLoading(false);
    };
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <div className="p-6 h-screen flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold text-xl">
        <span className="animate-pulse">⏳ Đang tải cấu hình hệ thống...</span>
      </div>
    );
  }

  // Hàm render nội dung tùy theo Tab đang chọn
  const renderTabContent = () => {
    switch (activeTab) {
     
        case 'hero':
            return <HeroSettings initialData={settingsData?.heroSlides || []} />;
        case 'usp':
            return <UspSettings initialData={settingsData?.usps || []} />;
        case 'project':
            return <ProjectSettings initialData={settingsData?.projects || []} />;
        case 'process':
            return <ProcessSettings initialData={settingsData?.process || []} />;
        case 'faq':
            return <FaqSettings initialData={settingsData?.faqs || []} />;
        case 'warranty':
            return <WarrantySettings initialData={settingsData?.warranty || { periods: [], conditions: [], refusals: [] }} />;
        case 'category':
            return <CategoryBrandSettings />
        case 'general':
            return <CompanyInfoSettings initialData={settingsData?.companyInfo} />;
        case 'about':
            return <AboutSettings initialData={settingsData?.about} />;
        case 'publication':
            return <PublicationSettings 
                      initialFilms={settingsData?.colorFilms || []} 
                      initialCatalogue={settingsData?.companyInfo?.catalogueUrl || ''} 
                   />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 md:p-6 pb-24 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-black text-gray-800 dark:text-white">Quản trị CMS</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Cập nhật nội dung hiển thị trên giao diện website của bạn.</p>
      </div>

      {/* THANH ĐIỀU HƯỚNG TAB */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 overflow-x-auto hide-scrollbar">
        <div className="flex w-max min-w-full">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-3 px-4 text-sm font-bold whitespace-nowrap transition-all border-b-2 outline-none
                ${activeTab === tab.id 
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* NỘI DUNG CỦA TAB ĐƯỢC CHỌN */}
      <div className="animate-fadeIn">
        {renderTabContent()}
      </div>

      {/* Thêm chút CSS để ẩn thanh cuộn cho thanh Tab trên mobile */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Settings;