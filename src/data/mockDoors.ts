// src/data/mockDoors.ts
import { Door } from '../interfaces/door';
import { HeroSlide } from '../interfaces/hero';

export const heroSlides: HeroSlide[] = [
    {
      id: 'hero-1',
      title: 'TAMDOOR',
      subtitle: 'DOOR OF THE FUTURE',
      description: 'Giải pháp cửa nhựa Composite kháng nước tuyệt đối, bền bỉ cùng thời gian – lấy cảm hứng từ Green Life Door.',
      // Ảnh mới: Phòng ngủ luxury với cửa composite vân gỗ sáng, không gian ấm cúng cao cấp, ánh sáng tự nhiên
      image: 'https://cdn.prod.website-files.com/66a9fa7f9de2e13a4f019d5e/66df727369e823c676b99520_11.webp',
      cta: 'KHÁM PHÁ BỘ SƯU TẬP',
      link: '/san-pham'
    },
    {
      id: 'hero-2',
      title: 'LUXURY',
      subtitle: 'MODERN INTERIOR',
      description: 'Cửa nhựa ABS Hàn Quốc chính hãng KOS kết hợp phong cách composite cao cấp như Green Life – hiện đại cho mọi căn hộ.',
      // Ảnh mới: Không gian phòng khách/villa hiện đại với cửa composite tinh tế, minimalist, sáng sủa
      image: 'https://equityresidences.com/wp-content/uploads/2024/11/Costa-Rica-Luxury-Home-On-The-Sand-Bedroom-.-fotor-enhance-20250523172828.jpg',
      cta: 'XEM MẪU ABS KOS & COMPOSITE',
      link: '/san-pham/cua-nhua-abs'
    },
    {
      id: 'hero-3',
      title: 'PREMIUM COMPOSITE',
      subtitle: 'WATERPROOF & ELEGANT',
      description: 'Cửa composite cao cấp, chống ẩm 100%, thiết kế tinh tế – bền vững cho ngôi nhà Việt hiện đại, tham khảo từ Green Life Door.',
      // Ảnh mới: Villa sang trọng với cửa composite vân gỗ tự nhiên, nội thất luxury, không gian rộng rãi
      image: 'https://www.oilnutbay.com/wp-content/uploads/2024/08/Casino-Royale_OV1_Great-Room-1-1920x1280.jpg',
      cta: 'KHÁM PHÁ COMPOSITE NGAY',
      link: '/san-pham/cua-composite'
    }
  ];
  export const mockDoors: Door[] = [
    // --- NHÓM CỬA NHỰA COMPOSITE (chính, lấy cảm hứng Green Life/Sungyu) ---
    {
      id: 'd1',
      name: 'Cửa Nhựa Composite Sungyu Phủ Film Vân Sồi Trắng',
      slug: 'cua-nhua-composite-sungyu',
      category: 'Nhựa Composite',
      type: 'door',
      price: 3500000,
      image: 'https://images.pexels.com/photos/7005281/pexels-photo-7005281.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', // Phòng ngủ hiện đại minimalist với cửa vân gỗ sáng
      description: 'Kháng nước 100%, không cong vênh, cách âm tốt, bền bỉ 20-30 năm.',
      features: ['Kháng nước tuyệt đối', 'Cách âm 40dB', 'Chống mối mọt & cháy lan', 'Vân gỗ tự nhiên cao cấp'],
      createdAt: Date.now(),
    },
    {
      id: 'd3',
      name: 'Cửa Composite Cao Cấp Vân Óc Chó Đen',
      slug: 'cua-composite-van-oc-cho',
      category: 'Nhựa Composite',
      type: 'door',
      price: 4200000,
      image: 'https://cdn.mos.cms.futurecdn.net/H73mVvQQs96oPvDTPPWTTY-1500-80.jpg', // Phòng khách luxury với cửa tối màu sang trọng
      description: 'Thiết kế tinh tế, bề mặt phủ film chống xước, phù hợp villa & căn hộ cao cấp.',
      features: ['Chống ẩm 100%', 'Cách nhiệt tốt', 'Bề mặt chống xước', 'Thiết kế 2 lớp'],
      createdAt: Date.now(),
    },
    {
      id: 'd4',
      name: 'Cửa Nhựa Composite Vân Xám Hiện Đại',
      slug: 'cua-composite-van-xam',
      category: 'Nhựa Composite',
      type: 'door',
      price: 3800000,
      image: 'https://cdn.prod.website-files.com/66a9fa7f9de2e13a4f019d5e/66df4d7039a0f604c154982b_3.webp', // Nội thất hiện đại với cửa xám nhạt
      description: 'Phong cách minimalist, dễ phối nội thất, chống nước hoàn hảo cho khí hậu Việt Nam.',
      features: ['Kháng nước & ẩm cao', 'Dễ lau chùi', 'Cách âm hiệu quả'],
      createdAt: Date.now(),
    },
  
    // --- NHÓM CỬA NHỰA ABS HÀN QUỐC ---
    {
      id: 'd5',
      name: 'Cửa Nhựa ABS Hàn Quốc KOS Vân Gỗ Sáng',
      slug: 'cua-nhua-abs-kos',
      category: 'Nhựa ABS Hàn Quốc',
      type: 'door',
      price: 4500000,
      image: 'https://liveandletsfly.boardingarea.com/wp-content/uploads/2019/12/Park-Hyatt-New-York-Review-95.jpg', // Phòng ngủ luxury Hàn Quốc style
      description: 'Nhập khẩu chính hãng, bề mặt bóng mịn, thiết kế tinh tế cho căn hộ hiện đại.',
      features: ['Bề mặt ABS cao cấp', 'Chống va đập', 'Cách âm & nhiệt', 'Thiết kế Hàn Quốc'],
      createdAt: Date.now(),
    },
    {
      id: 'd6',
      name: 'Cửa ABS Phủ Veneer Gỗ Tự Nhiên',
      slug: 'cua-abs-veneer',
      category: 'Nhựa ABS Hàn Quốc',
      type: 'door',
      price: 4800000,
      image: 'https://liveandletsfly.com/wp-content/uploads/2024/03/Alila-Bangsar-Review-12.jpeg', // Nội thất sang trọng với cửa vân gỗ
      description: 'Kết hợp ABS bền bỉ với lớp veneer gỗ thật, vẻ đẹp tự nhiên.',
      features: ['Vân gỗ thật 100%', 'Chống nước tốt', 'Bền màu lâu dài'],
      createdAt: Date.now(),
    },
  
    // --- NHÓM CỬA GỖ HDF VENEER ---
    {
      id: 'd2',
      name: 'Cửa Gỗ Công Nghiệp HDF Veneer Vân Sồi',
      slug: 'cua-go-hdf',
      category: 'Gỗ Công Nghiệp',
      type: 'door',
      price: 2800000,
      image: 'https://i1.pickpik.com/photos/127/508/938/home-modern-furniture-luxury-preview.jpg', // Cửa trắng mở trong phòng hiện đại
      description: 'Lớp veneer gỗ tự nhiên, giá thành hợp lý, sang trọng cho nhà phố.',
      features: ['Veneer cao cấp', 'Cách âm tốt', 'Không cong vênh'],
      createdAt: Date.now(),
    },
  
    // --- NHÓM PHỤ KIỆN ---
    {
      id: 'a1',
      name: 'Khóa Tay Gạt Huy Hoàng Cao Cấp',
      slug: 'khoa-tay-gat-huy-hoang',
      category: 'Phụ Kiện Khóa',
      type: 'accessory',
      price: 450000,
      image: 'https://p2.piqsels.com/preview/506/82/507/door-handle-door-knob-jack-door-lock.jpg', // Cận cảnh tay gạt hiện đại
      description: 'Hợp kim kẽm cao cấp, chống gỉ, độ bền cao, thiết kế sang trọng.',
      features: ['Chống gỉ sét', 'Dễ lắp đặt', 'Bảo hành 5 năm'],
      createdAt: Date.now(),
    },
    {
      id: 'a2',
      name: 'Bản Lề Inox 304 Chống Gỉ (Cái)',
      slug: 'ban-le-inox-304',
      category: 'Phụ Kiện Bản Lề',
      type: 'accessory',
      price: 65000,
      image: 'https://media.musson.com/catalog/product/4/5/45-223__tightpin15.jpg', // Cận cảnh bản lề inox premium
      description: 'Inox 304 chịu lực tốt, đóng mở êm ái, phù hợp mọi loại cửa.',
      features: ['Chịu lực cao', 'Không gỉ', 'Độ bền 10+ năm'],
      createdAt: Date.now(),
    },
    {
      id: 'a3',
      name: 'Tay Nắm Cửa Inox Vân Gỗ',
      slug: 'tay-nam-cua-inox',
      category: 'Phụ Kiện Tay Nắm',
      type: 'accessory',
      price: 320000,
      image: 'https://www.decoranddecor.com/cdn/shop/files/hera-internal-door-handles-brushed-satin-nickel-255.webp?v=1744057312&width=1600', // Tay nắm satin nickel luxury
      description: 'Thiết kế vân gỗ kết hợp inox, sang trọng và hiện đại.',
      features: ['Chống xước', 'Dễ vệ sinh', 'Phù hợp cửa composite'],
      createdAt: Date.now(),
    },
    {
      id: 'a4',
      name: 'Chốt Cửa An Toàn Inox 304',
      slug: 'chot-cua-inox',
      category: 'Phụ Kiện Khóa',
      type: 'accessory',
      price: 180000,
      image: 'https://dash.iwantthatdoor.com//Blogs/Images/1763601970_MetalDoorLocksTrends2025.jpg', // Khóa chốt hiện đại
      description: 'Chốt an toàn cho cửa chính/phòng ngủ, chống đột nhập.',
      features: ['An toàn cao', 'Inox bền bỉ', 'Lắp đặt dễ'],
      createdAt: Date.now(),
    },
  ];
  export const advantages = [
    { icon: '💧', title: 'Kháng nước 100%', desc: 'Tuyệt đối không thấm nước, phù hợp khí hậu Việt Nam.' },
    { icon: '🛡️', title: 'Bền bỉ 30 năm', desc: 'Không cong vênh, không mối mọt, bảo hành dài hạn.' },
    { icon: '🌿', title: 'Thân thiện môi trường', desc: 'Vật liệu composite tái chế, an toàn sức khỏe.' },
    { icon: '🔇', title: 'Cách âm & nhiệt tốt', desc: 'Giảm tiếng ồn, tiết kiệm năng lượng.' },
  ];
  
  // Thêm mảng projects (công trình thực tế, ảnh cập nhật mới, phù hợp luxury Việt Nam/modern)
  export const projects = [
    {
      image: 'https://cdn.prod.website-files.com/66a9fa7f9de2e13a4f019d5e/66df4d70372183f2d933d905_7.webp',
      title: 'Căn hộ cao cấp Quận 1'
    },
    {
      image: 'https://cdn.prod.website-files.com/644af96a8705d9be228df360/644c3fbeabd6b2df0bf9f79b_Commonwealth_11_web.jpg',
      title: 'Villa Phú Mỹ Hưng'
    },
    {
      image: 'https://cdn.prod.website-files.com/66a9fa7f9de2e13a4f019d5e/66df4d7039a0f604c154982b_3.webp',
      title: 'Resort Đà Nẵng'
    },
    // Thêm 1 cái nữa để grid đẹp hơn (tùy chọn)
    {
      image: 'https://www.newwindsrealty.com/wp-content/uploads/2024/12/4a.jpg',
      title: 'Căn hộ luxury Quận 7'
    },
  ];