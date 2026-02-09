// 1. SẢN PHẨM (DOOR)
export interface ProductSpecification {
  key: string;   // Ví dụ: "Kích thước phủ bì"
  value: string; // Ví dụ: "900 x 2200 mm"
}

export interface Door {
  id?: string;   // ID từ Firebase
  name: string;
  slug?: string; // Slug tạo tự động từ name
  category: string;
  type: 'door' | 'accessory';
  price: number;
  image: string;
  description: string;
  features?: string[];
  specifications?: ProductSpecification[]; 
  createdAt?: any; // Timestamp
}

// 2. LIÊN HỆ & THÔNG TIN WEB
export interface ContactRequest {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  message: string;
  createdAt?: any;
  status: 'new' | 'contacted' | 'spam';
}

export interface WebsiteInfo {
  companyName: string;
  address: string;
  phone: string;
  zalo: string;
  email: string;
  taxId: string; // MST
  facebook: string;
  mapIframe: string; // Link nhúng bản đồ Google
}

// --- CÁC INTERFACE MỚI CHO CMS (QUẢN TRỊ NỘI DUNG) ---

// 3. HERO SLIDER (Banner trang chủ)
export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  cta: string; // Chữ trên nút bấm (VD: Xem ngay)
  link: string; // Đường dẫn khi bấm nút
}

// 4. USP (Lợi thế cạnh tranh / Tại sao chọn chúng tôi)
export interface USP {
  id: string;
  icon: string; // Icon dạng text hoặc emoji
  title: string;
  desc: string;
}

// 5. PROJECT (Dự án tiêu biểu)
export interface Project {
  id: string;
  image: string;
  title: string;
  link?: string;
}

// 6. FAQ (Câu hỏi thường gặp)
export interface FAQ {
  id: string;
  q: string; // Câu hỏi
  a: string; // Câu trả lời
}

// 7. PROCESS (Quy trình làm việc)
export interface ProcessStep {
  id: string;
  step: string; // 01, 02...
  title: string;
  desc: string;
}

// 8. WARRANTY (Chính sách bảo hành)
export interface WarrantyPolicy {
  periods: { product: string; time: string; scope: string }[];
  conditions: string[];
  refusals: string[];
}

// 9. SYSTEM SETTINGS (TỔNG HỢP CẤU HÌNH)
export interface SystemSettings {
  // Cấu hình cũ
  categories?: string[];
  brands?: string[];
  websiteInfo?: WebsiteInfo;

  // Cấu hình mới (CMS)
  heroSlides?: HeroSlide[];
  usps?: USP[];
  projects?: Project[];
  faqs?: FAQ[];
  process?: ProcessStep[];
  warranty?: WarrantyPolicy;
}