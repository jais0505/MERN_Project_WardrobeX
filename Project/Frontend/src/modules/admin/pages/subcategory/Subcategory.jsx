import { MdCancel } from 'react-icons/md'
import styles from './Subcategory.module.css'
import { IoIosAdd } from 'react-icons/io'
import { useEffect, useState } from 'react';
import axios from 'axios';

const Subcategory = () => {
  const [showForm, setShowForm] = useState(false);
  const [subcategory, setSubcategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryRows, setCategoryRows] = useState([]);
  const [subcategoryRows, setSubcategoryRows] = useState([]);
  const [editId, setEditId] = useState(null);

  const fetchCategory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/Category");
      if (res.data.category) {
        setCategoryRows(res.data.category);
      }
    } catch (err) {
      console.error("Error fetching districts", err);
    }
  }

  const fetchSubcategory = async () => {
    try{
      const res = await axios.get("http://localhost:5000/SubcategoryPopulate");
      if(res.data.subcategory){
        setSubcategoryRows(res.data.subcategory);
        console.log(subcategoryRows);
      }
    } catch (err) {
      console.error("Error fetching places", err);
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this place?")) {
      try{
      const res = await axios.delete(`http://localhost:5000/Subcategory/${id}`);
      alert(res.data.message);
      fetchSubcategory();
    } catch (err){
      console.err(err);
      alert("Place deletion failed");
    }
    }
  }

  const handleEdit = async (data) => {
    setEditId(data._id)
    setSubcategory(data.subcategoryName);
    setSelectedCategory(data.categoryId?._id);
    setShowForm(true);
  }

  const handleSubmit = async (e) =>{
    e.preventDefault();
    try{
      if(editId) {
        const res = await axios.put(`http://localhost:5000/Subcategory/${editId}`, {
          subcategoryName: subcategory,
          categoryId: selectedCategory
        });
        alert(res.data.message);
      } else{
        const res = await axios.post("http://localhost:5000/Subcategory", {
        subcategoryName: subcategory,
        categoryId: selectedCategory
      });
      alert(res.data.message);
      }
      setSubcategory("");
      setSelectedCategory("")
      setShowForm(false);
      fetchSubcategory();
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchCategory();
    fetchSubcategory();
  },[]);


  return (
    <div className={styles.main_container}>
    
          <div className={styles.header}>
            <span className={styles.headtext}>Subcategory</span>
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
              <h3>Add New Subcategory</h3>
              <select className={styles.dropdown} value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="" disabled>---Select Category---</option>
                {categoryRows.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
              <input type="text" placeholder='Enter subcategory name' className={styles.input} value={subcategory} onChange={(e) => setSubcategory(e.target.value)} />
              <div className={styles.btnGroup}>
                <button className={styles.saveBtn} onClick={handleSubmit}>
                  {editId ? "Upadate" : "Save"}
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
                    <th>Subcategory</th>
                    <th>Category</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {subcategoryRows.length > 0 ? (
                    subcategoryRows.map((data, index) => (
                      <tr key={data._id}>
                        <td>{index + 1}</td>
                        <td>{data.subcategoryName}</td>
                        <td>{data.categoryId?.categoryName}</td>
                        <td>
                          <button className={styles.delete} onClick={() => handleDelete(data._id)}>Delete</button>
                          <button className={styles.edit} onClick={() => handleEdit(data)}>Edit</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" style={{ textAlign: "center" }}>No places found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
    
        </div>
  )
}

export default Subcategory