import React, { useState } from 'react'
import styles from './Login.module.css'
import { Link, useNavigate } from 'react-router'
import Image from '../../../../assets/images/FashionModel.jpg'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      return alert("Please enter email and password");
    }
    try {
      setLoading(true);

      const res = await axios.post("http://localhost:5000/Login", { email, password });
      const { role, id, name, message } = res.data;

      if (role === 'user') {
        sessionStorage.setItem('uid', id);
        sessionStorage.setItem('userName', name);
        navigate('/user/home');
        toast.success(message);
      } else if (role === 'admin') {
        sessionStorage.setItem('aid', id);
        sessionStorage.setItem('adminName', name);
        toast.success(message);
        navigate('/admin');
      } else if (role === 'shop') {
        sessionStorage.setItem('sid', id);
        sessionStorage.setItem('shopName', name);
        toast.success(message);
        navigate('/shop/home');
      } else {
        toast.error(message);
      }

    } catch (err) {
      console.error("Login Error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        alert("Server error. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.logincard}>
        <div className={styles.formcard}>
          <div className={styles.brandName}>WARDROBE</div>
          <h1>Welcome Back!</h1>
          <div className={styles.inputGroup}>
            <input type="email" placeholder='Enter email' className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className={styles.inputGroup}>
            <input type={showPass ? "text" : "password"} placeholder='Enter password' className={styles.input} value={password} onChange={(e) => setPassword(e.target.value)} />
            <span
              className={styles.eyeIcon}
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button type="submit" className={styles.loginButton} onClick={handleLogin} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          <div>
            <p className={styles.registerText}>
              Don't have an account?{' '}
              <Link to="/userreg">
                <span className={styles.registerLink}>
                  Register
                </span>
              </Link>

            </p>
          </div>
        </div>

        <div className={styles.imagecard}>

        </div>

      </div>
    </div>
  )
}

export default Login