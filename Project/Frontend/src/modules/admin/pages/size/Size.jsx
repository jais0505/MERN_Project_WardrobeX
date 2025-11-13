import { IoIosAdd } from 'react-icons/io';
import styles from './Size.module.css';
import { useEffect, useState } from 'react';
import { MdCancel } from 'react-icons/md';
import axios from 'axios';

const Size = () => {
  const [showForm, setShowForm] = useState(false);
  const [size, setSize] = useState("");
  const [sizeRows, setSizeRows] = useState([]);
  const [editId, setEditId] = useState(null);

  const fetchSizes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/Size");
      if (res.data.size) {
        setSizeRows(res.data.size);
      }
    } catch (err) {
      console.log("Error fetching sizes", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this size?")) {
      try {
        const res = await axios.delete(`http://localhost:5000/Size/${id}`);
        alert(res.data.message);
        fetchSizes();
      } catch (err) {
        console.log(err);
        alert("Delete failed");
      }
    }
  };

  const handleEdit = (id, name) => {
    setSize(name);
    setEditId(id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("size entered:", size);
    try {
      if (editId) {
        const res = await axios.put(`http://localhost:5000/Size/${editId}`, {
          sizeName: size
        });
        alert(res.data.message);
      } else {
        const res = await axios.post("http://localhost:5000/Size", {
          sizeName: size
        });
        alert(res.data.message);
      }
      setShowForm(false);
      setSize("");
      fetchSizes();
      setEditId(null);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSizes();
  }, []);

  return (
    <div className={styles.main_container}>

      <div className={styles.header}>
        <span className={styles.headtext}>Size</span>
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
          <h3>Add New Size</h3>
          <input
            type="text"
            placeholder='Enter size name'
            className={styles.input}
            value={size}
            onChange={(e) => setSize(e.target.value)}
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
                <th>Size</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sizeRows.length > 0 ? (
                sizeRows.map((sz, index) => (
                  <tr key={sz._id}>
                    <td>{index + 1}</td>
                    <td>{sz.sizeName}</td>
                    <td>
                      <button className={styles.delete} onClick={() => handleDelete(sz._id)}>Delete</button>
                      <button className={styles.edit} onClick={() => handleEdit(sz._id, sz.sizeName)}>Edit</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center" }}>No sizes found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Size;
