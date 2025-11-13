import { useEffect, useState } from 'react';
import styles from './District.module.css'
import { MdCancel } from 'react-icons/md';
import { IoIosAdd } from 'react-icons/io';
import axios from 'axios';

const District = () => {
  const [showForm, setShowForm] = useState(false);
  const [district, setDistrict] = useState("");
  const [districtRows, setDistrictRows] = useState([]);

  const [editId, setEditId] = useState(null);

  const fetchDistricts = async () => {
    try{
      const res = await axios.get("http://localhost:5000/District");
      if(res.data.district){
        setDistrictRows(res.data.district);
      }
    } catch (err) {
      console.error("Error fetching districts", err);
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this district?")) {
      try{
      const res = await axios.delete(`http://localhost:5000/District/${id}`);
      alert(res.data.message);
      fetchDistricts();
    } catch (err){
      console.err(err);
      alert("District deletion failed");
    }
    }
  }

  const handleEdit = async (id, name) => {
    setDistrict(name);
    setEditId(id);
    setShowForm(true);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("District enterd:", district);
    try{
      if(editId) {
        const res = await axios.put(`http://localhost:5000/District/${editId}`,{
          districtName: district
        });
        alert(res.data.message);
      } else {
        const res = await axios.post("http://localhost:5000/District",{
        districtName: district
      });
      alert(res.data.message);
      }
      setShowForm(false);
      setDistrict("");
      fetchDistricts();
      setEditId(null);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchDistricts();
  }, []);
  
  return (
    <div className={styles.main_container}>
    
          <div className={styles.header}>
            <span className={styles.headtext}>District</span>
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
              <h3>Add New Distrcit</h3>
              <input type="text" placeholder='Enter distrcit name' className={styles.input} value={district} onChange={(e) => setDistrict(e.target.value)} />
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
                    <th>District</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {districtRows.length > 0 ? (
                    districtRows.map((data, index) => (
                      <tr key={data._id}>
                        <td>{index + 1}</td>
                        <td>{data.districtName}</td>
                        <td>
                          <button className={styles.delete} onClick={() => handleDelete(data._id)}>Delete</button>
                          <button className={styles.edit} onClick={() => handleEdit(data._id, data.districtName)}>Edit</button>
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
  )
}

export default District