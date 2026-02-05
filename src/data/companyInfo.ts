// src/data/companyInfo.ts

export const COMPANY_INFO = {
    brandName: "CASADOOR",
    hotline: "0901 234 567",
    email: "support@casardoor.vn",
    address: "123 Đường Nguyễn Văn Linh, Quận Hải Châu, TP. Đà Nẵng",
    workingHours: {
      weekdays: "Thứ 2 - Thứ 7: 8:00 - 17:30",
      sunday: "Chủ nhật: Nghỉ"
    },
    socials: {
      facebook: "https://facebook.com/casardoor",
      zalo: "https://zalo.me/0901234567"
    },
    // Dữ liệu cho trang About
    about: {
      stats: [
        { value: "10+", label: "Năm kinh nghiệm" },
        { value: "5000+", label: "Dự án hoàn thành" },
        { value: "98%", label: "Khách hàng hài lòng" },
        { value: "24/7", label: "Hỗ trợ kỹ thuật" }
      ],
      coreValues: [
        { title: "Tín", desc: "CasarDoor đặt chữ TÍN lên hàng đầu, cam kết đúng chất lượng, đúng tiến độ." },
        { title: "Tâm", desc: "Làm việc bằng cái TÂM, coi công trình của khách hàng như nhà của chính mình." },
        { title: "Tầm", desc: "Không ngừng nâng cao TẦM vóc, mang đến giải pháp đẳng cấp quốc tế." }
      ]
    },
    footerLinks: {
      products: [
        { name: "Cửa Nhựa Composite", link: "/san-pham?tab=door" },
        { name: "Cửa Nhựa ABS Hàn Quốc", link: "/san-pham?tab=door" },
        { name: "Khóa Cửa Thông Minh", link: "/san-pham?tab=accessory" },
        { name: "Phụ Kiện Cửa Kính", link: "/san-pham?tab=accessory" }
      ],
      support: [
        { name: "Báo giá thi công", link: "/lien-he" },
        { name: "Chính sách bảo hành", link: "/chinh-sach-bao-hanh" }, 
        { name: "Quy trình làm việc", link: "/quy-trinh-lam-viec" },   
        { name: "Câu hỏi thường gặp", link: "/cau-hoi-thuong-gap" } 
      ]
    }
  };