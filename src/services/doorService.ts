import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit as fireLimit,
  deleteDoc, 
  doc,
  addDoc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
// Lưu ý: Đã xóa import firebase/storage vì dùng Cloudinary
import { db } from '../config/firebase';

import { Door } from '../interfaces/door';
import { HeroSlide } from '../interfaces/hero';

// Import dữ liệu CMS tĩnh
import { 
  MOCK_SLIDES, 
  MOCK_ADVANTAGES, 
  MOCK_PROJECTS,
  MOCK_FAQS,       
  MOCK_PROCESS,    
  MOCK_WARRANTY    
} from '../data/mockCMS';

// --- ĐỊNH NGHĨA TYPES (INTERFACES) ---

export interface Advantage {
  icon: string;
  title: string;
  desc: string;
}

export interface Project {
  image: string;
  title: string;
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  desc: string;
}

export interface WarrantyPolicy {
  periods: { product: string; time: string; scope: string }[];
  conditions: string[];
  refusals: string[];
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  currentPage: number;
  totalPages: number;
}

// --- THÊM MỚI: Interface cho Settings & Footer ---
export interface WebsiteInfo {
  companyName: string;
  address: string;
  phone: string;
  zalo: string;
  email: string;
  taxId: string;
  facebook: string;
  mapIframe: string;
}

export interface SystemSettings {
  categories?: string[];
  brands?: string[];
  websiteInfo?: WebsiteInfo;
}

const COLLECTION_NAME = 'products';

