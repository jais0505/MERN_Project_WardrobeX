import { FaEye, FaEyeSlash } from 'react-icons/fa'
import styles from './UserRegistration.module.css'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import axios from 'axios';

const UserRegistration = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [confrimPassword, setConfirmPassword] = useState("");
  const [userLocation, setUserLocation] = useState("");

  const navigate = useNavigate();

  const handleRegistration = async (e) => {
    e.preventDefault();
    if (!userName || !userEmail || !userPassword || !confrimPassword || !userLocation) {
      alert("Please fill all fields");
      return;
    } else if (userPassword !== confrimPassword) {
      alert("Password mismatch");
      return;
    }
    try {
      const res = await axios.post("http://localhost:5000/User", {
        userName: userName,
        userEmail: userEmail,
        userPassword: userPassword,
        userLocation: userLocation
      });
      console.log();
      alert(res.data.message);
      setUserName("");
      setUserEmail("");
      setUserPassword("");
      setConfirmPassword("");
      setUserLocation("");
      navigate('/login');
    } catch (err) {
      console.error(err)
    }
  }
  return (
    <div className={styles.container}>
      <div className={styles.regform}>
        <h1>Create Your Account</h1>
        <span className={styles.subheading}>It only takes a minute to get started.</span>
        <form action="" className={styles.form} onSubmit={handleRegistration}>
          <span className={styles.inptitle}>Name</span>
          <div className={styles.inputGroup}>
            <input type="text" placeholder='Enter full name' className={styles.input} value={userName} onChange={(e) => setUserName(e.target.value)} />
          </div>

          <span className={styles.inptitle}>Email</span>
          <div className={styles.inputGroup}>
            <input type="email" placeholder='Enter email id' className={styles.input} value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
          </div>

          <span className={styles.inptitle}>Password</span>
          <div className={styles.inputGroup}>
            <input type={showPassword ? "text" : "password"} placeholder='Enter password' className={styles.input} value={userPassword} onChange={(e) => setUserPassword(e.target.value)} />
            <span
              className={styles.eyeIcon}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <span className={styles.inptitle}>Confirm Password</span>
          <div className={styles.inputGroup}>
            <input type={showRePassword ? "text" : "password"} placeholder='Confirm password' className={styles.input} value={confrimPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <span
              className={styles.eyeIcon}
              onClick={() => setShowRePassword(!showRePassword)}
            >
              {showRePassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <span className={styles.inptitle}>Location</span>
          <div className={styles.inputGroup}>
            <input type="text" placeholder='Enter the location of user' className={styles.input} value={userLocation} onChange={(e) => setUserLocation(e.target.value)} />
          </div>

          <button type="submit" className={styles.registerbtn}>
            Create Account
          </button>
          <div className={styles.qndiv}>
            <p className={styles.logintext}>
              Already have an account?{' '}
              <Link to="/login">
                <span className={styles.loginlink}>
                  Login
                </span>
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserRegistration