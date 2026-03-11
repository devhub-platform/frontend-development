/* eslint-disable no-unused-vars */
import { Lock, Eye, EyeOff, LoaderPinwheel, ShieldCheck } from "lucide-react";
import { useState } from "react";
import Helmet from "react-helmet";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate, Link } from "react-router-dom";
import AuthBG from "../../assets/images/AuthBG.avif";
import LogoBlack from "../../assets/images/DevHubLogoWhite.png";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "User Email";
  const otp = location.state?.otp;

  async function handleReset(values) {
    try {
      setLoading(true);
      const payload = {
        email: email,
        otp: otp,
        password: values.password,
        password_confirmation: values.password_confirmation,
      };

      const { data } = await axios.post(
        `http://devhub.eu-north-1.elasticbeanstalk.com/api/v1/password/reset`,
        payload,
      );

      if (data.success || data.status === 200 || data.message?.includes("reset")) {
        toast.success("Password reset successful! Redirecting to login...");
        navigate("/login");
      }
    } catch (error) {
      setApiError(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  }

  let validationSchema = Yup.object().shape({
    password: Yup.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
        "Must be 8+ chars, with Uppercase, Lowercase, Number and Symbol",
      )
      .required("Password is required"),
    password_confirmation: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords don't match")
      .required("Confirm password is required"),
  });

  let formik = useFormik({
    initialValues: { password: "", password_confirmation: "" },
    validationSchema,
    onSubmit: handleReset,
  });

  return (
    <>
      <Helmet>
        <title>DevHub | Reset Password</title>
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
              <span className="text-blue-700 italic">Account.</span>
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
                      {...formik.getFieldProps("password_confirmation")}
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
                  {formik.touched.password_confirmation &&
                    formik.errors.password_confirmation && (
                      <p className="text-xs font-bold text-red-500 ml-2">
                        {formik.errors.password_confirmation}
                      </p>
                    )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black text-lg rounded-2xl shadow-xl shadow-primary/30 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
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
