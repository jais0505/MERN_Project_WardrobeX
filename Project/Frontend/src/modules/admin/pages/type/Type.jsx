import { IoIosAdd } from 'react-icons/io';
import styles from './Type.module.css';
import { useEffect, useState } from 'react';
import { MdCancel } from 'react-icons/md';
import axios from 'axios';

const Type = () => {
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState("");

  const [typeRows, setTypeRows] = useState([]);

  const [editId, setEditId] = useState(null);

  const fetchTypes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/Type");
      if (res.data.type) {
        setTypeRows(res.data.type);
      }
    } catch (err) {
      console.log("Error fetching types", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this type?")) {
      try {
        const res = await axios.delete(`http://localhost:5000/Type/${id}`);
        alert(res.data.message);
        fetchTypes();
      } catch (err) {
        console.log(err);
        alert("Delete failed");
      }
    }
  };

  const handleEdit = (id, name) => {
    setType(name);
    setEditId(id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("type entered:", type);
    try {
      if (editId) {
        const res = await axios.put(`http://localhost:5000/Type/${editId}`, {
          typeName: type
        });
        alert(res.data.message);
      } else {
        const res = await axios.post("http://localhost:5000/Type", {
          typeName: type
        });
        alert(res.data.message);
      }
      setShowForm(false);
      setType("");
      fetchTypes();
      setEditId(null);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  return (
    <div className={styles.main_container}>

      <div className={styles.header}>
        <span className={styles.headtext}>Type</span>
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
          <h3>Add New Type</h3>
          <input
            type="text"
            placeholder='Enter type name'
            className={styles.input}
            value={type}
            onChange={(e) => setType(e.target.value)}
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
                <th>Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {typeRows.length > 0 ? (
                typeRows.map((tp, index) => (
                  <tr key={tp._id}>
                    <td>{index + 1}</td>
                    <td>{tp.typeName}</td>
                    <td>
                      <button className={styles.delete} onClick={() => handleDelete(tp._id)}>Delete</button>
                      <button className={styles.edit} onClick={() => handleEdit(tp._id, tp.typeName)}>Edit</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center" }}>No types found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Type;
