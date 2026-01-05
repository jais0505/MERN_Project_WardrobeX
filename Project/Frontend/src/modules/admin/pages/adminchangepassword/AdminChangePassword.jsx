import { useState } from "react";
import axios from "axios";
import styles from "./AdminChangePassword.module.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { FiEye, FiEyeOff, FiLock } from "react-icons/fi"; // Added Icons

const AdminChangePassword = () => {
  const adminId = sessionStorage.getItem("aid");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // State for toggling visibility for each field
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      await axios.put(`http://localhost:5000/AdminChangePassword/${adminId}`, {
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      });
      toast.success("Password updated successfully");
      navigate("/admin/profile");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconHeader}>
          <FiLock size={40} />
        </div>
        <h1 className={styles.title}>Update Password</h1>
        <p className={styles.subtitle}>Ensure your account stays secure by using a strong password.</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Old Password */}
          <div className={styles.inputGroup}>
            <label>Current Password</label>
            <div className={styles.inputWrapper}>
              <input
                type={showOld ? "text" : "password"}
                name="oldPassword"
                value={form.oldPassword}
                onChange={handleChange}
                required
              />
              <button type="button" className={styles.eyeBtn} onClick={() => setShowOld(!showOld)}>
                {showOld ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className={styles.inputGroup}>
            <label>New Password</label>
            <div className={styles.inputWrapper}>
              <input
                type={showNew ? "text" : "password"}
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                required
              />
              <button type="button" className={styles.eyeBtn} onClick={() => setShowNew(!showNew)}>
                {showNew ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className={styles.inputGroup}>
            <label>Confirm New Password</label>
            <div className={styles.inputWrapper}>
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
              <button type="button" className={styles.eyeBtn} onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button type="submit" className={styles.btn}>
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminChangePassword;