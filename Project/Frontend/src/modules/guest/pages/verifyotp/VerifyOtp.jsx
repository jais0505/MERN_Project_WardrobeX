import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./VerifyOtp.module.css";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router";
import { BsFillShieldLockFill } from "react-icons/bs";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const navigate = useNavigate();

  const location = useLocation();
  const userId = location.state?.userId;

  
  // Retrieve the userId passed from the Login page
  // const userId = sessionStorage.getItem("tempUserId");

  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [userId, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/verify-otp", {
        userId,
        otp,
      });
      
      if (res.data) {
        // Store session like you did in Login
        sessionStorage.setItem("token", res.data.token);
        sessionStorage.setItem("userName", res.data.user.name);
        toast.success("Login Successfully!");
        navigate("/user/home"); 
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.otpCard}>
        <div className={styles.iconCircle}>
          <BsFillShieldLockFill size={32} />
        </div>
        <h1 className={styles.title}>Two-Step Verification</h1>
        <p className={styles.subtitle}>
          Enter the 6-digit code sent to your registered email address.
        </p>

        <form onSubmit={handleVerify}>
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
            Verify & Proceed
          </button>
        </form>

        <div className={styles.footer}>
          {timer > 0 ? (
            <p>Resend code in <span>{timer}s</span></p>
          ) : (
            <button className={styles.resendBtn}>Resend OTP</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;