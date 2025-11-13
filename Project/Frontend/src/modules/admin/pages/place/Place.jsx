import { useEffect, useState } from 'react';
import styles from './Place.module.css';
import { MdCancel } from 'react-icons/md';
import { IoIosAdd } from 'react-icons/io';
import axios from 'axios';

const Place = () => {
  const [showForm, setShowForm] = useState(false);
  const [place, setPlace] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [districtRows, setDistrictRows] = useState([]);
  const [placeRows, setPlaceRows] = useState([]);
  const [editId, setEditId] = useState(null);

  const fetchDistricts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/District");
      if (res.data.district) {
        setDistrictRows(res.data.district);
        console.log(districtRows);
      }
    } catch (err) {
      console.error("Error fetching districts", err);
    }
  }

  const fecthPlaces = async () => {
    try {
      const res = await axios.get("http://localhost:5000/PlacePopulate");
      if (res.data.place) {
        setPlaceRows(res.data.place);
      }
    } catch (err) {
      console.error("Error fetching places", err);
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this place?")) {
      try {
        const res = await axios.delete(`http://localhost:5000/Place/${id}`);
        alert(res.data.message);
        fecthPlaces();
      } catch (err) {
        console.err(err);
        alert("Place deletion failed");
      }
    }

  }

  const handleEdit = async (data) => {
    setEditId(data._id)
    setPlace(data.placeName);
    setSelectedDistrict(data.districtId?._id);
    setShowForm(true);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        const res = await axios.put(`http://localhost:5000/Place/${editId}`, {
          placeName: place,
          districtId: selectedDistrict
        });
        alert(res.data.message);
      } else {
        const res = await axios.post(`http://localhost:5000/Place`, {
          placeName: place,
          districtId: selectedDistrict
        });
        alert(res.data.message);
      }
      setShowForm(false);
      setPlace("");
      setSelectedDistrict("");
      setEditId(null);
      fecthPlaces();
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchDistricts();
    fecthPlaces();
  }, []);
  return (
    <div className={styles.main_container}>

      <div className={styles.header}>
        <span className={styles.headtext}>Place</span>
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
          <h3>Add New place</h3>
          <select className={styles.dropdown} value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)}>
            <option value="" disabled>---Select District---</option>
            {districtRows.map((dist) => (
              <option key={dist._id} value={dist._id}>
                {dist.districtName}
              </option>
            ))}
          </select>
          <input type="text" placeholder='Enter place name' className={styles.input} value={place} onChange={(e) => setPlace(e.target.value)} />
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
                <th>Place</th>
                <th>District</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {placeRows.length > 0 ? (
                placeRows.map((data, index) => (
                  <tr key={data._id}>
                    <td>{index + 1}</td>
                    <td>{data.placeName}</td>
                    <td>{data.districtId?.districtName}</td>
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

export default Place