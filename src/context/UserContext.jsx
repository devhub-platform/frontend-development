import { createContext, useEffect, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export let UserContext = createContext();
export default function UserContextProvider({ children }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("userToken")) {
      setUserData(localStorage.getItem("userToken"));
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
