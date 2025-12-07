/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";
import OtpInput from "react-otp-input";
import { Mail } from "lucide-react";

export default function OTPVerification() {
  const [otp, setOtp] = useState("");

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
      console.log("Resending code...");
      setOtp("");
      setTimer(60);
      setIsTimerActive(true);
    }
  };

  const handleVerify = () => {
    if (otp.length === 6) {
      console.log("Verifying:", otp);
     
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 dark:bg-bg-primary-dark">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 dark:bg-bg-secondary-dark">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center dark:bg-blue-900/40">
            <Mail className="w-8 h-8 text-blue-600 dark:text-blue-300" />
          </div>
        </div>

        <h1 className="text-center text-3xl font-bold mb-3 dark:text-white">
          Enter Verification Code
        </h1>

        <p className="text-center text-gray-600 dark:text-gray-300 mb-8 text-sm">
          We sent a 6‑digit code to <br />
          <span className="text-gray-900 dark:text-gray-100">
            user@example.com
          </span>
        </p>

        <div className="flex justify-center mb-6">
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            inputType="tel"
            containerStyle="flex gap-3 justify-center"
            inputStyle={{
              width: "3rem",
              height: "3.5rem",
              borderRadius: "0.75rem",
              fontSize: "1.25rem",
              border: "2px solid #d1d5db",
              backgroundColor: "white",
              color: "black",
            }}
            focusStyle={{
              border: "2px solid #2563eb",
              outline: "none",
            }}
            renderInput={(props) => (
              <input
                {...props}
                className="dark:bg-bg-primary-dark dark:text-white dark:border-gray-700"
              />
            )}
          />
        </div>

        <div className="text-center mb-8">
          {isTimerActive && timer > 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Resend code in <span className="text-blue-600">{timer}s</span>
            </p>
          ) : (
            <button
              onClick={handleResend}
    
              className="text-blue-600 hover:text-blue-700 dark:text-blue-300 text-sm font-medium transition-colors"
            >
              Resend Code
            </button>
          )}
        </div>

        <button
          onClick={handleVerify}
          disabled={otp.length !== 6}
          className="w-full h-12 rounded-xl bg-blue-600 text-white font-bold text-lg shadow-lg hover:bg-blue-700 hover:-translate-y-0.5 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed dark:disabled:bg-gray-600"
        >
          Verify
        </button>

        <p className="text-center text-gray-500 dark:text-gray-400 mt-6 text-sm">
          Check your spam folder if you didn't receive the code
        </p>
      </div>
    </div>
  );
}
