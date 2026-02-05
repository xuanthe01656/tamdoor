import { Door } from '../interfaces/door';

// DỮ LIỆU SẢN PHẨM GỐC (SEED DATA)
const seedProducts: Door[] = [
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

// --- HÀM TẠO DỮ LIỆU MOCK (GENERATOR) ---
const generateFullData = (): Door[] => {
  const fullList: Door[] = [];
  const colors = ['Màu Trắng Sứ', 'Màu Gỗ Sồi', 'Màu Óc Chó', 'Màu Ghi Xám', 'Màu Nâu Cafe'];
  
  // Nhân bản Cửa
  seedProducts.filter(d => d.type === 'door').forEach(base => {
    colors.forEach((color, index) => {
      fullList.push({
        ...base,
        id: `${base.id}-v${index}`,
        name: `${base.name} - ${color}`,
        price: base.price + (index * 100000), // Giữ nguyên logic tăng giá
        image: base.image, 
        slug: `${base.slug}-${index}`,
        createdAt: Date.now() - index * 100000
      });
    });
  });

  // Nhân bản Phụ kiện
  seedProducts.filter(d => d.type === 'accessory').forEach(base => {
    for(let i=1; i<=3; i++) {
        fullList.push({
            ...base,
            id: `${base.id}-v${i}`,
            name: `${base.name} (Lô ${2024 + i})`,
            slug: `${base.slug}-${i}`,
            createdAt: Date.now() - i * 50000
        });
    }
  });

  return fullList;
};

export const MOCK_PRODUCTS = generateFullData();