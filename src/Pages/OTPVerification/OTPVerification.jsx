/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import OtpInput from "react-otp-input";
import { Mail, LoaderPinwheel, ArrowLeft } from "lucide-react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Helmet from "react-helmet";
import AuthBG from "../../assets/images/AuthBG.avif";
import LogoBlack from "../../assets/images/DevHubLogoWhite.png";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import toast, { Toaster } from "react-hot-toast";

export default function OTPVerification() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const email = location.state?.email || localStorage.getItem("userEmail");
  const [timer, setTimer] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const { userData } = useContext(UserContext);

  useEffect(() => {
    let interval;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    if (timer === 0 && isTimerActive) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  const handleResend = async () => {
    if (!isTimerActive) {
      try {
        await axios.post(
          `http://devhub.eu-north-1.elasticbeanstalk.com/api/v1/email/send-otp`,
          { email: email },
        );

        setOtp("");
        setTimer(60);
        setIsTimerActive(true);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to resend OTP code. Please try again.",
        );
      }
    }
  };

  const handleVerify = async () => {
    if (otp.length === 6) {
      try {
        setLoading(true);
        const isForgot = location.state?.type === "forgot";

        const url = isForgot
          ? `http://devhub.eu-north-1.elasticbeanstalk.com/api/v1/password/verify-otp` // After forgot password, we verify the OTP with a different endpoint to allow password reset
          : `http://devhub.eu-north-1.elasticbeanstalk.com/api/v1/email/verify-otp`; // Regular OTP verification for email confirmation during registration

        const { data } = await axios.post(url, { email, otp });

        if (data.status === 200 || data.success || data.message?.includes("verified")) {
          if (isForgot) {
            navigate("/reset-password", { state: { email, otp } });
          } else {
            navigate("/interests");
          }
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to verify OTP code. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>DevHub | OTP Verification</title>
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
              Verify your <br />
              <span className="text-blue-700 italic">Identity.</span>
            </h2>
            <p className="text-slate-300 text-lg max-w-sm mb-10">
              We've sent a unique 6-digit code to your inbox. This step ensures
              that your DevHub account remains secure and only accessible by
              you.
            </p>
          </div>

          {/* Right Side */}
          <div className="bg-white/95 dark:bg-[#111827]/98 p-8 md:p-16 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Mail className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                Check Mail
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-10 font-medium">
                We sent a code to{" "}
                <span className="text-slate-900 dark:text-white font-bold">
                  {email || "your email"}
                </span>
              </p>

              <div className="flex justify-center mb-10">
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  renderInput={(props) => (
                    <input
                      {...props}
                      className="w-12! h-16 md:w-14! md:h-18 mx-1 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 focus:border-primary dark:focus:border-primary/50 rounded-2xl text-2xl font-black outline-none transition-all dark:text-white shadow-sm"
                    />
                  )}
                />
              </div>

              <button
                onClick={handleVerify}
                disabled={otp.length !== 6 || loading}
                className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black text-lg rounded-2xl shadow-xl shadow-primary/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                {loading ? (
                  <LoaderPinwheel className="animate-spin w-6 h-6" />
                ) : (
                  "VERIFY CODE"
                )}
              </button>

              <div className="mt-8">
                {isTimerActive ? (
                  <p className="text-sm font-bold text-slate-400">
                    Resend available in{" "}
                    <span className="text-primary">{timer}s</span>
                  </p>
                ) : (
                  <button
                    onClick={handleResend}
                    className="font-bold text-text-light ml-1 hover:text-primary hover:underline dark:text-text-dark dark:hover:text-text-light"
                  >
                    Resend New Code
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
