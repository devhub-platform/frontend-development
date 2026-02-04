import { Mail, ArrowLeft } from "lucide-react";
import Helmet from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import AuthBG from "../../assets/images/AuthBG.avif";
import LogoBlack from "../../assets/images/DevHubLogoWhite.png";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const handleEmail = (values) => {
    navigate("/otp-verification", { state: { email: values.email } });
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  let formik = useFormik({
    initialValues: { email: "" },
    validationSchema,
    onSubmit: handleEmail,
  });

  return (
    <>
      <Helmet>
        <title>DevHub | Reset Your Password</title>
      </Helmet>

      <div className="min-h-screen w-full relative flex items-center justify-center p-4 overflow-hidden font-sans">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          <img src={AuthBG} alt="BG" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-br from-primary/90 via-[#1e293b]/95 to-black dark:from-primary/40 dark:via-[#0f172a]/95 dark:to-black transition-all duration-500"></div>
        </div>

        {/* The Glass Card */}
        <div className="relative z-10 w-full max-w-275 grid lg:grid-cols-2 bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden">
          {/* Left Content Side */}
          <div className="hidden lg:flex flex-col justify-center p-20 text-white border-r border-white/10">
            <Link to="/">
              <img src={LogoBlack} className="w-72 mb-12" alt="Logo" />
            </Link>
            <h2 className="text-5xl font-extrabold mb-6 leading-[1.1]">
              Don't worry, <br />
              <span className="text-primary italic">We've got you.</span>
            </h2>
            <p className="text-slate-300 text-lg max-w-sm leading-relaxed mb-10">
              Forgot your entry key? Just provide your email and we'll send you
              the recovery code to get you back to the hub.
            </p>
          </div>

          {/* Right Form Side */}
          <div className="bg-white/95 dark:bg-[#111827]/98 p-8 md:p-16 flex flex-col justify-center transition-colors duration-300">
            <div className="max-w-md mx-auto w-full">
              <div className="mb-10 text-center lg:text-left">
                <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  Recover Access
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
                  Enter your email to receive a verification code.
                </p>
              </div>

              <form onSubmit={formik.handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-[13px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest ml-1">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input
                      {...formik.getFieldProps("email")}
                      type="email"
                      className="w-full h-14 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 focus:border-primary dark:focus:border-primary/50 rounded-2xl pl-12 pr-4 outline-none transition-all dark:text-white shadow-sm placeholder:text-slate-400"
                      placeholder="you@example.com"
                    />
                  </div>
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-xs font-bold text-red-500 mt-1 ml-2">
                      {formik.errors.email}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black text-lg rounded-2xl shadow-xl shadow-primary/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                >
                  SEND CODE
                </button>

                <div className="text-center mt-6">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Login
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
