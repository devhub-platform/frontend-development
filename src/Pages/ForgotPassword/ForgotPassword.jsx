import { Mail, ArrowLeft } from "lucide-react";
import Helmet from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const handleEmail = (values) => {
    console.log(values);
    navigate("/otp-verification",{ state: { email: values.email } });
  };
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  let formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: handleEmail,
  });
  return (
    <>
      <Helmet>
        <title>DevHub | Reset Your Password</title>
      </Helmet>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans dark:bg-bg-primary-dark">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-blue-100/50 my-7 dark:bg-bg-secondary-dark dark:shadow-gray-700/30">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-serif font-bold text-[#1e293b] mb-3 dark:text-white">
                Reset Password
              </h1>
              <p className="text-gray-400 text-sm font-medium">
                Enter your email to receive a verification code
              </p>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-bold text-[#0F172A] ml-1 dark:text-white/95"
                >
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-gray-400 transition-colors dark:text-text-dark" />
                  <input
                    value={formik.values.email}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full rounded-xl h-12 pl-12 pr-4 border-2 border-gray-200 text-gray-600 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 outline-none transition-all bg-white dark:bg-bg-primary-dark dark:text-gray-50 dark:border-gray-700 dark:hover:border-text-light dark:focus:border-primary dark:focus:ring-blue-900"
                  />
                </div>
              </div>
              {formik.errors.email && formik.touched.email && (
                <p className="mb-3 text-xs text-red-500">
                  {formik.errors.email}
                </p>
              )}

              {/* Main button */}
              <button
                type="submit"
                className="w-full h-12 mt-2 rounded-xl bg-primary text-white font-bold text-lg shadow-lg hover:-translate-y-1 transition-all"
              >
                Send Verification Code
              </button>

              <div>
                <div className="text-center">
                  <Link
                    to="/login"
                    className="inline-flex font-semibold -ml-2 items-center gap-2 text-text-light hover:text-primary dark:text-text-dark dark:hover:text-text-light"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
