// src/services/doorService.ts
import { Door } from '../interfaces/door';
import { HeroSlide } from '../interfaces/hero';
import { mockDoors, heroSlides, advantages, projects } from '../data/mockDoors';

// Định nghĩa type cho Advantage và Project (nếu chưa có trong interfaces, bạn có thể tạo file riêng)
export interface Advantage {
  icon: string;
  title: string;
  desc: string;
}

export interface Project {
  image: string;
  title: string;
}

export const doorService = {
  // 1. Lấy toàn bộ sản phẩm (Cửa + Phụ kiện)
  getAllProducts: async (): Promise<Door[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...mockDoors]), 500); // copy array để tránh mutate
    });
  },

  // 2. Lấy sản phẩm theo type ('door' | 'accessory')
  getProductsByType: async (type: 'door' | 'accessory'): Promise<Door[]> => {
    return new Promise((resolve) => {
      const filtered = mockDoors.filter((item) => item.type === type);
      setTimeout(() => resolve([...filtered]), 400);
    });
  },

  // 3. Lấy chi tiết sản phẩm theo slug
  getProductBySlug: async (slug: string): Promise<Door | undefined> => {
    return new Promise((resolve) => {
      const product = mockDoors.find((item) => item.slug === slug);
      setTimeout(() => resolve(product), 300);
    });
  },

  // 4. Lấy dữ liệu Hero Slides
  getHeroSlides: async (): Promise<HeroSlide[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...heroSlides]), 300);
    });
  },

  // === PHẦN MỚI: Hỗ trợ các section trang chủ ===
  
  // 5. Lấy danh sách ưu điểm nổi bật (Tại sao chọn TAMDOOR)
  getAdvantages: async (): Promise<Advantage[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...advantages]), 400);
    });
  },

  // 6. Lấy danh sách công trình thực tế
  getProjects: async (limit: number = 6): Promise<Project[]> => {
    return new Promise((resolve) => {
      const limitedProjects = projects.slice(0, limit);
      setTimeout(() => resolve([...limitedProjects]), 400);
    });
  },

  // 7. (Optional) Lấy sản phẩm nổi bật (ví dụ: 4-6 sản phẩm đầu tiên hoặc random)
  getFeaturedProducts: async (limit: number = 4): Promise<Door[]> => {
    return new Promise((resolve) => {
      // Lấy ngẫu nhiên hoặc theo thứ tự, ở đây lấy 4 sản phẩm đầu
      const featured = mockDoors.slice(0, limit);
      setTimeout(() => resolve([...featured]), 500);
    });
  },

  // 8. (Tương lai) Tìm kiếm sản phẩm đơn giản (nếu cần thêm search bar sau này)
  searchProducts: async (keyword: string): Promise<Door[]> => {
    return new Promise((resolve) => {
      if (!keyword.trim()) {
        resolve([]);
        return;
      }
      const results = mockDoors.filter(
        (item) =>
          item.name.toLowerCase().includes(keyword.toLowerCase()) ||
          item.description.toLowerCase().includes(keyword.toLowerCase()) ||
          item.category.toLowerCase().includes(keyword.toLowerCase())
      );
      setTimeout(() => resolve(results), 600);
    });
  },
};