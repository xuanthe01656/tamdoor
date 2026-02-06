// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth, db } from '../config/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface AuthContextType {
  currentUser: User | null;
  userRole: 'admin' | 'staff' | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'staff' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // 1. User đã đăng nhập thành công vào Firebase Auth
        try {
          // 2. Kiểm tra xem User này còn tồn tại trong Firestore không?
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          
          if (userDoc.exists()) {
            // ✅ Hợp lệ: Lưu thông tin
            setCurrentUser(user);
            setUserRole(userDoc.data().role);
          } else {
            // ⛔ BỊ CẤM: Có Auth nhưng không có Firestore (Đã bị Admin xóa)
            console.warn("User deleted from DB -> Auto Logout");
            await signOut(auth); // ĐÁ VĂNG RA KHỎI HỆ THỐNG NGAY
            setCurrentUser(null);
            setUserRole(null);
            // alert("⛔ Tài khoản của bạn không tồn tại hoặc đã bị khóa!"); 
            // (Bạn có thể bật alert này nếu muốn thông báo rõ hơn)
          }
        } catch (error) {
          console.error("Lỗi lấy quyền user:", error);
          setCurrentUser(null);
          setUserRole(null);
        }
      } else {
        // User chưa đăng nhập
        setCurrentUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ currentUser, userRole, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};