/* eslint-disable no-unused-vars */
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LoaderPinwheel,
  User,
  UserPlus,
} from "lucide-react";
import { useContext, useState } from "react";
import Helmet from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { UserContext } from "../../context/UserContext";
import AuthBG from "../../assets/images/AuthBG.avif";
import LogoBlack from "../../assets/images/DevHubLogoWhite.png";
import LogoWhite from "../../assets/images/DevHubLogoBlack.png";
import { ThemeContext } from "../../context/ThemeContext";
import { FaGoogle, FaGithub } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

import axiosInstance from "../../config/api";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);

  const navigate = useNavigate();
  const { setUserData } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  async function handleRegister(values) {
    try {
      setLoading(true);
      setApiError(null);

      const { data } = await axiosInstance.post(`/register`, values, {
        headers,
      });

      if (data.token) {
        localStorage.setItem("userToken", data.token);
        setUserData(data.token);
        localStorage.setItem("userEmail", values.email);

        try {
          await axiosInstance.post(
            `/email/send-otp`,
            { email: values.email },
            { headers },
          );
        } catch (e) {
          console.log("OTP Auto-send failed");
        }

        navigate("/otp-verification", { state: { email: values.email } });
      }
    } catch (error) {
      setApiError(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Min length is 3")
      .max(50, "Max length is 50")
      .required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#_^])[A-Za-z\d@$!%*?&#_^]{8,}$/,
        "Must be 8+ chars, with Uppercase, Lowercase, Number and Symbol",
      )
      .required("Password is required"),
    password_confirmation: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords don't match")
      .required("Re-password is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
    validationSchema,
    onSubmit: handleRegister,
  });

  // ========== Social Login ==========
  const handleGoogleLogin = async () => {
    try {
      setSocialLoading(true);
      const { data } = await axiosInstance.post(
        `/front/auth/google/login`,
        {},
        { headers },
      );
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Google login URL not received");
      }
    } catch (error) {
      console.error(error);
      toast.error("Google login failed");
    } finally {
      setSocialLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    try {
      setSocialLoading(true);
      const { data } = await axiosInstance.post(
        `/front/auth/github/login`,
        {},
        { headers },
      );
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("GitHub login URL not received");
      }
    } catch (error) {
      console.error(error);
      toast.error("GitHub login failed");
    } finally {
      setSocialLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>DevHub | Register</title>
      </Helmet>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "var(--toast-bg)",
            color: "var(--toast-text)",
            border: "1px solid var(--toast-border)",
            borderRadius: "12px",
            padding: "12px 14px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
          },
          success: {
            iconTheme: { primary: "var(--color-primary)", secondary: "white" },
            style: { border: "1px solid rgba(0,56,144,0.25)" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "white" },
          },
        }}
      />
      <div className="min-h-screen w-full relative flex items-center justify-center p-4 overflow-hidden font-sans">
        <div className="absolute inset-0 z-0">
          <img src={AuthBG} alt="BG" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-br from-primary/90 via-[#1e293b]/95 to-black dark:from-primary/60 dark:via-[#0f172a]/95 dark:to-gray-900 transition-all duration-500"></div>
        </div>

        <div className="relative z-10 w-full max-w-275 grid lg:grid-cols-2 bg-white/5 backdrop-blur-xl rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden">
          {/* Left Side */}
          <div className="hidden lg:flex flex-col justify-center p-20 text-white border-r border-white/10">
            <Link to="/">
              <img src={LogoBlack} className="w-72 mb-12" />
            </Link>
            <h2 className="text-5xl font-extrabold mb-6 leading-[1.1]">
              Build your <br />
              <span className="text-blue-700 italic">Legacy here.</span>
            </h2>
            <p className="text-slate-300 text-lg max-w-sm mb-10">
              Join thousands of developers in the most advanced ecosystem.
            </p>
            <div className="flex gap-4">
              <div className="h-1.5 w-6 bg-primary rounded-full"></div>
              <div className="h-1.5 w-16 bg-white/20 rounded-full"></div>
              <div className="h-1.5 w-6 bg-white/20 rounded-full"></div>
            </div>
          </div>

          {/* Right Side */}
          <div className="bg-white/95 dark:bg-bg-secondary-dark p-8 md:p-12 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              <div className="mb-6">
                <div className="flex items-center justify-center">
                  <Link to="/">
                    {theme === "dark" ? (
                      <img src={LogoBlack} className="w-72 mb-12 lg:hidden" />
                    ) : (
                      <img src={LogoWhite} className="w-72 mb-12 lg:hidden" />
                    )}
                  </Link>
                </div>
                <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  Create Account
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
                  Get started with your developer hub today.
                </p>
              </div>

              {apiError && (
                <div className="p-4 mb-6 text-xl font-semibold bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-l-4 border-red-500 rounded-r-xl">
                  {apiError}
                </div>
              )}

              <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[13px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest ml-1">
                    Full Name
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary dark:group-focus-within:text-text-dark transition-colors" />
                    <input
                      {...formik.getFieldProps("name")}
                      type="text"
                      className="w-full h-12 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 focus:border-primary dark:focus:border-text-dark rounded-2xl pl-12 pr-4 outline-none transition-all dark:text-white"
                      placeholder="Enter Your Full Name"
                    />
                  </div>
                  {formik.touched.name && formik.errors.name && (
                    <p className="text-[13px] font-bold text-red-500 ml-2">
                      {formik.errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[13px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest ml-1">
                    Email
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors dark:group-focus-within:text-text-dark" />
                    <input
                      {...formik.getFieldProps("email")}
                      type="email"
                      className="w-full h-12 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 focus:border-primary dark:focus:border-text-dark rounded-2xl pl-12 pr-4 outline-none transition-all dark:text-white"
                      placeholder="Enter Your Email Address"
                    />
                  </div>
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-[13px] font-bold text-red-500 ml-2">
                      {formik.errors.email}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[13px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest ml-1">
                      Password
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary dark:group-focus-within:text-text-dark" />
                      <input
                        {...formik.getFieldProps("password")}
                        type={showPassword ? "text" : "password"}
                        className="w-full h-12 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 focus:border-primary dark:focus:border-text-dark rounded-2xl pl-10 pr-10 outline-none transition-all dark:text-white text-sm"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary dark:hover:text-text-dark"
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                    {formik.touched.password && formik.errors.password && (
                      <p className="text-[13px] font-bold text-red-500 ml-2 mt-1">
                        {formik.errors.password}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[13px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest ml-1">
                      Confirm
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary dark:group-focus-within:text-text-dark" />
                      <input
                        {...formik.getFieldProps("password_confirmation")}
                        type={showConfirmPassword ? "text" : "password"}
                        className="w-full h-12 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 focus:border-primary dark:focus:border-text-dark rounded-2xl pl-10 pr-10 outline-none transition-all dark:text-white text-sm"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary dark:hover:text-text-dark"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                    {formik.touched.password_confirmation &&
                      formik.errors.password_confirmation && (
                        <p className="text-[13px] font-bold text-red-500 ml-2 mt-1">
                          {formik.errors.password_confirmation}
                        </p>
                      )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 mt-6 bg-primary hover:bg-primary/90 text-white font-black text-lg rounded-2xl hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-70 cursor-pointer disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <LoaderPinwheel className="animate-spin w-6 h-6" />
                  ) : (
                    <>
                      <UserPlus size={20} /> JOIN THE HUB
                    </>
                  )}
                </button>

                <div className="relative flex items-center justify-center py-1">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                  </div>
                  <span className="relative px-4 bg-white dark:bg-[#131827] text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                    Social Access
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled={socialLoading}
                    className="flex items-center justify-center rounded-xl h-12 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 transition-all font-medium dark:bg-bg-primary-dark dark:text-text-dark dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:border-gray-600 cursor-pointer disabled:opacity-70"
                    onClick={handleGoogleLogin}
                  >
                    <FaGoogle className="w-5 h-5 mr-2" />
                    {socialLoading ? "Loading..." : "Google"}
                  </button>

                  <button
                    type="button"
                    disabled={socialLoading}
                    className="flex items-center justify-center rounded-xl h-12 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 transition-all font-medium dark:bg-bg-primary-dark dark:text-text-dark dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:border-gray-600 cursor-pointer disabled:opacity-70"
                    onClick={handleGithubLogin}
                  >
                    <FaGithub className="w-5 h-5 mr-2" />
                    {socialLoading ? "Loading..." : "GitHub"}
                  </button>
                </div>
              </form>

              <div className="mt-8 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
                Already a member?{" "}
                <Link
                  to="/login"
                  className="font-bold text-text-light ml-1 hover:text-primary hover:underline dark:text-text-dark dark:hover:text-text-light"
                >
                  SIGN IN
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
