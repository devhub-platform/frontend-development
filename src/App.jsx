import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./Pages/Landing/Landing";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import ForgotPassword from "./Pages/ForgotPassword/ForgotPassword";
import Layout from "./Components/Layout/Layout";
import NotFound from "./Pages/NotFound/NotFound";
import Home from "./Pages/Home/Home";
import Trending from "./Pages/Trending/Trending";
import QA from "./Pages/QA/QA";
import AIChat from "./Pages/AIChat/AIChat";
import Code from "./Pages/Code/Code";
import Notifications from "./Pages/Notifications/Notifications";
import Write from "./Pages/Write/Write";
import Profile from "./Pages/Profile/Profile";
import UserContextProvider from "./context/UserContext";
import OTPVerification from "./Pages/OTPVerification/OTPVerification";
import ResetPassword from "./Pages/ResetPassword/ResetPassword";

function App() {
  
  return (
    <>
      <UserContextProvider>
        <BrowserRouter basename="/frontend-development">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/" element={<Layout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="login/forgotpassword" element={<ForgotPassword />} />
              <Route path="home" element={<Home />} />
              <Route path="trending" element={<Trending />} />
              <Route path="qa" element={<QA />} />
              <Route path="aichat" element={<AIChat />} />
              <Route path="code" element={<Code />} />
              <Route path="notification" element={<Notifications />} />
              <Route path="write" element={<Write />} />
              <Route path="profile" element={<Profile />} />
              <Route path="otp-verification" element={<OTPVerification />} />
              <Route path="reset-password" element={<ResetPassword />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </UserContextProvider>
    </>
  );
}

export default App;
