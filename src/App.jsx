import { createBrowserRouter, RouterProvider } from "react-router-dom";
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

function App() {
  let routers = createBrowserRouter([
    {
      path: "/frontend-development",
      element: <Landing />,
    },
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Landing />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "login/forgotpassword",
          element: <ForgotPassword />,
        },
        { path: "home", element: <Home /> },
        { path: "trending", element: <Trending /> },
        { path: "qa", element: <QA /> },
        { path: "aichat", element: <AIChat /> },
        { path: "code", element: <Code /> },
        { path: "notification", element: <Notifications /> },
        { path: "write", element: <Write /> },
        { path: "profile", element: <Profile /> },
      ],
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);
  return (
    <>
      <UserContextProvider>
        <RouterProvider router={routers}></RouterProvider>
      </UserContextProvider>
    </>
  );
}

export default App;
