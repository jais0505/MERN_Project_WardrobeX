import styles from './User.module.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Users = () => {
  const [userRows, setUserRows] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/User");
      if (res.data.user) {
        setUserRows(res.data.user);
      }
    } catch (err) {
      console.log("Error fetching users", err);
    }
  };


  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className={styles.main_container}>
      <div className={styles.header}>
        <span className={styles.headtext}>Users</span>
      </div>

      <div className={styles.data_table}>
        <div className={styles.table_wrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>SlNo</th>
                <th>Name</th>
                <th>Email</th>
                <th>Location</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {userRows.length > 0 ? (
                userRows.map((usr, index) => (
                  <tr key={usr._id}>
                    <td>{index + 1}</td>
                    <td>{usr.userName}</td>
                    <td>{usr.email}</td>
                    <td>{usr.location}</td>
                    <td>
                      <button className={styles.delete}>
                        More...
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
