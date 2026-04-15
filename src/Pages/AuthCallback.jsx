import { useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import toast from "react-hot-toast";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUserData } = useContext(UserContext);

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("userToken", token);
      setUserData(token);
      toast.success("Login Successful!");
      navigate("/home");
    } else {
      toast.error("Failed to get token");
      navigate("/login");
    }
  }, [navigate, searchParams, setUserData]);

  return (
    <div className="h-screen flex items-center justify-center bg-white dark:bg-slate-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600 mb-4 mx-auto"></div>
        <p className="text-lg font-semibold text-slate-700 dark:text-white">
          جاري تسجيل الدخول...
        </p>
      </div>
    </div>
  );
}
