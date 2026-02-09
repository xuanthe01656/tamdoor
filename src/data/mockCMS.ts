// 👇 Cập nhật đường dẫn import đúng file interface tổng
import { HeroSlide, USP, Project, FAQ, ProcessStep, WarrantyPolicy } from '../interfaces/door';

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

// 2. LÝ DO CHỌN (USP) - Đã thêm ID
export const MOCK_ADVANTAGES: USP[] = [
  { id: 'usp-1', icon: "🛡️", title: "Công Nghệ Kháng Nước", desc: "Cấu trúc hạt nhựa bao phủ hạt gỗ giúp cửa chống nước 100%, không trương nở." },
  { id: 'usp-2', icon: "🔥", title: "Chống Cháy Lan", desc: "Vật liệu Composite không bắt lửa, tự dập tắt khi không có nguồn nhiệt, an toàn tuyệt đối." },
  { id: 'usp-3', icon: "🔇", title: "Cách Âm Chuẩn 40dB", desc: "Hệ thống gioăng cao su giảm chấn giúp không gian riêng tư, yên tĩnh tối đa." },
  { id: 'usp-4', icon: "💎", title: "Bảo Hành 05 Năm", desc: "Cam kết chất lượng phôi cửa và bề mặt film PVC bền màu theo thời gian." },
];

// 3. DỰ ÁN TIÊU BIỂU - Đã thêm ID
export const MOCK_PROJECTS: Project[] = [
  { id: 'proj-1', image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800", title: "Biệt thự Vinhome Riverside" },
  { id: 'proj-2', image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800", title: "Penthouse Landmark 81" },
  { id: 'proj-3', image: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=800", title: "Khách sạn Mường Thanh" },
  { id: 'proj-4', image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=800", title: "Căn hộ Ecopark Hưng Yên" },
];

// 4. CÂU HỎI THƯỜNG GẶP (FAQ) - Đã thêm ID
export const MOCK_FAQS: FAQ[] = [
  {
    id: 'faq-1',
    q: "Cửa nhựa Composite có bền không? Có chịu được nước không?",
    a: "Cửa nhựa Composite của CasarDoor được làm từ bột gỗ và hạt nhựa PVC đùn nguyên khối, có khả năng CHỊU NƯỚC TUYỆT ĐỐI 100%. Sản phẩm không bị cong vênh, mối mọt, tuổi thọ lên đến 20 năm."
  },
  {
    id: 'faq-2',
    q: "Giá cửa đã bao gồm phụ kiện và công lắp đặt chưa?",
    a: "Báo giá trên website thường là giá cánh và khung bao. Chi phí nẹp chỉ, bản lề, khóa và công lắp đặt sẽ được tính riêng tùy theo số lượng và vị trí công trình."
  },
  {
    id: 'faq-3',
    q: "Thời gian đặt hàng và lắp đặt là bao lâu?",
    a: "Đối với các mẫu màu tiêu chuẩn có sẵn, thời gian lắp đặt từ 3-5 ngày. Đối với các mẫu đặt kích thước riêng, thời gian từ 7-10 ngày."
  },
  {
    id: 'faq-4',
    q: "CasarDoor có thi công ở tỉnh không?",
    a: "Hiện tại CasarDoor tập trung thi công chính tại TP. Đà Nẵng và các vùng lân cận (Quảng Nam, Huế). Với tỉnh xa, chúng tôi hỗ trợ giao hàng ra chành xe."
  },
  {
    id: 'faq-5',
    q: "Tôi có thể sử dụng lại khóa cũ cho cửa mới không?",
    a: "Hoàn toàn được, nếu khóa cũ của quý khách vẫn còn tốt và phù hợp với độ dày đố cửa mới (thường là 40mm)."
  }
];

// 5. QUY TRÌNH LÀM VIỆC (PROCESS) - Đã thêm ID
export const MOCK_PROCESS: ProcessStep[] = [
  {
    id: 'proc-1',
    step: "01",
    title: "Tiếp nhận & Tư vấn",
    desc: "Khách hàng liên hệ qua Hotline/Website. Nhân viên tư vấn sơ bộ về mẫu mã, chất liệu và báo giá dự toán."
  },
  {
    id: 'proc-2',
    step: "02",
    title: "Khảo sát thực tế",
    desc: "Kỹ thuật viên đến công trình đo đạc kích thước ô chờ chính xác và tư vấn giải pháp thi công tối ưu."
  },
  {
    id: 'proc-3',
    step: "03",
    title: "Ký hợp đồng & Sản xuất",
    desc: "Chốt mẫu mã, màu sắc, kích thước và đặt cọc. Đơn hàng được chuyển về nhà máy sản xuất (5-7 ngày)."
  },
  {
    id: 'proc-4',
    step: "04",
    title: "Vận chuyển & Lắp đặt",
    desc: "Vận chuyển cửa đến công trình. Đội ngũ thợ lành nghề tiến hành lắp đặt, bắn keo, vệ sinh."
  },
  {
    id: 'proc-5',
    step: "05",
    title: "Nghiệm thu & Bàn giao",
    desc: "Khách hàng kiểm tra vận hành cửa. Ký biên bản nghiệm thu, thanh toán và nhận phiếu bảo hành."
  }
];

// 6. CHÍNH SÁCH BẢO HÀNH (WARRANTY)
export const MOCK_WARRANTY: WarrantyPolicy = {
  // Dữ liệu bảng thời gian bảo hành
  periods: [
    { product: "Cửa Nhựa Composite", time: "05 Năm", scope: "Cong vênh, mối mọt, thấm nước" },
    { product: "Cửa Nhựa ABS Hàn Quốc", time: "03 Năm", scope: "Bong tróc bề mặt, lỗi NSX" },
    { product: "Khóa cửa điện tử", time: "24 Tháng", scope: "Lỗi bo mạch, vân tay, cảm ứng" },
    { product: "Phụ kiện kim khí", time: "12 Tháng", scope: "Rỉ sét, gãy lẫy, kẹt khóa" }
  ],
  // Điều kiện hợp lệ
  conditions: [
    "Sản phẩm còn trong thời hạn bảo hành tính từ ngày bàn giao.",
    "Tem bảo hành còn nguyên vẹn, không cạo sửa.",
    "Lỗi kỹ thuật do nhà sản xuất hoặc lỗi lắp đặt của CasarDoor.",
    "Có phiếu bảo hành hoặc hợp đồng kinh tế."
  ],
  // Từ chối bảo hành
  refusals: [
    "Hư hỏng do tác động cơ học (rơi vỡ, va đập mạnh).",
    "Hư hỏng do thiên tai, hỏa hoạn, lũ lụt.",
    "Khách hàng tự ý tháo dỡ, sửa chữa thay đổi kết cấu."
  ]
};