// --- SERVICE LOGIC ---
export const doorService = {
  // ==========================================
  // A. NHÓM API SẢN PHẨM (REALTIME FIREBASE)
  // ==========================================

  // 1. Lấy toàn bộ sản phẩm
  getAllProducts: async (): Promise<Door[]> => {
    try {
      const snapshot = await getDocs(collection(db, COLLECTION_NAME));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Door));
    } catch (error) {
      console.error("Lỗi lấy danh sách sản phẩm:", error);
      return [];
    }
  },

  // 2. Lấy sản phẩm theo type ('door' | 'accessory')
  getProductsByType: async (type: 'door' | 'accessory'): Promise<Door[]> => {
    try {
      const q = query(collection(db, COLLECTION_NAME), where("type", "==", type));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Door));
    } catch (error) {
      console.error(`Lỗi lấy sản phẩm type ${type}:`, error);
      return [];
    }
  },

  // 3. Lấy chi tiết sản phẩm theo slug
  getProductBySlug: async (slug: string): Promise<Door | undefined> => {
    try {
      const q = query(collection(db, COLLECTION_NAME), where("slug", "==", slug), fireLimit(1));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() } as Door;
      }
      return undefined;
    } catch (error) {
      console.error("Lỗi lấy chi tiết sản phẩm:", error);
      return undefined;
    }
  },

  // 4. Lấy sản phẩm nổi bật (MỚI NHẤT)
  getFeaturedProducts: async (limitVal: number = 8): Promise<Door[]> => {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("type", "==", "door"),
        orderBy("createdAt", "desc"), 
        fireLimit(limitVal)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Door));
    } catch (error) {
      console.warn("Lỗi Featured (Fallback client sort):", error);
      // Fallback: Nếu chưa có Index, lấy về client rồi tự sort
      const allDocs = await getDocs(collection(db, COLLECTION_NAME));
      return allDocs.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Door))
        .filter(p => p.type === 'door')
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
        .slice(0, limitVal);
    }
  },

  // 5. Tìm kiếm sản phẩm (Client-side search)
  searchProducts: async (keyword: string): Promise<Door[]> => {
    try {
      const snapshot = await getDocs(collection(db, COLLECTION_NAME));
      const allProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Door));
      
      const lowerKeyword = keyword.toLowerCase().trim();
      return allProducts.filter(
        (item) =>
          item.name.toLowerCase().includes(lowerKeyword) ||
          item.category.toLowerCase().includes(lowerKeyword)
      );
    } catch (error) {
      return [];
    }
  },

  // 6. Lấy danh sách phân trang
  getProductsPaginated: async (
    type: 'door' | 'accessory', 
    page: number = 1, 
    limitVal: number = 8
  ): Promise<PaginatedResult<Door>> => {
    try {
      const q = query(collection(db, COLLECTION_NAME), where("type", "==", type));
      const snapshot = await getDocs(q);
      const allItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Door));

      // Sắp xếp MỚI NHẤT lên đầu
      allItems.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

      const total = allItems.length;
      const totalPages = Math.ceil(total / limitVal);
      const startIndex = (page - 1) * limitVal;
      const endIndex = startIndex + limitVal;
      
      const data = allItems.slice(startIndex, endIndex);

      return { data, total, currentPage: page, totalPages };
    } catch (error) {
      console.error("Lỗi phân trang:", error);
      return { data: [], total: 0, currentPage: 1, totalPages: 0 };
    }
  },

  // ==========================================
  // B. NHÓM API NỘI DUNG (MOCK DATA)
  // ==========================================

  // 7-12: Giữ nguyên Mock Data
  getHeroSlides: async (): Promise<HeroSlide[]> => Promise.resolve(MOCK_SLIDES),
  getAdvantages: async (): Promise<Advantage[]> => Promise.resolve(MOCK_ADVANTAGES),
  getProjects: async (limit: number = 6): Promise<Project[]> => Promise.resolve(MOCK_PROJECTS.slice(0, limit)),
  getFAQs: async (): Promise<FAQItem[]> => Promise.resolve(MOCK_FAQS),
  getProcessSteps: async (): Promise<ProcessStep[]> => Promise.resolve(MOCK_PROCESS),
  getWarrantyPolicy: async (): Promise<WarrantyPolicy> => Promise.resolve(MOCK_WARRANTY),

  // ==========================================
  // C. NHÓM API QUẢN TRỊ (CRUD)
  // ==========================================

  // 13. Xóa sản phẩm
  deleteProduct: async (id: string): Promise<boolean> => {
    try {
      if (!id) return false;
      await deleteDoc(doc(db, COLLECTION_NAME, id));
      return true;
    } catch (error) {
      console.error("Lỗi xóa sản phẩm:", error);
      return false;
    }
  },

  // 14. Thêm sản phẩm mới
  addProduct: async (productData: any): Promise<boolean> => {
    try {
      const dataToSave = {
        ...productData,
        createdAt: serverTimestamp(),
        slug: productData.name
            .toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/ /g, "-")
            .replace(/[^\w-]+/g, "") // Loại bỏ ký tự đặc biệt
      };

      await addDoc(collection(db, COLLECTION_NAME), dataToSave);
      return true;
    } catch (error) {
      console.error("Lỗi thêm sản phẩm:", error);
      return false;
    }
  },

  // 15. Lấy chi tiết 1 sản phẩm theo ID
  getProductById: async (id: string) => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as any;
      }
      return null;
    } catch (error) {
      console.error("Lỗi lấy sản phẩm:", error);
      return null;
    }
  },

  // 16. Cập nhật sản phẩm
  updateProduct: async (id: string, data: any) => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      return false;
    }
  },

  // ==========================================
  // D. NHÓM API CẤU HÌNH & FOOTER (SETTINGS)
  // ==========================================

  // 17. Lấy Settings (Gộp chung: Danh mục, Thương hiệu, WebsiteInfo)
  getSettings: async (): Promise<SystemSettings> => {
    try {
      const docRef = doc(db, 'settings', 'general');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as SystemSettings;
      } else {
        // Trả về mặc định nếu chưa có DB
        return {
          categories: ["Cửa nhựa Composite", "Cửa thép vân gỗ", "Phụ kiện cửa"],
          brands: ["Sungyu", "KOS", "Huy Hoàng"],
          websiteInfo: {} as WebsiteInfo
        };
      }
    } catch (error) {
      console.error("Lỗi lấy settings:", error);
      return { categories: [], brands: [], websiteInfo: {} as WebsiteInfo };
    }
  },

  // 18. Lưu Danh mục & Thương hiệu
  saveSettings: async (data: any) => {
    try {
      await setDoc(doc(db, 'settings', 'general'), data, { merge: true });
      return true;
    } catch (error) {
      console.error("Lỗi lưu settings:", error);
      return false;
    }
  },

  // 19. Lưu thông tin Website (Footer, Liên hệ...)
  saveWebsiteInfo: async (info: WebsiteInfo) => {
    try {
      const docRef = doc(db, 'settings', 'general');
      await setDoc(docRef, { websiteInfo: info }, { merge: true });
      return true;
    } catch (error) {
      console.error("Lỗi lưu thông tin web:", error);
      return false;
    }
  },

  // ==========================================
  // E. NHÓM API UPLOAD & EXCEL
  // ==========================================

  // 20. Upload ảnh lên Cloudinary (Không cần thẻ Visa)
  uploadImage: async (file: File): Promise<string | null> => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      console.error("❌ CHƯA CẤU HÌNH .ENV: Vui lòng kiểm tra file .env");
      alert("Lỗi cấu hình hệ thống (Thiếu Cloudinary Config)");
      return null;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'casardoor_products'); 

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Lỗi upload Cloudinary');
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Lỗi upload ảnh:", error);
      return null;
    }
  },

  // 21. Bulk Insert (Dùng cho Excel)
  addMultipleProducts: async (products: any[]) => {
    let successCount = 0;
    let failCount = 0;

    for (const product of products) {
      try {
        await doorService.addProduct(product);
        successCount++;
      } catch (e) {
        failCount++;
      }
    }
    return { successCount, failCount };
  }
};