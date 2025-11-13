import { IoIosAdd } from 'react-icons/io';
import styles from './Color.module.css';
import { useEffect, useState } from 'react';
import { MdCancel } from 'react-icons/md';
import axios from 'axios';

const Color = () => {
  const [showForm, setShowForm] = useState(false);
  const [color, setColor] = useState("");
  const [colorRows, setColorRows] = useState([]);
  const [editId, setEditId] = useState(null);

  const fetchColors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/Color");
      if (res.data.color) {
        setColorRows(res.data.color);
      }
    } catch (err) {
      console.log("Error fetching colors", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this color?")) {
      try {
        const res = await axios.delete(`http://localhost:5000/Color/${id}`);
        alert(res.data.message);
        fetchColors();
      } catch (err) {
        console.log(err);
        alert("Delete failed");
      }
    }
  };

  const handleEdit = (id, name) => {
    setColor(name);
    setEditId(id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        const res = await axios.put(`http://localhost:5000/Color/${editId}`, {
          colorName: color
        });
        alert(res.data.message);
      } else {
        const res = await axios.post("http://localhost:5000/Color", {
          colorName: color
        });
        alert(res.data.message);
      }
      setShowForm(false);
      setColor("");
      fetchColors();
      setEditId(null);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchColors();
  }, []);

  return (
    <div className={styles.main_container}>

      <div className={styles.header}>
        <span className={styles.headtext}>Color</span>
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
          <h3>Add New Color</h3>
          <input
            type="text"
            placeholder='Enter color name'
            className={styles.input}
            value={color}
            onChange={(e) => setColor(e.target.value)}
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
                <th>Color</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {colorRows.length > 0 ? (
                colorRows.map((clr, index) => (
                  <tr key={clr._id}>
                    <td>{index + 1}</td>
                    <td>{clr.colorName}</td>
                    <td>
                      <button className={styles.delete} onClick={() => handleDelete(clr._id)}>Delete</button>
                      <button className={styles.edit} onClick={() => handleEdit(clr._id, clr.colorName)}>Edit</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center" }}>No colors found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Color;
