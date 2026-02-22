/* eslint-disable no-unused-vars */
import { Mail, Lock, Eye, EyeOff, LoaderPinwheel, Github } from "lucide-react";
import { useContext, useState } from "react";
import Helmet from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import AuthBG from "../../assets/images/AuthBG.avif";
import LogoWhite from "../../assets/images/DevHubLogoBlack.png";
import LogoBlack from "../../assets/images/DevHubLogoWhite.png";
import { ThemeContext } from "../../context/ThemeContext";
import CryptoJS from "crypto-js";
import { FaGoogle, FaGithub } from "react-icons/fa";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { setUserData } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
  const key = import.meta.env.VITE_SECRET_KEY;

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  // --- Functions for Social Login ---
  const handleGoogleLogin = async () => {
    try {
      const { data } = await axios.post(
        `http://devhub.eu-north-1.elasticbeanstalk.com/api/v1/auth/google/login`,
      );
      if (data.url) window.location.href = data.url;
    } catch (error) {
      alert("Google login failed. Please try again.");
    }
  };

  const handleGithubLogin = async () => {
    try {
      const { data } = await axios.post(
        `http://devhub.eu-north-1.elasticbeanstalk.com/api/v1/auth/github/login`,
      );
      if (data.url) window.location.href = data.url;
    } catch (error) {
      alert("Github login failed. Please try again.");
    }
  };

  // --- Main Login Function ---
  async function handleLogin(values) {
    try {
      setLoading(true);
      setApiError(null);

      let { data } = await axios.post(
        `http://devhub.eu-north-1.elasticbeanstalk.com/api/v1/login`,
        values,
        { headers },
      );

      if (data.token) {
        // 1. تشفير التوكين وتخزينه
        const encryptedToken = CryptoJS.AES.encrypt(data.token, key).toString();
        localStorage.setItem("userToken", encryptedToken);

        // 2. تحديث الـ Context بالتوكين الحقيقي
        setUserData(data.token);

        // 3. هندلة خاصية Remember Me
        if (values.remember_me) {
          localStorage.setItem("rememberEmail", values.email);
        } else {
          localStorage.removeItem("rememberEmail");
        }

        navigate("/home");
      }
    } catch (error) {
      setApiError(error.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
    remember_me: Yup.boolean(),
  });

  const formik = useFormik({
    initialValues: {
      email: localStorage.getItem("rememberEmail") || "",
      password: "",
      remember_me: localStorage.getItem("rememberEmail") ? true : false,
    },
    validationSchema,
    onSubmit: handleLogin,
  });

  return (
    <>
      <Helmet>
        <title>DevHub | Login</title>
      </Helmet>

      <div className="min-h-screen w-full relative flex items-center justify-center p-4 overflow-hidden font-sans text-xl">
        <div className="absolute inset-0 z-0">
          <img src={AuthBG} alt="BG" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-br from-primary/90 via-[#1e293b]/95 to-black dark:from-primary/60 dark:via-[#0f172a]/95 dark:to-gray-900 transition-all duration-500"></div>
        </div>

        <div className="relative z-10 w-full max-w-275 grid lg:grid-cols-2 bg-white/5 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden">
          {/* Left Side (Desktop) */}
          <div className="hidden lg:flex flex-col justify-center p-20 text-white border-r border-white/10">
            <Link to="/">
              <img src={LogoBlack} className="w-72 mb-12" alt="DevHub Logo" />
            </Link>
            <h2 className="text-5xl font-extrabold mb-6 leading-[1.1]">
              Elevate your <br />
              <span className="text-blue-700 italic">Code Craft.</span>
            </h2>
            <p className="text-slate-300 text-lg max-w-sm mb-10">
              The professional ecosystem for developers to build, share, and
              grow together.
            </p>
          </div>

          {/* Right Side (Form) */}
          <div className="bg-white/95 dark:bg-[#111827]/98 p-8 md:p-12 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              <div className="mb-6">
                <div className="flex items-center justify-center">
                  <Link to="/">
                    {theme == "dark" ? (
                      <img src={LogoBlack} className="w-72 mb-12 lg:hidden" />
                    ) : (
                      <img src={LogoWhite} className="w-72 mb-12 lg:hidden" />
                    )}
                  </Link>
                </div>
                <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  Login
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
                  Welcome back to the hub.
                </p>
              </div>

              {apiError && (
                <div className="p-4 mb-6 text-sm font-semibold bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-l-4 border-red-500 rounded-r-xl">
                  {apiError}
                </div>
              )}

              <form
                onSubmit={formik.handleSubmit}
                className="space-y-4 text-[13px]"
              >
                <div className="space-y-1">
                  <label className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest ml-1">
                    Email
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary dark:group-focus-within:text-text-dark transition-colors" />
                    <input
                      {...formik.getFieldProps("email")}
                      type="email"
                      className="w-full h-12 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 focus:border-primary dark:focus:border-text-dark rounded-2xl pl-12 pr-4 outline-none transition-all dark:text-white"
                      placeholder="Enter Your Email Address"
                    />
                  </div>
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-red-500 ml-2">{formik.errors.email}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest ml-1">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary dark:group-focus-within:text-text-dark transition-colors" />
                    <input
                      {...formik.getFieldProps("password")}
                      type={showPassword ? "text" : "password"}
                      className="w-full h-12 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 focus:border-primary dark:focus:border-text-dark rounded-2xl pl-12 pr-12 outline-none transition-all dark:text-white"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary dark:hover:text-text-dark transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {formik.touched.password && formik.errors.password && (
                    <p className="text-red-500 ml-2">
                      {formik.errors.password}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <input
                      id="remember_me"
                      type="checkbox"
                      {...formik.getFieldProps("remember_me")}
                      className="w-4 h-4 rounded border-slate-300 accent-primary cursor-pointer"
                    />
                    <label
                      htmlFor="remember_me"
                      className="text-sm font-medium text-slate-600 dark:text-slate-400 cursor-pointer"
                    >
                      Remember me
                    </label>
                  </div>
                  <Link
                    to="/forgot"
                    className="text-sm font-bold text-primary dark:text-text-dark hover:text-primary dark:hover:text-text-light hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 mt-4 bg-primary hover:bg-primary/90 text-white font-black text-lg rounded-2xl hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {loading ? (
                    <LoaderPinwheel className="animate-spin w-6 h-6" />
                  ) : (
                    "SIGN IN TO HUB"
                  )}
                </button>

                <div className="relative flex items-center justify-center py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                  </div>
                  <span className="relative px-4 bg-white dark:bg-[#111827] text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                    Social Access
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="flex items-center justify-center rounded-xl h-12 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 transition-all font-medium dark:bg-bg-primary-dark dark:text-text-dark dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:border-gray-600 cursor-pointer"
                    onClick={handleGoogleLogin}
                  >
                    <FaGoogle className="w-5 h-5 mr-2" />
                    Google
                  </button>

                  <button
                    type="button"
                    className="flex items-center justify-center rounded-xl h-12 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 transition-all font-medium dark:bg-bg-primary-dark dark:text-text-dark dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:border-gray-600 cursor-pointer"
                    onClick={handleGithubLogin}
                  >
                    <FaGithub className="w-5 h-5 mr-2" />
                    GitHub
                  </button>
                </div>
              </form>

              <div className="mt-8 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
                New to the hub?{" "}
                <Link
                  to="/register"
                  className="font-bold text-primary dark:text-text-dark hover:text-primary dark:hover:text-text-light hover:underline ml-1"
                >
                  CREATE ACCOUNT
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
