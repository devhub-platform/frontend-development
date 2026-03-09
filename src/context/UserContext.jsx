/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/set-state-in-effect */
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext(null);

export default function UserContextProvider({ children }) {
  // بنقرأ التوكين "خام" مباشرة من اللوكال استوردج
  const [userData, setUserData] = useState(
    localStorage.getItem("userToken") || null,
  );

  useEffect(() => {
    // كود الـ Social Login اللي بيسحب التوكين من الـ URL
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");

    if (tokenFromUrl) {
      localStorage.setItem("userToken", tokenFromUrl);
      setUserData(tokenFromUrl);
      // تنظيف الـ URL بعد سحب التوكين
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
}
