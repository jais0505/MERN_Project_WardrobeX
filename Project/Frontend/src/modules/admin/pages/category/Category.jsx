import { IoIosAdd } from 'react-icons/io';
import styles from './Category.module.css';
import { useEffect, useState } from 'react';
import { MdCancel } from 'react-icons/md';
import axios from 'axios';

const Category = () => {
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState(null);

  const [categoryRows, setCategoryRows] = useState([]);

  const [editId, setEditId] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/Category");
      if (res.data.category) {
        setCategoryRows(res.data.category);
      }
    } catch (err) {
      console.log("Error fetching categories", err);
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const res = await axios.delete(`http://localhost:5000/Category/${id}`);
        alert(res.data.message);
        fetchCategories();
      } catch (err) {
        console.log(err);
        alert("Delete failed");
      }
    }
  };

  const handleEdit = async (id, name) => {
    setCategory(name);
    setEditId(id);
    setShowForm(true);
  }



  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("category entered:", category);
    try {
      if (editId) {
        const res = await axios.put(`http://localhost:5000/Category/${editId}`, {
          categoryName: category
        });
        alert(res.data.message);
      } else {
        const res = await axios.post("http://localhost:5000/Category", {
          categoryName: category
        });
        alert(res.data.message);
      }
      setShowForm(false);
      setCategory("");
      fetchCategories();
      setEditId(null);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);
  return (
    <div className={styles.category_container}>

      <div className={styles.header}>
        <span className={styles.headtext}>Category</span>
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
          <h3>Add New Category</h3>
          <input type="text" placeholder='Enter category name' className={styles.input} value={category} onChange={(e) => setCategory(e.target.value)} />
          <div className={styles.btnGroup}>
            <button className={styles.saveBtn} onClick={handleSubmit}>
              {editId ? "Upadate" : "Save"}
            </button>
          </div>
        </div>
      )}



      <div className={styles.category_table}>
        <div className={styles.table_wrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>SlNo</th>
                <th>Category</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {categoryRows.length > 0 ? (
                categoryRows.map((cat, index) => (
                  <tr key={cat._id}>
                    <td>{index + 1}</td>
                    <td>{cat.categoryName}</td>
                    <td>
                      <button className={styles.delete} onClick={() => handleDelete(cat._id)}>Delete</button>
                      <button className={styles.edit} onClick={() => handleEdit(cat._id, cat.categoryName)}>Edit</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center" }}>No categories found</td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>
      
    </div>
  );
};

export default Category;
