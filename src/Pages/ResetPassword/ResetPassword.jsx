/* eslint-disable no-unused-vars */
import { Lock, Eye, EyeOff, LoaderPinwheel } from "lucide-react";
import { useState } from "react";
import Helmet from "react-helmet";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";

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

      console.log("Resetting password for:", email);
      console.log("New Password:", values.password);

      navigate("/login");
    } catch (error) {
      setApiError("Something went wrong.");
    } finally {
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
    initialValues: {
      password: "",
      rePassword: "",
    },
    validationSchema,
    onSubmit: handleReset,
  });

  return (
    <>
      <Helmet>
        <title>DevHub | Reset Password</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 dark:bg-bg-primary-dark">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl dark:bg-gray-900">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-serif font-bold text-[#1e293b] dark:text-white">
                Reset Password
              </h1>
              <p className="text-gray-400 text-sm font-medium">
                Create a new password for <br />
                <span className="font-semibold text-gray-700 dark:text-gray-200">
                  {email}
                </span>
              </p>
            </div>

            {apiError && (
              <div className="px-4 py-2 mb-4 text-sm text-red-700 rounded-lg bg-red-100">
                {apiError}
              </div>
            )}

            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* New Password */}
              <div className="space-y-2">
                <label className="block text-sm font-bold ml-1 dark:text-white">
                  New Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                  <input
                    id="password"
                    value={formik.values.password}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full rounded-xl h-12 pl-12 pr-4 border border-gray-200 focus:ring-2 dark:bg-bg-primary-dark dark:text-white dark:border-gray-700"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              {formik.errors.password && formik.touched.password && (
                <p className="text-xs text-red-500">{formik.errors.password}</p>
              )}

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="block text-sm font-bold ml-1 dark:text-white">
                  Confirm Password
                </label>

                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="rePassword"
                    value={formik.values.rePassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full rounded-xl h-12 pl-12 pr-4 border border-gray-200 focus:ring-2 dark:bg-bg-primary-dark dark:text-white dark:border-gray-700"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              {formik.errors.rePassword && formik.touched.rePassword && (
                <p className="text-xs text-red-500">
                  {formik.errors.rePassword}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-primary text-white font-bold text-lg shadow-md hover:-translate-y-1 transition-all flex justify-center items-center"
              >
                {loading ? (
                  <LoaderPinwheel className="animate-spin" />
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
