import { HeroSlide } from '../interfaces/hero';

// 1. HERO SLIDER
export const MOCK_SLIDES: HeroSlide[] = [
  {
    id: 'hero-1',
    title: 'CASARDOOR LUXURY',
    subtitle: 'KIỆT TÁC CỬA COMPOSITE',
    description: 'Định nghĩa lại không gian sống với dòng cửa nhựa gỗ Composite thế hệ mới: Kháng nước tuyệt đối - Chống cong vênh - Vẻ đẹp vượt thời gian.',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop',
    cta: 'KHÁM PHÁ BỘ SƯU TẬP 2026',
    link: '/san-pham'
  },
  {
    id: 'hero-2',
    title: 'KOREAN STYLE',
    subtitle: 'TINH HOA NHỰA ABS',
    description: 'Nhập khẩu chính hãng KOS Hàn Quốc. Thiết kế Minimalist tinh tế, nhẹ nhàng, vận hành êm ái cho căn hộ hiện đại.',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=1932&auto=format&fit=crop', 
    cta: 'XEM MẪU ABS KOS',
    link: '/san-pham?tab=door'
  },
  {
    id: 'hero-3',
    title: 'SMART LOCKS',
    subtitle: 'CÔNG NGHỆ AN NINH 4.0',
    description: 'Bảo vệ tổ ấm với hệ thống khóa cửa điện tử vân tay, thẻ từ cao cấp. Một chạm mở ra sự tiện nghi.',
    image: 'https://images.unsplash.com/photo-1558002038-1091a166111c?q=80&w=2070&auto=format&fit=crop',
    cta: 'PHỤ KIỆN CAO CẤP',
    link: '/san-pham?tab=accessory'
  }
];

// 2. LÝ DO CHỌN (USP)
export const MOCK_ADVANTAGES = [
  { icon: "🛡️", title: "Công Nghệ Kháng Nước", desc: "Cấu trúc hạt nhựa bao phủ hạt gỗ giúp cửa chống nước 100%, không trương nở." },
  { icon: "🔥", title: "Chống Cháy Lan", desc: "Vật liệu Composite không bắt lửa, tự dập tắt khi không có nguồn nhiệt, an toàn tuyệt đối." },
  { icon: "🔇", title: "Cách Âm Chuẩn 40dB", desc: "Hệ thống gioăng cao su giảm chấn giúp không gian riêng tư, yên tĩnh tối đa." },
  { icon: "💎", title: "Bảo Hành 05 Năm", desc: "Cam kết chất lượng phôi cửa và bề mặt film PVC bền màu theo thời gian." },
];

// 3. DỰ ÁN TIÊU BIỂU (Portfolio)
export const MOCK_PROJECTS = [
  { image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800", title: "Biệt thự Vinhome Riverside" },
  { image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800", title: "Penthouse Landmark 81" },
  { image: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=800", title: "Khách sạn Mường Thanh" },
  { image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=800", title: "Căn hộ Ecopark Hưng Yên" },
];