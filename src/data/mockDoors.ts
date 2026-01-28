import { Door } from '../interfaces/door';
import { HeroSlide } from '../interfaces/hero';

// --- 1. HERO SLIDER: ĐẲNG CẤP & CẢM XÚC ---
export const heroSlides: HeroSlide[] = [
  {
    id: 'hero-1',
    title: 'TAMDOOR LUXURY',
    subtitle: 'KIỆT TÁC CỬA COMPOSITE',
    description: 'Định nghĩa lại không gian sống với dòng cửa nhựa gỗ Composite thế hệ mới: Kháng nước tuyệt đối - Chống cong vênh - Vẻ đẹp vượt thời gian.',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop', // Ảnh phòng khách sang trọng nhìn ra cửa
    cta: 'KHÁM PHÁ BỘ SƯU TẬP 2026',
    link: '/san-pham'
  },
  {
    id: 'hero-2',
    title: 'KOREAN STYLE',
    subtitle: 'TINH HOA NHỰA ABS',
    description: 'Nhập khẩu chính hãng KOS Hàn Quốc. Thiết kế Minimalist tinh tế, nhẹ nhàng, vận hành êm ái cho căn hộ hiện đại.',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=1932&auto=format&fit=crop', // Ảnh nội thất tối giản (Minimalism)
    cta: 'XEM MẪU ABS KOS',
    link: '/san-pham/cua-nhua-abs'
  },
  {
    id: 'hero-3',
    title: 'SMART LOCKS',
    subtitle: 'CÔNG NGHỆ AN NINH 4.0',
    description: 'Bảo vệ tổ ấm với hệ thống khóa cửa điện tử vân tay, thẻ từ cao cấp. Một chạm mở ra sự tiện nghi.',
    image: 'https://images.unsplash.com/photo-1558002038-1091a166111c?q=80&w=1932&auto=format&fit=crop', // Ảnh tay nắm cửa hiện đại
    cta: 'PHỤ KIỆN CAO CẤP',
    link: '/san-pham?tab=accessory'
  }
];

// --- 2. LÝ DO CHỌN (USP) ---
export const advantages = [
  { icon: "🛡️", title: "Công Nghệ Kháng Nước", desc: "Cấu trúc hạt nhựa bao phủ hạt gỗ giúp cửa chống nước 100%, không trương nở." },
  { icon: "🔥", title: "Chống Cháy Lan", desc: "Vật liệu Composite không bắt lửa, tự dập tắt khi không có nguồn nhiệt, an toàn tuyệt đối." },
  { icon: "🔇", title: "Cách Âm Chuẩn 40dB", desc: "Hệ thống gioăng cao su giảm chấn giúp không gian riêng tư, yên tĩnh tối đa." },
  { icon: "💎", title: "Bảo Hành 05 Năm", desc: "Cam kết chất lượng phôi cửa và bề mặt film PVC bền màu theo thời gian." },
];

