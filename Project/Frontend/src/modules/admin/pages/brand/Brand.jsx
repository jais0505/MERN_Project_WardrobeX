import { IoIosAdd } from 'react-icons/io';
import styles from './Brand.module.css';
import { useEffect, useState } from 'react';
import { MdCancel } from 'react-icons/md';
import axios from 'axios';

const Brand = () => {
  const [showForm, setShowForm] = useState(false);
  const [brand, setBrand] = useState("");

  const [brandRows, setBrandRows] = useState([]);

  const [editId, setEditId] = useState(null);

  const fetchBrands = async () => {
    try {
      const res = await axios.get("http://localhost:5000/Brand");
      if (res.data.brand) {
        setBrandRows(res.data.brand);
      }
    } catch (err) {
      console.log("Error fetching brands", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this brand?")) {
      try {
        const res = await axios.delete(`http://localhost:5000/Brand/${id}`);
        alert(res.data.message);
        fetchBrands();
      } catch (err) {
        console.log(err);
        alert("Delete failed");
      }
    }
  };

  const handleEdit = (id, name) => {
    setBrand(name);
    setEditId(id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("brand entered:", brand);
    try {
      if (editId) {
        const res = await axios.put(`http://localhost:5000/Brand/${editId}`, {
          brandName: brand
        });
        alert(res.data.message);
      } else {
        const res = await axios.post("http://localhost:5000/Brand", {
          brandName: brand
        });
        alert(res.data.message);
      }
      setShowForm(false);
      setBrand("");
      fetchBrands();
      setEditId(null);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <div className={styles.main_container}>

      <div className={styles.header}>
        <span className={styles.headtext}>Brand</span>
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
          <h3>Add New Brand</h3>
          <input
            type="text"
            placeholder='Enter brand name'
            className={styles.input}
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
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
                <th>Brand</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {brandRows.length > 0 ? (
                brandRows.map((br, index) => (
                  <tr key={br._id}>
                    <td>{index + 1}</td>
                    <td>{br.brandName}</td>
                    <td>
                      <button className={styles.delete} onClick={() => handleDelete(br._id)}>Delete</button>
                      <button className={styles.edit} onClick={() => handleEdit(br._id, br.brandName)}>Edit</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center" }}>No brands found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Brand;
