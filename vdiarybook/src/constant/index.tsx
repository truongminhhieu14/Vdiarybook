import { FaAngry, FaHeart, FaLaughSquint, FaSadTear, FaSurprise, FaThumbsUp } from "react-icons/fa";

export const headerData=[
  { title: "Tra cứu điểm thi TNTHPT2025", href: "/tra-cuu-diem-thi-tnthpt2025", icon: "📋" },
  { title: "Trang chủ", href: "/trang-chu", icon: "🏠" },
  { title: "Design", href: "/design", icon: "🎨" },
  { title: "My shop", href: "/my-shop", icon: "🛒" },
  { title: "News", href: "/news", icon: "📰" },
  { title: "Triển lãm kỷ yếu số", href: "/trien-lam-ky-yeu-so", icon: "🖼️" },
  { title: "Profile", href: "/profile", icon: "👤" },
  { title: "Kết nối", href: "/ket-noi", icon: "🔗" },
  { title: "Function", href: "/function", icon: "⚙️" },
  { title: "Kỷ niệm năm xưa", href: "/ky-niem-nam-xua", icon: "📅" },
  { title: "Feeling & Moments", href: "/feeling-and-moments", icon: "😊" },
  { title: "Sắp ra mắt", href: "/sap-ra-mat", icon: "🚀" },
  { title: "Tiện ích cuộc sống", href: "/tien-ich-cuoc-song", icon: "💡" },
  { title: "Brain Funny", href: "/brain-funny", icon: "🧠" },
]

export const reactions = [
  {
    type: "like",
    label: "Thích",
    icon: <FaThumbsUp className="text-blue-500" />,
    color: "text-blue-500",
  },
  {
    type: "love",
    label: "Yêu thích",
    icon: <FaHeart className="text-red-500" />,
    color: "text-red-500",
  },
  {
    type: "haha",
    label: "Haha",
    icon: <FaLaughSquint className="text-yellow-500" />,
    color: "text-yellow-500",
  },
  {
    type: "wow",
    label: "Wow",
    icon: <FaSurprise className="text-yellow-400" />,
    color: "text-yellow-400",
  },
  {
    type: "sad",
    label: "Buồn",
    icon: <FaSadTear className="text-blue-400" />,
    color: "text-blue-400",
  },
  {
    type: "angry",
    label: "Tức giận",
    icon: <FaAngry className="text-red-600" />,
    color: "text-red-600",
  },
];

export const reactionColors: Record<string, string> = {
  like: "text-blue-500",
  love: "text-red-500",
  haha: "text-yellow-400",
  wow: "text-yellow-500",
  sad: "text-blue-500",
  angry: "text-orange-500",
};
export const actions = [
  { label: "Bài đăng", icon: "📝" },
  { label: "Thiết kế ảnh", icon: "🎨" },
  { label: "Hình ảnh", icon: "🖼️" },
  { label: "Video", icon: "🎬" },
  { label: "Phát trực tiếp", icon: "📺" },
  { label: "Mp3", icon: "🎵" },
  { label: "Tài liệu", icon: "📄" },
  { label: "Thẻ", icon: "🙋" },
  { label: "Đóng góp", icon: "🤝" },
  { label: "Khảo sát", icon: "📊" },
  { label: "Sự kiện", icon: "📅" },
  { label: "Hành động", icon: "🎯" },
  { label: "Địa chỉ", icon: "📍" },
  { label: "Gửi vị trí", icon: "📡" },
];