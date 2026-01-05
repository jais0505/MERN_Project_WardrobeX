import { useNavigate, useLocation } from "react-router";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "./ResetPassword.module.css";

export default function ResetPassword() {
  const location = useLocation();
const userId = location.state?.userId;
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:5000/reset-password/`,{
          userId,
          newPassword: password
        }
        
      );

      toast.success(res.data.message || "Password updated successfully!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.logincard}>
        <div className={styles.formcard}>
          <div className={styles.brandName}>WARDROBE</div>
          <h1 className={styles.title}>New Password</h1>
          <p className={styles.subtitle}>
            Please enter and confirm your new password below.
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* New Password */}
            <div className={styles.inputGroup}>
              <input
                type={showPass ? "text" : "password"}
                placeholder="New Password"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className={styles.eyeIcon}
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Confirm Password */}
            <div className={styles.inputGroup}>
              <input
                type={showConfirmPass ? "text" : "password"}
                placeholder="Confirm Password"
                className={styles.input}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span
                className={styles.eyeIcon}
                onClick={() => setShowConfirmPass(!showConfirmPass)}
              >
                {showConfirmPass ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button
              type="submit"
              className={styles.loginButton}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>

        {/* Brand Image consistent with Login/Forgot password */}
        <div className={styles.imagecard}></div>
      </div>
    </div>
  );
}
