import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  return (
    <>
      {localStorage.getItem("userToken") ? children : <Navigate to="/login" />}
    </>
  );
}
