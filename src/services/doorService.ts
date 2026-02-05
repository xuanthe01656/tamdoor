import { Door } from '../interfaces/door';
import { HeroSlide } from '../interfaces/hero';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { MOCK_SLIDES, MOCK_ADVANTAGES, MOCK_PROJECTS } from '../data/mockCMS';

// --- ĐỊNH NGHĨA TYPES ---
export interface Advantage {
  icon: string;
  title: string;
  desc: string;
}

export interface Project {
  image: string;
  title: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  currentPage: number;
  totalPages: number;
}

// --- SERVICE LOGIC ---
export const doorService = {
  // 1. Lấy toàn bộ sản phẩm (Cửa + Phụ kiện)
  getAllProducts: async (): Promise<Door[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_PRODUCTS]), 300);
    });
  },

  // 2. Lấy sản phẩm theo type ('door' | 'accessory')
  getProductsByType: async (type: 'door' | 'accessory'): Promise<Door[]> => {
    return new Promise((resolve) => {
      const filtered = MOCK_PRODUCTS.filter((item) => item.type === type);
      setTimeout(() => resolve([...filtered]), 300);
    });
  },

  // 3. Lấy chi tiết sản phẩm theo slug
  getProductBySlug: async (slug: string): Promise<Door | undefined> => {
    return new Promise((resolve) => {
      const product = MOCK_PRODUCTS.find((item) => item.slug === slug);
      setTimeout(() => resolve(product), 200);
    });
  },

  // 4. Lấy dữ liệu Hero Slides (Banner)
  getHeroSlides: async (): Promise<HeroSlide[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_SLIDES]), 100);
    });
  },
  
  // 5. Lấy danh sách ưu điểm (Tại sao chọn...)
  getAdvantages: async (): Promise<Advantage[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_ADVANTAGES]), 100);
    });
  },

  // 6. Lấy danh sách công trình thực tế
  getProjects: async (limit: number = 6): Promise<Project[]> => {
    return new Promise((resolve) => {
      const limitedProjects = MOCK_PROJECTS.slice(0, limit);
      setTimeout(() => resolve([...limitedProjects]), 200);
    });
  },

  // 7. Lấy sản phẩm nổi bật (Lấy cửa đắt tiền nhất để show)
  getFeaturedProducts: async (limit: number = 8): Promise<Door[]> => {
    return new Promise((resolve) => {
      const featured = MOCK_PRODUCTS
        .filter(p => p.type === 'door') // Chỉ lấy cửa
        .sort((a, b) => b.price - a.price) // Sắp xếp giá cao xuống thấp
        .slice(0, limit);
      
      setTimeout(() => resolve([...featured]), 400);
    });
  },

  // 8. Tìm kiếm sản phẩm
  searchProducts: async (keyword: string): Promise<Door[]> => {
    return new Promise((resolve) => {
      if (!keyword.trim()) {
        resolve([]);
        return;
      }
      const lowerKeyword = keyword.toLowerCase();
      const results = MOCK_PRODUCTS.filter(
        (item) =>
          item.name.toLowerCase().includes(lowerKeyword) ||
          item.description.toLowerCase().includes(lowerKeyword) ||
          item.category.toLowerCase().includes(lowerKeyword)
      );
      setTimeout(() => resolve(results), 500);
    });
  },

  // 9. Lấy danh sách phân trang (Pagination)
  getProductsPaginated: async (
    type: 'door' | 'accessory', 
    page: number = 1, 
    limit: number = 8
  ): Promise<PaginatedResult<Door>> => {
    return new Promise((resolve) => {
      // a. Lọc theo loại
      const filtered = MOCK_PRODUCTS.filter((item) => item.type === type);
      
      // b. Tính toán phân trang
      const total = filtered.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      const data = filtered.slice(startIndex, endIndex);

      // c. Trả về kết quả
      setTimeout(() => resolve({
        data,
        total,
        currentPage: page,
        totalPages
      }), 400); 
    });
  },
};