/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";
import OtpInput from "react-otp-input";
import { Mail, LoaderPinwheel, ArrowLeft } from "lucide-react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Helmet from "react-helmet";
import AuthBG from "../../assets/images/AuthBG.avif";
import LogoBlack from "../../assets/images/DevHubLogoWhite.png";

export default function OTPVerification() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const email = location.state?.email;
  const [timer, setTimer] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(true);

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

  const handleResend = () => {
    if (!isTimerActive) {
      setOtp("");
      setTimer(60);
      setIsTimerActive(true);
    }
  };

  const handleVerify = () => {
    if (otp.length === 6) {
      setLoading(true);
      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <>
      <Helmet>
        <title>DevHub | OTP Verification</title>
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
              Verify your <br />
              <span className="text-primary italic">Identity.</span>
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
                className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black text-lg rounded-2xl shadow-xl shadow-primary/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
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
