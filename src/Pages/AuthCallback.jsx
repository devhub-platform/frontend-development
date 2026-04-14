import { useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUserData } = useContext(UserContext);

  useEffect(() => {
    // إنتي هنا بتقولي للبرنامج: "بص في شريط العنوان فوق، لو لقيت كلمة token خد قيمتها"
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("userToken", token); // خزن التوكن
      setUserData(token); // عرف الأبلكيشن إن فيه يوزر دخل
      navigate("/home"); // وديه للهوم
    } else {
      navigate("/login"); // لو مفيش توكن رجعه للوجين
    }
  }, [navigate, searchParams, setUserData]);

  // شكل الصفحة وهي بتحمل
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary mb-4"></div>
        <p className="text-lg font-semibold"> Waiting...</p>
      </div>
    </div>
  );
}
