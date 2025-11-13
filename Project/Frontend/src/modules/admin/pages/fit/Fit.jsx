import { IoIosAdd } from 'react-icons/io';
import styles from './Fit.module.css';
import { useEffect, useState } from 'react';
import { MdCancel } from 'react-icons/md';
import axios from 'axios';

const Fit = () => {
  const [showForm, setShowForm] = useState(false);
  const [fit, setFit] = useState("");
  const [fitRows, setFitRows] = useState([]);
  const [editId, setEditId] = useState(null);

  const fetchFits = async () => {
    try {
      const res = await axios.get("http://localhost:5000/Fit");
      if (res.data.fit) {
        setFitRows(res.data.fit);
      }
    } catch (err) {
      console.log("Error fetching fits", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this fit?")) {
      try {
        const res = await axios.delete(`http://localhost:5000/Fit/${id}`);
        alert(res.data.message);
        fetchFits();
      } catch (err) {
        console.log(err);
        alert("Delete failed");
      }
    }
  };

  const handleEdit = (id, name) => {
    setFit(name);
    setEditId(id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        const res = await axios.put(`http://localhost:5000/Fit/${editId}`, {
          fitName: fit
        });
        alert(res.data.message);
      } else {
        const res = await axios.post("http://localhost:5000/Fit", {
          fitName: fit
        });
        alert(res.data.message);
      }
      setShowForm(false);
      setFit("");
      fetchFits();
      setEditId(null);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFits();
  }, []);

  return (
    <div className={styles.main_container}>

      <div className={styles.header}>
        <span className={styles.headtext}>Fit</span>
        <div className={styles.button}>
          <button className={styles.btn} onClick={() => setShowForm(!showForm)}>
            <span className={styles.btn_text}>
              {showForm ? "Cancel" : "Add"}
            </span>
            {showForm ? <MdCancel className={styles.btn_icon} /> : <IoIosAdd className={styles.btn_icon} />}
          </button>
        </div>
      </div>

      {showForm && (
        <div className={`${styles.form} animate__animated animate__fadeIn`}>
          <h3>Add New Fit</h3>
          <input
            type="text"
            placeholder='Enter fit name'
            className={styles.input}
            value={fit}
            onChange={(e) => setFit(e.target.value)}
          />
          <div className={styles.btnGroup}>
            <button className={styles.saveBtn} onClick={handleSubmit}>
              {editId ? "Update" : "Save"}
            </button>
          </div>
        </div>
      )}

      <div className={styles.data_table}>
        <div className={styles.table_wrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>SlNo</th>
                <th>Fit</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {fitRows.length > 0 ? (
                fitRows.map((ft, index) => (
                  <tr key={ft._id}>
                    <td>{index + 1}</td>
                    <td>{ft.fitName}</td>
                    <td>
                      <button className={styles.delete} onClick={() => handleDelete(ft._id)}>Delete</button>
                      <button className={styles.edit} onClick={() => handleEdit(ft._id, ft.fitName)}>Edit</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center" }}>No fits found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Fit;
