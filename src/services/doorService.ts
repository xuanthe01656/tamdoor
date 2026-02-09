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
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";
import { firebaseConfig, db } from "../config/firebase"; // Gộp import cho gọn

// Import Interfaces
import { Door, HeroSlide, USP, Project, FAQ, ProcessStep, WarrantyPolicy, WebsiteInfo, SystemSettings } from '../interfaces/door';

// Import Mock Data (Để làm fallback khi DB chưa có dữ liệu)
import { 
  MOCK_SLIDES, 
  MOCK_ADVANTAGES, 
  MOCK_PROJECTS,
  MOCK_FAQS,       
  MOCK_PROCESS,    
  MOCK_WARRANTY    
} from '../data/mockCMS'; 

// --- ĐỊNH NGHĨA TYPES ---
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  currentPage: number;
  totalPages: number;
}

const COLLECTION_NAME = 'products';
const SETTINGS_COLLECTION = 'settings';
const SETTINGS_DOC_ID = 'general';

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

  // 2. Lấy sản phẩm theo type
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

  // 4. Lấy sản phẩm nổi bật
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
      const allDocs = await getDocs(collection(db, COLLECTION_NAME));
      return allDocs.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Door))
        .filter(p => p.type === 'door')
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
        .slice(0, limitVal);
    }
  },

  // 5. Tìm kiếm sản phẩm
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
  // B. NHÓM API CMS (DATA ĐỘNG TỪ DB)
  // ==========================================
  // Logic chung: Gọi getSettings -> Nếu DB có thì trả về -> Nếu không có thì trả về MOCK

  getHeroSlides: async (): Promise<HeroSlide[]> => {
    const settings = await doorService.getSettings();
    return (settings.heroSlides && settings.heroSlides.length > 0) ? settings.heroSlides : MOCK_SLIDES;
  },

  getAdvantages: async (): Promise<USP[]> => {
    const settings = await doorService.getSettings();
    return (settings.usps && settings.usps.length > 0) ? settings.usps : MOCK_ADVANTAGES;
  },

  getProjects: async (limit: number = 6): Promise<Project[]> => {
    const settings = await doorService.getSettings();
    const projects = (settings.projects && settings.projects.length > 0) ? settings.projects : MOCK_PROJECTS;
    return projects.slice(0, limit);
  },

  getFAQs: async (): Promise<FAQ[]> => {
    const settings = await doorService.getSettings();
    return (settings.faqs && settings.faqs.length > 0) ? settings.faqs : MOCK_FAQS;
  },

  getProcessSteps: async (): Promise<ProcessStep[]> => {
    const settings = await doorService.getSettings();
    return (settings.process && settings.process.length > 0) ? settings.process : MOCK_PROCESS;
  },

  getWarrantyPolicy: async (): Promise<WarrantyPolicy> => {
    const settings = await doorService.getSettings();
    return settings.warranty ? settings.warranty : MOCK_WARRANTY;
  },

  // ==========================================
  // C. NHÓM API QUẢN TRỊ SẢN PHẨM (CRUD)
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
            .replace(/[^\w-]+/g, "")
      };

      await addDoc(collection(db, COLLECTION_NAME), dataToSave);
      return true;
    } catch (error) {
      console.error("Lỗi thêm sản phẩm:", error);
      return false;
    }
  },

  // 15. Lấy chi tiết 1 sản phẩm
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
  // D. NHÓM API CẤU HÌNH & CMS (SETTINGS) - ĐÃ NÂNG CẤP
  // ==========================================

  // 17. Lấy Settings (Gộp tất cả mọi thứ)
  getSettings: async (): Promise<SystemSettings> => {
    try {
      const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as SystemSettings;
      } else {
        // Trả về mặc định cơ bản nếu DB chưa có
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

  // 18. Hàm lưu Settings chung (Core)
  saveSettings: async (data: Partial<SystemSettings>) => {
    try {
      await setDoc(doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID), data, { merge: true });
      return true;
    } catch (error) {
      console.error("Lỗi lưu settings:", error);
      return false;
    }
  },

  // --- CÁC HÀM WRAPPER CHO CMS ---
  saveWebsiteInfo: async (info: WebsiteInfo) => {
    return doorService.saveSettings({ websiteInfo: info });
  },

  saveSlides: async (slides: HeroSlide[]) => {
    return doorService.saveSettings({ heroSlides: slides });
  },

  saveUSPs: async (usps: USP[]) => {
    return doorService.saveSettings({ usps: usps });
  },

  saveProjects: async (projects: Project[]) => {
    return doorService.saveSettings({ projects: projects });
  },

  saveFAQs: async (faqs: FAQ[]) => {
    return doorService.saveSettings({ faqs: faqs });
  },

  saveProcess: async (process: ProcessStep[]) => {
    return doorService.saveSettings({ process: process });
  },

  saveWarranty: async (warranty: WarrantyPolicy) => {
    return doorService.saveSettings({ warranty: warranty });
  },

  // ==========================================
  // E. NHÓM API UPLOAD & EXCEL
  // ==========================================

  // 20. Upload ảnh
  uploadImage: async (file: File): Promise<string | null> => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      console.error("❌ Thiếu cấu hình Cloudinary");
      alert("Lỗi cấu hình .env");
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

      if (!response.ok) throw new Error('Lỗi upload Cloudinary');
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Lỗi upload ảnh:", error);
      return null;
    }
  },

  // 21. Bulk Insert
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
  },

  // 22. Gửi liên hệ
  sendContactRequest: async (data: { name: string; phone: string; email?: string; message: string }) => {
    try {
      await addDoc(collection(db, 'contacts'), {
        ...data,
        createdAt: serverTimestamp(),
        status: 'new'
      });
      return true;
    } catch (error) {
      console.error("Lỗi gửi liên hệ:", error);
      return false;
    }
  },

  // ==========================================
  // F. NHÓM API QUẢN LÝ LIÊN HỆ (ADMIN)
  // ==========================================

  // 23. Lấy danh sách liên hệ
  getAllContacts: async () => {
    try {
      const q = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Lỗi lấy danh sách liên hệ:", error);
      return [];
    }
  },

  // 24. Cập nhật trạng thái
  updateContactStatus: async (id: string, status: 'new' | 'contacted' | 'spam') => {
    try {
      const docRef = doc(db, 'contacts', id);
      await updateDoc(docRef, { status });
      return true;
    } catch (error) {
      console.error("Lỗi update status:", error);
      return false;
    }
  },

  // 25. Xóa liên hệ
  deleteContact: async (id: string) => {
    try {
      await deleteDoc(doc(db, 'contacts', id));
      return true;
    } catch (error) {
      console.error("Lỗi xóa liên hệ:", error);
      return false;
    }
  },

  // ==========================================
  // G. NHÓM API QUẢN LÝ USER (ADMIN ONLY)
  // ==========================================

  // 26. Lấy danh sách nhân viên
  getAllUsers: async () => {
    try {
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Lỗi lấy users:", error);
      return [];
    }
  },

  // 27. Tạo User mới
  createUser: async (userData: { email: string; pass: string; name: string; role: string }) => {
    try {
      const secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");
      const secondaryAuth = getAuth(secondaryApp);
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, userData.email, userData.pass);
      const newUser = userCredential.user;

      await setDoc(doc(db, "users", newUser.uid), {
        email: userData.email,
        name: userData.name,
        role: userData.role,
        createdAt: serverTimestamp()
      });

      await signOut(secondaryAuth);
      return true;
    } catch (error: any) {
      console.error("Lỗi tạo user:", error);
      alert("Lỗi: " + error.message);
      return false;
    }
  },

  // 28. Xóa User
  deleteUser: async (id: string) => {
    try {
      await deleteDoc(doc(db, 'users', id));
      return true;
    } catch (error) {
      console.error("Lỗi xóa user:", error);
      return false;
    }
  },

  // 29. Cập nhật User
  updateUser: async (uid: string, data: { name: string; role: string }) => {
    try {
      const docRef = doc(db, 'users', uid);
      await updateDoc(docRef, { name: data.name, role: data.role });
      return true;
    } catch (error) {
      console.error("Lỗi update user:", error);
      return false;
    }
  },

  // 30. Reset Password
  sendPasswordReset: async (email: string) => {
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error: any) {
      console.error("Lỗi gửi mail reset:", error);
      alert("Lỗi: " + error.message);
      return false;
    }
  },
};