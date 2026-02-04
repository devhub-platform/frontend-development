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
          <div className="absolute inset-0 bg-linear-to-br from-primary/90 via-[#1e293b]/95 to-black dark:from-primary/40 dark:via-[#0f172a]/95 dark:to-black transition-all duration-500"></div>
        </div>

        <div className="relative z-10 w-full max-w-275 grid lg:grid-cols-2 bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden">
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
                  className="w-full h-14 mt-4 bg-primary hover:bg-primary/90 text-white font-black text-lg rounded-2xl shadow-xl shadow-primary/30 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {loading ? (
                    <LoaderPinwheel className="animate-spin w-6 h-6" />
                  ) : (
                    <>
                      <UserPlus size={20} /> JOIN THE HUB
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
                Already a member?{" "}
                <Link
                  to="/login"
                  className="text-primary font-black hover:underline ml-1"
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
