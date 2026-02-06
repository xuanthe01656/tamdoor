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
  setDoc, getDoc,updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from '../config/firebase';

import { Door } from '../interfaces/door';
import { HeroSlide } from '../interfaces/hero';

// Import dữ liệu CMS tĩnh (Banner, FAQ...) từ Mock
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

  // 4. Lấy sản phẩm nổi bật (ĐÃ SỬA: Lấy MỚI NHẤT thay vì Giá cao)
  getFeaturedProducts: async (limitVal: number = 8): Promise<Door[]> => {
    try {
      // Logic mới: Lấy sản phẩm Cửa mới nhập về (dựa vào createdAt giảm dần)
      // Firebase yêu cầu tạo Index cho query này (Type + CreatedAt).
      // Nếu lỗi, mở Console trình duyệt click link Firebase cung cấp để tạo Index.
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
        .sort((a, b) => b.createdAt - a.createdAt) // Mới nhất lên đầu
        .slice(0, limitVal);
    }
  },

  // 5. Tìm kiếm sản phẩm (Client-side search)
  searchProducts: async (keyword: string): Promise<Door[]> => {
    try {
      // Lấy tất cả về và lọc (Phù hợp với quy mô nhỏ < 2000 sp)
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

  // 6. Lấy danh sách phân trang (Pagination - Client Side Logic)
  getProductsPaginated: async (
    type: 'door' | 'accessory', 
    page: number = 1, 
    limitVal: number = 8
  ): Promise<PaginatedResult<Door>> => {
    try {
      // 1. Lấy tất cả sp thuộc loại đó
      const q = query(collection(db, COLLECTION_NAME), where("type", "==", type));
      const snapshot = await getDocs(q);
      const allItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Door));

      // 2. Sắp xếp MỚI NHẤT lên đầu (Quan trọng)
      allItems.sort((a, b) => b.createdAt - a.createdAt);

      // 3. Tính toán phân trang
      const total = allItems.length;
      const totalPages = Math.ceil(total / limitVal);
      const startIndex = (page - 1) * limitVal;
      const endIndex = startIndex + limitVal;
      
      const data = allItems.slice(startIndex, endIndex);

      return {
        data,
        total,
        currentPage: page,
        totalPages
      };
    } catch (error) {
      console.error("Lỗi phân trang:", error);
      return { data: [], total: 0, currentPage: 1, totalPages: 0 };
    }
  },

  // ==========================================
  // B. NHÓM API NỘI DUNG (MOCK DATA - GIỮ NGUYÊN)
  // ==========================================

  // 7. Lấy dữ liệu Hero Slides (Banner)
  getHeroSlides: async (): Promise<HeroSlide[]> => {
    return Promise.resolve(MOCK_SLIDES);
  },
  
  // 8. Lấy danh sách ưu điểm
  getAdvantages: async (): Promise<Advantage[]> => {
    return Promise.resolve(MOCK_ADVANTAGES);
  },

  // 9. Lấy danh sách công trình thực tế
  getProjects: async (limit: number = 6): Promise<Project[]> => {
    return Promise.resolve(MOCK_PROJECTS.slice(0, limit));
  },

  // 10. Lấy danh sách câu hỏi thường gặp (FAQ)
  getFAQs: async (): Promise<FAQItem[]> => {
    return Promise.resolve(MOCK_FAQS);
  },

  // 11. Lấy quy trình làm việc
  getProcessSteps: async (): Promise<ProcessStep[]> => {
    return Promise.resolve(MOCK_PROCESS);
  },

  // 12. Lấy chính sách bảo hành
  getWarrantyPolicy: async (): Promise<WarrantyPolicy> => {
    return Promise.resolve(MOCK_WARRANTY);
  },
  // 13. Xóa sản phẩm
  deleteProduct: async (id: string): Promise<boolean> => {
    try {
      if (!id) return false;
      // Hàm deleteDoc của Firebase cần trỏ đúng vào doc(db, tên_bảng, id_cần_xóa)
      await deleteDoc(doc(db, COLLECTION_NAME, id));
      return true;
    } catch (error) {
      console.error("Lỗi xóa sản phẩm:", error);
      return false;
    }
  },
  // 14. Thêm sản phẩm mới (MỚI)
  addProduct: async (productData: any): Promise<boolean> => {
    try {
      // Thêm thời gian tạo để sau này sắp xếp "Mới nhất"
      const dataToSave = {
        ...productData,
        createdAt: serverTimestamp(), // Lấy giờ server
        slug: productData.name // Tạm thời lấy tên làm slug (đường dẫn)
            .toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Bỏ dấu tiếng việt
            .replace(/ /g, "-") // Thay khoảng trắng bằng gạch ngang
      };

      await addDoc(collection(db, COLLECTION_NAME), dataToSave);
      return true;
    } catch (error) {
      console.error("Lỗi thêm sản phẩm:", error);
      return false;
    }
  },
  // 15. Lấy cấu hình (Danh mục, Thương hiệu...)
  getSettings: async () => {
    try {
      const docRef = doc(db, 'settings', 'general'); // Lưu tất cả vào 1 doc tên 'general'
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        // Nếu chưa có thì trả về mặc định
        return {
          categories: ["Cửa nhựa Composite", "Cửa thép vân gỗ", "Phụ kiện cửa"],
          brands: ["Sungyu", "KOS", "Huy Hoàng"]
        };
      }
    } catch (error) {
      console.error("Lỗi lấy settings:", error);
      return { categories: [], brands: [] };
    }
  },

  // 16. Lưu cấu hình
  saveSettings: async (data: any) => {
    try {
      await setDoc(doc(db, 'settings', 'general'), data, { merge: true });
      return true;
    } catch (error) {
      console.error("Lỗi lưu settings:", error);
      return false;
    }
  },
  // 17. Lấy chi tiết 1 sản phẩm
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

  // 18. Cập nhật sản phẩm
  updateProduct: async (id: string, data: any) => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      // Cập nhật trường updatedAt để biết mới sửa
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
  // 19. Upload ảnh lên Firebase Storage
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
    // Có thể thêm folder để gọn gàng

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
      return data.secure_url; // Trả về link ảnh (https://...)
    } catch (error) {
      console.error("Lỗi upload ảnh:", error);
      return null;
    }
  },

  // 20. Bulk Insert (Dùng cho Excel)
  addMultipleProducts: async (products: any[]) => {
    let successCount = 0;
    let failCount = 0;

    for (const product of products) {
      try {
        // Tái sử dụng hàm addProduct có sẵn để đảm bảo logic (tạo slug, createdAt...)
        await doorService.addProduct(product);
        successCount++;
      } catch (e) {
        failCount++;
      }
    }
    return { successCount, failCount };
  }
};