import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import { FiShield } from "react-icons/fi"; // Secure icon
import styles from "./VerifyResetOtp.module.css";

const VerifyResetOtp = () => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const location = useLocation();
  const navigate = useNavigate();

  const userId = location.state?.userId;

  // Simple countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault(); // Prevents page reload
    try {
      await axios.post("http://localhost:5000/verify-reset-otp", {
        userId,
        otp,
      });

      toast.success("Identity Verified");
      navigate("/reset-password", { state: { userId } });
    } catch (err) {
      toast.error("Invalid or Expired OTP");
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.otpCard}>
        <div className={styles.iconCircle}>
          <FiShield size={30} />
        </div>
        
        <h1 className={styles.title}>Verify OTP</h1>
        <p className={styles.subtitle}>
          We've sent a 6-digit verification code to your email. 
          Please enter it below to reset your password.
        </p>

        <form onSubmit={handleVerify} className={styles.form}>
          <input
            type="text"
            maxLength="6"
            placeholder="000000"
            className={styles.otpInput}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            required
          />

          <button type="submit" className={styles.verifyBtn}>
            Verify Code
          </button>
        </form>

        <div className={styles.footer}>
          {timer > 0 ? (
            <p className={styles.timerText}>
              Resend code in <span>{timer}s</span>
            </p>
          ) : (
            <button className={styles.resendBtn} onClick={() => window.location.reload()}>
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyResetOtp;