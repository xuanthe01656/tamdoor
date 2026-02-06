export interface ProductSpecification {
  key: string;   // Ví dụ: "Kích thước phủ bì"
  value: string; // Ví dụ: "900 x 2200 mm"
}

export interface Door {
  id: string;
  name: string;
  slug: string;
  category: string;
  type: 'door' | 'accessory';
  price: number;
  image: string;
  description: string;
  features?: string[];
  specifications?: ProductSpecification[]; 
  createdAt: number;
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

// Cập nhật lại interface Settings cũ (nếu đã có)
export interface SystemSettings {
  categories?: string[];
  brands?: string[];
  websiteInfo?: WebsiteInfo; // Thêm dòng này
}
export interface ContactRequest {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  message: string;
  createdAt?: any;
  status: 'new' | 'contacted' | 'spam';
}