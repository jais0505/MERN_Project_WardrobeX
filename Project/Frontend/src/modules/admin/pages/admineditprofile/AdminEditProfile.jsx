import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./AdminEditProfile.module.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const AdminEditProfile = () => {
  const adminId = sessionStorage.getItem("aid");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    adminName: "",
    adminContact: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/AdminById/${adminId}`);
        setForm({
          adminName: res.data.admin.adminName,
          adminContact: res.data.admin.adminContact,
        });
      } catch (err) {
        console.log("Fetch Admin Failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [adminId]);

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:5000/AdminUpdate/${adminId}`,
        form
      );
      if(res){
         toast.success("Profile Updated Successfully");
         navigate("/admin/profile");
      }
    } catch (err) {
      console.log("Update failed", err);
      toast.error("Update Failed");
    }
  };

  if (loading) return <h2 style={{textAlign:"center"}}>Loading...</h2>;

  return (
    <div className={styles.container}>
      <h1>Edit Admin Profile</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        
        <label>Full Name</label>
        <input
          type="text"
          name="adminName"
          value={form.adminName}
          onChange={handleChange}
          required
        />

        <label>Contact Number</label>
        <input
          type="text"
          name="adminContact"
          value={form.adminContact}
          onChange={handleChange}
          required
        />

        <button type="submit" className={styles.saveBtn}>
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default AdminEditProfile;
