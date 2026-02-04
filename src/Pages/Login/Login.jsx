import { Mail, Lock, Eye, EyeOff, Github, LoaderPinwheel } from "lucide-react";
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

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();
  const { setUserData } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);

  async function handleLogin(values) {
    try {
      setLoading(true);
      let { data } = await axios.post(
        `https://ecommerce.routemisr.com/api/v1/auth/signin`,
        values,
      );
      localStorage.setItem("userToken", data.token);
      setUserData(data.token);
      navigate("/home");
    } catch (error) {
      setApiError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  let validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  let formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: handleLogin,
  });

  return (
    <>
      <Helmet>
        <title>DevHub | Login</title>
      </Helmet>

      <div className="min-h-screen w-full relative flex items-center justify-center p-4 overflow-hidden font-sans">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          <img
            src={AuthBG}
            alt="Developer Workspace"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-br from-primary/90 via-[#1e293b]/95 to-black dark:from-primary/40 dark:via-[#0f172a]/95 dark:to-black transition-all duration-500"></div>
        </div>

        {/* The Glass Card */}
        <div className="relative z-10 w-full max-w-275 grid lg:grid-cols-2 bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden">
          {/* Left Content Side */}
          <div className="hidden lg:flex flex-col justify-center p-20 text-white border-r border-white/10">
            <Link to="/">
              <div className="flex items-center gap-3 mb-12 cursor-pointer">
                <img src={LogoBlack} className="w-72" alt="Logo" />
              </div>
            </Link>
            <h2 className="text-5xl font-extrabold mb-6 leading-[1.1]">
              Elevate your <br />
              <span className="text-primary italic">Code Craft.</span>
            </h2>
            <p className="text-slate-300 text-lg max-w-sm leading-relaxed mb-10">
              The professional ecosystem for developers to build, share, and
              grow together.
            </p>
            <div className="flex gap-4">
              <div className="h-1.5 w-16 bg-primary rounded-full"></div>
              <div className="h-1.5 w-6 bg-white/20 rounded-full"></div>
              <div className="h-1.5 w-6 bg-white/20 rounded-full"></div>
            </div>
          </div>

          {/* Right Form Side */}
          <div className="bg-white/95 dark:bg-[#111827]/98 p-8 md:p-12 flex flex-col justify-center transition-colors duration-300">
            <div className="max-w-md mx-auto w-full">
              <Link to="/">
                <div className="mb-8 lg:hidden flex items-center gap-2 cursor-pointer justify-center">
                  {theme === "dark" ? (
                    <img src={LogoBlack} className="w-32" alt="Logo" />
                  ) : (
                    <img src={LogoWhite} className="w-32" alt="Logo" />
                  )}
                </div>
              </Link>

              <div className="mb-6">
                <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  Login
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  Please enter your account details.
                </p>
              </div>

              {apiError && (
                <div className="p-4 mb-6 text-sm font-semibold bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-l-4 border-red-500 rounded-r-xl">
                  {apiError}
                </div>
              )}

              <form onSubmit={formik.handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest ml-1">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input
                      {...formik.getFieldProps("email")}
                      type="email"
                      className="w-full h-12 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 focus:border-primary rounded-2xl pl-12 pr-4 outline-none transition-all dark:text-white shadow-sm placeholder:text-slate-400"
                      placeholder="John Doe@devhub.com"
                    />
                  </div>
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-[10px] font-bold text-red-500 ml-2">
                      {formik.errors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center px-1">
                    <label className="block text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest">
                      Password
                    </label>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input
                      {...formik.getFieldProps("password")}
                      type={showPassword ? "text" : "password"}
                      className="w-full h-12 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 focus:border-primary rounded-2xl pl-12 pr-12 outline-none transition-all dark:text-white shadow-sm placeholder:text-slate-400"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {formik.touched.password && formik.errors.password && (
                    <p className="text-[10px] font-bold text-red-500 ml-2">
                      {formik.errors.password}
                    </p>
                  )}
                </div>

                <div className="flex justify-end mt-2!">
                  <Link
                    to="/forgot"
                    className="text-xs font-bold text-primary hover:underline transition-all"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black text-lg rounded-2xl shadow-xl shadow-primary/30 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:transform-none"
                >
                  {loading ? (
                    <LoaderPinwheel className="animate-spin w-6 h-6" />
                  ) : (
                    "SIGN IN TO HUB"
                  )}
                </button>

                <div className="relative flex items-center justify-center py-1">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                  </div>
                  <span className="relative px-4 bg-white dark:bg-[#111827] text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                    Social Access
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-3 h-12 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-bold text-slate-700 dark:text-slate-300 text-sm"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#003890"
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-1.96 5.36-7.84 5.36-5.08 0-9.24-4.2-9.24-9.36s4.16-9.36 9.24-9.36c2.88 0 4.84 1.2 5.96 2.28l2.56-2.52C18.6 1.12 15.76 0 12.48 0 5.6 0 0 5.6 0 12.48s5.6 12.48 12.48 12.48c7.16 0 11.92-5.04 11.92-12.12 0-.84-.08-1.48-.2-2.12h-11.72z"
                      />
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center gap-3 h-12 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-bold text-slate-700 dark:text-slate-300 text-sm"
                  >
                    <Github className="w-5 h-5" />
                    GitHub
                  </button>
                </div>
              </form>

              <div className="mt-8 text-center">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                  Don't have an account?
                  <Link
                    to="/register"
                    className="ml-2 text-primary font-black hover:underline tracking-tight"
                  >
                    JOIN THE HUB
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
