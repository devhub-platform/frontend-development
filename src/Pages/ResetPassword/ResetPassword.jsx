/* eslint-disable no-unused-vars */
import { Lock, Eye, EyeOff, LoaderPinwheel, ShieldCheck } from "lucide-react";
import { useState } from "react";
import Helmet from "react-helmet";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate, Link } from "react-router-dom";
import AuthBG from "../../assets/images/AuthBG.avif";
import LogoBlack from "../../assets/images/DevHubLogoWhite.png";

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "User Email";

  async function handleReset(values) {
    try {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        navigate("/login");
        setLoading(false);
      }, 1500);
    } catch (error) {
      setApiError("Something went wrong.");
      setLoading(false);
    }
  }

  let validationSchema = Yup.object().shape({
    password: Yup.string()
      .matches(/^[A-z]\w{5,10}$/, "Password must be 6-10 chars (Ex: Yasmine36)")
      .required("Password is required"),
    rePassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords don't match")
      .required("Confirm password is required"),
  });

  let formik = useFormik({
    initialValues: { password: "", rePassword: "" },
    validationSchema,
    onSubmit: handleReset,
  });

  return (
    <>
      <Helmet>
        <title>DevHub | Reset Password</title>
      </Helmet>

      <div className="min-h-screen w-full relative flex items-center justify-center p-4 overflow-hidden font-sans">
        <div className="absolute inset-0 z-0">
          <img src={AuthBG} alt="BG" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-br from-primary/90 via-[#1e293b]/95 to-black dark:from-primary/60 dark:via-[#0f172a]/95 dark:to-gray-900"></div>
        </div>

        <div className="relative z-10 w-full max-w-275 grid lg:grid-cols-2 bg-white/5 backdrop-blur-xl rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden">
          {/* Left Side */}
          <div className="hidden lg:flex flex-col justify-center p-20 text-white border-r border-white/10">
            <Link to="/">
              <img src={LogoBlack} className="w-72 mb-12" alt="Logo" />
            </Link>
            <h2 className="text-5xl font-extrabold mb-6 leading-[1.1]">
              Secure your <br />
              <span className="text-primary italic">Account.</span>
            </h2>
            <p className="text-slate-300 text-lg max-w-sm mb-10">
              Almost there! Create a strong password that you haven't used
              before to keep your workspace safe.
            </p>
          </div>

          {/* Right Side */}
          <div className="bg-white/95 dark:bg-[#111827]/98 p-8 md:p-16 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              <div className="mb-10">
                <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  New Password
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
                  Setting up password for {email}
                </p>
              </div>

              <form onSubmit={formik.handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-[13px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest ml-1">
                    New Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input
                      {...formik.getFieldProps("password")}
                      type={showPassword ? "text" : "password"}
                      className="w-full h-14 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 focus:border-primary rounded-2xl pl-12 pr-12 outline-none transition-all dark:text-white"
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
                    <p className="text-xs font-bold text-red-500 ml-2">
                      {formik.errors.password}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-[13px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest ml-1">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input
                      {...formik.getFieldProps("rePassword")}
                      type={showConfirmPassword ? "text" : "password"}
                      className="w-full h-14 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 focus:border-primary rounded-2xl pl-12 pr-12 outline-none transition-all dark:text-white"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {formik.touched.rePassword && formik.errors.rePassword && (
                    <p className="text-xs font-bold text-red-500 ml-2">
                      {formik.errors.rePassword}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black text-lg rounded-2xl shadow-xl shadow-primary/30 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {loading ? (
                    <LoaderPinwheel className="animate-spin w-6 h-6" />
                  ) : (
                    "UPDATE PASSWORD"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
