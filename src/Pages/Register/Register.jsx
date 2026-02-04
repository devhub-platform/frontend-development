import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Github,
  LoaderPinwheel,
  User,
  UserPlus,
} from "lucide-react";
import { useContext, useState } from "react";
import Helmet from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import AuthBG from "../../assets/images/AuthBG.avif";
import LogoBlack from "../../assets/images/DevHubLogoWhite.png";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUserData } = useContext(UserContext);

  async function handleRegister(values) {
    try {
      setLoading(true);
      let { data } = await axios.post(
        `https://ecommerce.routemisr.com/api/v1/auth/signup`,
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

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Min length is 3")
      .max(10, "Max length is 10")
      .required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .matches(/^[A-z]\w{5,10}$/, "Password must be 6-10 chars")
      .required("Password is required"),
    rePassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords don't match")
      .required("Re-password is required"),
  });

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "", rePassword: "" },
    validationSchema,
    onSubmit: handleRegister,
  });

  return (
    <>
      <Helmet>
        <title>DevHub | Register</title>
      </Helmet>
      <div className="min-h-screen w-full relative flex items-center justify-center p-4 overflow-hidden font-sans">
        <div className="absolute inset-0 z-0">
          <img src={AuthBG} alt="BG" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-br from-primary/90 via-[#1e293b]/95 to-black dark:from-primary/60 dark:via-[#0f172a]/95 dark:to-gray-900 transition-all duration-500"></div>
        </div>

        <div className="relative z-10 w-full max-w-275 grid lg:grid-cols-2 bg-white/5 backdrop-blur-xl rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden">
          {/* Left Side */}
          <div className="hidden lg:flex flex-col justify-center p-20 text-white border-r border-white/10">
            <Link to="/">
              <img src={LogoBlack} className="w-72 mb-12" />
            </Link>
            <h2 className="text-5xl font-extrabold mb-6 leading-[1.1]">
              Build your <br />
              <span className="text-primary italic">Legacy here.</span>
            </h2>
            <p className="text-slate-300 text-lg max-w-sm mb-10">
              Join thousands of developers in the most advanced ecosystem.
            </p>
            <div className="flex gap-4">
              <div className="h-1.5 w-6 bg-white/20 rounded-full"></div>
              <div className="h-1.5 w-16 bg-primary rounded-full"></div>
              <div className="h-1.5 w-6 bg-white/20 rounded-full"></div>
            </div>
          </div>

          {/* Right Side */}
          <div className="bg-white/95 dark:bg-[#111827]/98 p-8 md:p-12 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              <div className="mb-6">
                <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  Create Account
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
                  Get started with your developer hub today.
                </p>
              </div>

              {apiError && (
                <div className="p-4 mb-6 text-sm font-semibold bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-l-4 border-red-500 rounded-r-xl">
                  {apiError}
                </div>
              )}

              <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest ml-1">
                    Full Name
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input
                      {...formik.getFieldProps("name")}
                      type="text"
                      className="w-full h-12 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 focus:border-primary rounded-2xl pl-12 pr-4 outline-none transition-all dark:text-white"
                      placeholder="John Doe"
                    />
                  </div>
                  {formik.touched.name && formik.errors.name && (
                    <p className="text-[10px] font-bold text-red-500 ml-2">
                      {formik.errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest ml-1">
                    Email
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input
                      {...formik.getFieldProps("email")}
                      type="email"
                      className="w-full h-12 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 focus:border-primary rounded-2xl pl-12 pr-4 outline-none transition-all dark:text-white"
                      placeholder="John Doe@devhub.com"
                    />
                  </div>
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-[10px] font-bold text-red-500 ml-2">
                      {formik.errors.email}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest ml-1">
                      Password
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary" />
                      <input
                        {...formik.getFieldProps("password")}
                        type={showPassword ? "text" : "password"}
                        className="w-full h-12 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 focus:border-primary rounded-2xl pl-10 pr-10 outline-none transition-all dark:text-white text-sm"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary"
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest ml-1">
                      Confirm
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary" />
                      <input
                        {...formik.getFieldProps("rePassword")}
                        type={showConfirmPassword ? "text" : "password"}
                        className="w-full h-12 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 focus:border-primary rounded-2xl pl-10 pr-10 outline-none transition-all dark:text-white text-sm"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 mt-6 bg-primary hover:bg-primary/90 text-white font-black text-lg rounded-2xl shadow-xl shadow-primary/30 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
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
                  <span className="relative px-4 bg-white dark:bg-[#111827] text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                    Social Access
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center rounded-xl h-12 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 transition-all font-medium dark:bg-bg-primary-dark dark:text-text-dark dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:border-gray-600"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </button>

                <button
                  type="button"
                  className="flex items-center justify-center rounded-xl h-12 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 transition-all font-medium dark:bg-bg-primary-dark dark:text-text-dark dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:border-gray-600"
                >
                  <Github className="w-5 h-5 mr-2" />
                  GitHub
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
