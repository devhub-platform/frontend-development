import { Mail, Lock, Eye, EyeOff, Github, LoaderPinwheel } from "lucide-react";
import { useContext, useState } from "react";
import Helmet from "react-helmet";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { UserContext } from "../../context/UserContext";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();
  let { setUserData } = useContext(UserContext);
  async function handleRegister(values) {
    try {
      setLoading(true);
      let { data } = await axios.post(
        `https://ecommerce.routemisr.com/api/v1/auth/signup`,
        values
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

  let formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
    },
    validationSchema,
    onSubmit: handleRegister,
  });

  return (
    <>
      <Helmet>
        <title>DevHub | Register</title>
      </Helmet>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans dark:bg-bg-primary-dark">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-blue-100/50 my-7 dark:bg-gray-900 dark:shadow-gray-700/30">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-serif font-bold text-[#1e293b] mb-3 dark:text-white">
                Join Us
              </h1>
              <p className="text-gray-400 text-sm font-medium">
                Create your account to get started
              </p>
            </div>
            {apiError && (
              <div className="px-4 py-2 mb-4 text-sm text-red-700 rounded-lg bg-red-100">
                {apiError}
              </div>
            )}
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-bold text-[#0F172A] ml-1 dark:text-white/95"
                >
                  Full Name
                </label>

                <input
                  value={formik.values.name}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  className="w-full rounded-xl h-12 pl-5 pr-4 border border-gray-200 text-gray-600 focus:border-text-light focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white dark:bg-bg-primary-dark dark:text-gray-50 dark:border-gray-700 dark:hover:border-text-light dark:focus:border-primary dark:focus:ring-blue-900"
                  required
                />
              </div>
              {formik.errors.name && formik.touched.name && (
                <p className="mb-3 text-xs text-red-500">
                  {formik.errors.name}
                </p>
              )}
              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-bold text-[#0F172A] ml-1 dark:text-white/95"
                >
                  Email Address
                </label>

                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-text-light transition-colors dark:text-text-dark" />

                  <input
                    value={formik.values.email}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full rounded-xl h-12 pl-12 pr-4 border border-gray-200 text-gray-600 focus:border-text-light focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white dark:bg-bg-primary-dark dark:text-gray-50 dark:border-gray-700 dark:hover:border-text-light dark:focus:border-primary dark:focus:ring-blue-900"
                    required
                  />
                </div>
              </div>

              {formik.errors.email && formik.touched.email && (
                <p className="mb-3 text-xs text-red-500">
                  {formik.errors.email}
                </p>
              )}

              {/* Password */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-bold text-[#0F172A] ml-1 dark:text-white/95"
                >
                  Password
                </label>

                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-text-light transition-colors dark:text-text-dark" />

                  <input
                    id="password"
                    value={formik.values.password}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full rounded-xl h-12 pl-12 pr-4 border border-gray-200 text-gray-600 focus:border-text-light focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white dark:bg-bg-primary-dark dark:text-gray-50 dark:border-gray-700 dark:hover:border-text-light dark:focus:border-primary dark:focus:ring-blue-900"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-text-light transition-colors dark:text-text-dark"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              {formik.errors.password && formik.touched.password && (
                <p className="mb-3 text-xs text-red-500">
                  {formik.errors.password}
                </p>
              )}
              {/* Confirm Password */}
              <div className="space-y-2">
                <label
                  htmlFor="rePassword"
                  className="block text-sm font-bold text-[#0F172A] ml-1 dark:text-white/95"
                >
                  Confirm Password
                </label>

                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-text-light transition-colors dark:text-text-dark" />

                  <input
                    value={formik.values.rePassword}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    name="rePassword"
                    id="rePassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full rounded-xl h-12 pl-12 pr-4 border border-gray-200 text-gray-600 focus:border-text-light focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white dark:bg-bg-primary-dark dark:text-gray-50 dark:border-gray-700 dark:hover:border-text-light dark:focus:border-primary dark:focus:ring-blue-900"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-text-light transition-colors dark:text-text-dark"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              {formik.errors.rePassword && formik.touched.rePassword && (
                <p className="mb-3 text-xs text-red-500">
                  {formik.errors.rePassword}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-primary text-white font-bold text-lg shadow-lg hover:-translate-y-1 transition-all flex items-center justify-center"
              >
                {loading ? (
                  <LoaderPinwheel className="animate-spin" />
                ) : (
                  <>
                    <UserPlus size={18} className="mr-2" />
                    Register
                  </>
                )}
              </button>

              {/* Or Continue */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100"></div>
                </div>
                <span className="relative flex justify-center text-xs uppercase px-2 bg-white text-gray-400 dark:bg-bg-secondary-dark">
                  Or continue with
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

            <div className="text-center mt-6 text-sm text-gray-500 dark:text-white/95">
              Already have an account?
              <Link
                to="/login"
                className="font-bold text-text-light ml-1 hover:underline hover:text-primary dark:text-text-dark dark:hover:text-text-light"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
