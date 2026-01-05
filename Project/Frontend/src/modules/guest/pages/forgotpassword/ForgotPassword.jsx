import React, { useState } from 'react';
import styles from './ForgotPassword.module.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router'; // Added for back navigation

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
  if (!email) return toast.warning("Please enter your email");

  try {
    setLoading(true);
    const res = await axios.post(
      "http://localhost:5000/forgot-password",
      { email }
    );

    toast.success(res.data.message);

    navigate("/verify-reset-otp", {
      state: { userId: res.data.userId },
    });

  } catch (err) {
    toast.error(err.response?.data?.message || "Error");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className={styles.container}>
      <div className={styles.logincard}>
        <div className={styles.formcard}>
          <div className={styles.brandName}>WARDROBE</div>
          <h1 className={styles.title}>Reset Password</h1>
          <p className={styles.subtitle}>
            Enter your email and we'll send you a email OTP to reset your password.
          </p>
          
          <div className={styles.inputGroup}>
            <input 
              type="email" 
              placeholder='Enter your email' 
              className={styles.input} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button 
            className={styles.loginButton} 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send email OTP"}
          </button>

          <Link to="/login" className={styles.backLink}>
            Back to Login
          </Link>
        </div>

        {/* Keeping the fashion model image for brand consistency */}
        <div className={styles.imagecard}></div>
      </div>
    </div>
  );
};

export default ForgotPassword;