// --- 3. DỰ ÁN TIÊU BIỂU (Portfolio) ---
export const projects = [
  { image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800", title: "Biệt thự Vinhome Riverside" },
  { image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800", title: "Penthouse Landmark 81" },
  { image: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=800", title: "Khách sạn Mường Thanh" },
  { image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=800", title: "Căn hộ Ecopark Hưng Yên" },
];

// --- 4. DỮ LIỆU SẢN PHẨM GỐC (SEED DATA) ---
// Đây là những mẫu "chuẩn" để nhân bản
const seedDoors: Door[] = [
  // == CỬA COMPOSITE ==
  {
    id: 'comp-01',
    name: 'Cửa Composite Phủ Film Vân Gỗ Óc Chó (Walnut)',
    slug: 'cua-composite-walnut',
    category: 'Nhựa Composite',
    type: 'door',
    price: 3850000,
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=600',
    description: 'Dòng Luxury phủ film PVC vân gỗ Óc chó sang trọng. Bề mặt sần như gỗ thật, phù hợp biệt thự.',
    features: ['Kháng nước 100%', 'Chống cong vênh', 'Cách âm tốt'],
    // THÔNG SỐ KỸ THUẬT CHI TIẾT
    specifications: [
      { key: "Kích thước tiêu chuẩn", value: "900 x 2200 mm" },
      { key: "Độ dày cánh", value: "40 mm (± 2mm)" },
      { key: "Độ dày khuôn", value: "100 - 125 mm" },
      { key: "Trọng lượng cánh", value: "25 - 30 kg" },
      { key: "Vật liệu", value: "Wood Plastic Composite (WPC)" },
      { key: "Bề mặt", value: "Phủ Film PVC kháng khuẩn" },
      { key: "Bảo hành", value: "05 năm (Cánh & Khuôn)" }
    ],
    createdAt: Date.now(),
  },
  {
    id: 'comp-02',
    name: 'Cửa Composite Soi Chỉ Nhôm Hiện Đại',
    slug: 'cua-composite-soi-chi',
    category: 'Nhựa Composite',
    type: 'door',
    price: 3650000,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600',
    description: 'Điểm nhấn chỉ nhôm (vàng/bạc) chạy dọc cánh tạo nét hiện đại.',
    features: ['Chỉ nhôm Anode', 'Thiết kế phẳng', 'Hiện đại'],
    specifications: [
        { key: "Kích thước tối đa", value: "980 x 2400 mm" },
        { key: "Độ dày cánh", value: "38 mm" },
        { key: "Loại nẹp", value: "Nẹp cài thông minh L6" },
        { key: "Chỉ trang trí", value: "Nhôm Anode 10mm" },
        { key: "Khả năng chịu nước", value: "Tuyệt đối 100%" }
    ],
    createdAt: Date.now(),
  },
  
  // == CỬA ABS HÀN QUỐC ==
  {
    id: 'abs-01',
    name: 'Cửa Nhựa ABS Hàn Quốc KOS - Mẫu Phẳng',
    slug: 'cua-abs-kos-phang',
    category: 'Nhựa ABS Hàn Quốc',
    type: 'door',
    price: 3200000,
    image: 'https://images.unsplash.com/photo-1506332033947-ca397850922c?auto=format&fit=crop&q=80&w=600',
    description: 'Nhập khẩu 100% từ Hàn Quốc. Cấu tạo 5 lớp vững chắc, nhẹ.',
    features: ['Nhựa ABS chính hãng', 'Chống va đập', 'Nhẹ & Bền'],
    specifications: [
        { key: "Xuất xứ", value: "Nhập khẩu Hàn Quốc (KOS)" },
        { key: "Cấu tạo", value: "5 lớp (Deco-Sheet, ABS, PVC, LVL, Honeycomb)" },
        { key: "Độ dày cánh", value: "35 mm" },
        { key: "Trọng lượng", value: "15 - 20 kg (Nhẹ)" },
        { key: "Ứng dụng", value: "Cửa phòng ngủ, Cửa vệ sinh" }
    ],
    createdAt: Date.now(),
  },
  
  // == PHỤ KIỆN (KHÓA THÔNG MINH) ==
  {
    id: 'acc-01',
    name: 'Khóa Điện Tử Vân Tay Kaadas S500',
    slug: 'khoa-kaadas-s500',
    category: 'Khóa Điện Tử',
    type: 'accessory',
    price: 4800000,
    // Ảnh tay nắm cửa điện tử hiện đại
    image: 'https://images.unsplash.com/photo-1558002038-1091a166111c?auto=format&fit=crop&q=80&w=600',
    description: 'Công nghệ vân tay FPC Thụy Điển. Mở khóa đa năng.',
    features: ['Vân tay FPC', 'Mã số ảo', 'Thẻ từ cao cấp'],
    specifications: [
        { key: "Phương thức mở", value: "Vân tay, Mã số, Thẻ từ, Chìa cơ" },
        { key: "Vật liệu", value: "Hợp kim kẽm, Kính cường lực" },
        { key: "Nguồn điện", value: "4 pin AA" }
    ],
    createdAt: Date.now(),
  },
  {
    id: 'acc-02',
    name: 'Bộ Bản Lề Inox 304 Cao Cấp',
    slug: 'ban-le-inox-304',
    category: 'Phụ Kiện Kim Khí',
    type: 'accessory',
    price: 250000,
    // Ảnh chi tiết kim loại/bản lề
    image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=600',
    description: 'Inox 304 mờ cao cấp, trục bi vận hành êm ái, chịu tải trọng lớn.',
    features: ['Chống rỉ sét vĩnh viễn', 'Độ dày 3mm', 'Bảo hành 2 năm'],
    specifications: [
        { key: "Chất liệu", value: "Inox SUS 304" },
        { key: "Tải trọng", value: "80kg/cánh" },
        { key: "Quy cách", value: "4 cái/bộ" }
    ],
    createdAt: Date.now(),
  },
  {
    id: 'acc-03',
    name: 'Chốt Âm Cửa & Tay Nắm Tròn',
    slug: 'chot-am-nam-cham',
    category: 'Phụ Kiện Kim Khí',
    type: 'accessory',
    price: 120000,
    // Ảnh tay nắm tròn/chốt cửa
    image: 'https://images.unsplash.com/photo-1603053894700-df3335594002?auto=format&fit=crop&q=80&w=600',
    description: 'Phụ kiện giữ cửa thông minh và tay nắm phong cách tối giản.',
    features: ['Lực hút mạnh', 'Thẩm mỹ cao', 'Dễ lắp đặt'],
    specifications: [
        { key: "Chất liệu", value: "Hợp kim/Inox" },
        { key: "Màu sắc", value: "Đen mờ / Bạc xước" }
    ],
    createdAt: Date.now(),
  }
];

// --- GENERATOR GIỮ NGUYÊN ---
const generateFullData = (): Door[] => {
  const fullList: Door[] = [];
  const colors = ['Màu Trắng Sứ', 'Màu Gỗ Sồi', 'Màu Óc Chó', 'Màu Ghi Xám', 'Màu Nâu Cafe'];
  
  seedDoors.filter(d => d.type === 'door').forEach(base => {
    colors.forEach((color, index) => {
      fullList.push({
        ...base,
        id: `${base.id}-v${index}`,
        name: `${base.name} - ${color}`,
        price: base.price + (index * 100000),
        image: base.image, 
        slug: `${base.slug}-${index}`,
        createdAt: Date.now() - index * 100000
      });
    });
  });

  seedDoors.filter(d => d.type === 'accessory').forEach(base => {
    for(let i=1; i<=3; i++) {
        fullList.push({
            ...base,
            id: `${base.id}-v${i}`,
            name: `${base.name} (Lô ${2024 + i})`,
            slug: `${base.slug}-${i}`,
        });
    }
  });

  return fullList;
};

export const mockDoors = generateFullData();