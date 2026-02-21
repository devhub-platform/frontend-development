/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useEffect, useState } from "react";
import CryptoJS from "crypto-js";
// eslint-disable-next-line react-refresh/only-export-components
export let UserContext = createContext();
export default function UserContextProvider({ children }) {
  const [userData, setUserData] = useState(null);
  const key = import.meta.env.VITE_SECRET_KEY;
  useEffect(() => {
    const savedToken = localStorage.getItem("userToken");
    if (savedToken) {
      try {
        // فك التشفير
        const bytes = CryptoJS.AES.decrypt(savedToken, key);
        const originalToken = bytes.toString(CryptoJS.enc.Utf8);

        if (originalToken) {
          setUserData(originalToken);
        }
      } catch (e) {
        console.error("Token decryption failed", e);
        localStorage.removeItem("userToken");
      }
    }
  }, []);
  return (
    <>
      <UserContext.Provider value={{ userData, setUserData }}>
        {children}
      </UserContext.Provider>
    </>
  );
}
