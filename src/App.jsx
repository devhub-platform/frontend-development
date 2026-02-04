import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./Pages/Landing/Landing";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import ForgotPassword from "./Pages/ForgotPassword/ForgotPassword";
import Layout from "./Components/Layout/Layout";
import NotFound from "./Pages/NotFound/NotFound";
import Home from "./Pages/Home/Home";
import Trending from "./Pages/Trending/Trending";
import Post from "./Pages/PostDetails/PostDetails";
import QA from "./Pages/QA/QA";
import AIChat from "./Pages/AIChat/AIChat";
import Notifications from "./Pages/Notifications/Notifications";
import Write from "./Pages/Write/Write";
import Profile from "./Pages/Profile/Profile";
import OTPVerification from "./Pages/OTPVerification/OTPVerification";
import ResetPassword from "./Pages/ResetPassword/ResetPassword";
import EditorGuide from "./Pages/EditorGuide";
import AskQuestionPage from "./Pages/AskQuestion/AskQuestionPage";
import QuestionPage from "./Pages/Question/QuestionPage";
import CodePlaygroundPage from "./Pages/Playground/CodePlaygroundPage";

// ... Imports كما هي

function App() {
  return (
    <BrowserRouter basename="/frontend-development">
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/otp-verification" element={<OTPVerification />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="/" element={<Layout />}>
          <Route path="home" element={<Home />} />
          <Route path="trending" element={<Trending />} />
          <Route path="post/:id" element={<Post />} />
          <Route path="qa" element={<QA />} />
          <Route path="ask" element={<AskQuestionPage />} />
          <Route path="/questions/:id" element={<QuestionPage />} />
          <Route path="aichat" element={<AIChat />} />
          <Route path="/playground" element={<CodePlaygroundPage />} />
          <Route path="notification" element={<Notifications />} />
          <Route path="write" element={<Write />} />
          <Route path="profile" element={<Profile />} />
          <Route path="editor-guide" element={<EditorGuide />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
