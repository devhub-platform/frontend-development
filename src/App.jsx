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
import UsersProfile from "./Pages/UsersProfile/UsersProfile";
import OTPVerification from "./Pages/OTPVerification/OTPVerification";
import ResetPassword from "./Pages/ResetPassword/ResetPassword";
import EditorGuide from "./Pages/EditorGuide";
import AskQuestionPage from "./Pages/AskQuestion/AskQuestionPage";
import QuestionPage from "./Pages/Question/QuestionPage";
import CodePlaygroundPage from "./Pages/Playground/CodePlaygroundPage";
import Interests from "./Pages/Interests/Interests";
import Recommendations from "./Pages/Recommendations/Recommendations";
import AuthCallback from "./Pages/AuthCallback";
import ReadingListDetails from "./Components/ReadingListDetails/ReadingListDetails";
import MyFollowing from "./Pages/MyFollowing/MyFollowing";
import MyFollowers from "./Pages/MyFollowers/MyFollowers";
import UserFollowing from "./Pages/UsersFollowing/UsersFollowing";
import UserFollowers from "./Pages/UsersFollowers/UsersFollowers";
import Settings from "./Pages/Settings/Settings";
import QuestionsByTag from "./Pages/QuestionsByTag/QuestionsByTag";
import GoogleCallback from "./Pages/Auth/GoogleCallback";
import GithubCallback from "./Pages/Auth/GithubCallback";

function App() {
  return (
    <BrowserRouter basename="/frontend-development">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/social-callback" element={<AuthCallback />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/otp-verification" element={<OTPVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/interests" element={<Interests />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/auth/google" element={<GoogleCallback />} />
        <Route path="/auth/github/callback" element={<GithubCallback />} />
        <Route path="/" element={<Layout />}>
          <Route path="home" element={<Home />} />
          <Route path="trending" element={<Trending />} />
          <Route path="post/:id" element={<Post />} />
          <Route path="qa" element={<QA />} />
          <Route path="ask" element={<AskQuestionPage />} />
          <Route path="/questions/:id" element={<QuestionPage />} />
          <Route path="/questions/tag/:tagName" element={<QuestionsByTag />} />
          <Route path="aichat" element={<AIChat />} />
          <Route path="/playground" element={<CodePlaygroundPage />} />
          <Route path="notification" element={<Notifications />} />
          <Route path="write" element={<Write />} />
          <Route path="profile" element={<Profile />} />
          <Route path="/users/:id" element={<UsersProfile />} />
          <Route path="/reading-list/:id" element={<ReadingListDetails />} />
          <Route path="my-followers" element={<MyFollowers />} />
          <Route path="my-following" element={<MyFollowing />} />
          <Route path="/users/:id/followers" element={<UserFollowers />} />
          <Route path="/users/:id/following" element={<UserFollowing />} />
          <Route path="editor-guide" element={<EditorGuide />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
