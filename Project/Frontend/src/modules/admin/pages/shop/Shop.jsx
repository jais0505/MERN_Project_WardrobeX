import { useEffect, useState } from 'react';
import styles from './Shop.module.css'
import axios from 'axios';
import { useNavigate } from 'react-router';
import { MdCancel, MdCheckCircle, MdList, MdPending } from 'react-icons/md';

const Shop = () => {
  const [shops, setShops] = useState([]);

  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState('all');

  const fetchShops = async () => {
    try {
      const res = await axios.get("http://localhost:5000/Shop");
      if (res.data.shop) {
        setShops(res.data.shop);
        console.log(res.data.shop);
      }
    } catch (err) {
      console.log("Error fetching shops", err);
    }
  }

  const filters = [
    { id: 'all', label: 'All Shops', icon: <MdList size={20} /> },
    { id: 'verified', label: 'Verified', icon: <MdCheckCircle size={20} /> },
    { id: 'pending', label: 'Pending', icon: <MdPending size={20} /> },
    { id: 'rejected', label: 'Rejected', icon: <MdCancel size={20} /> },
  ];

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    console.log('Filter changed to:', filterId);
  };

  useEffect(() => {
    fetchShops();
  }, []);
  return (
    <div className={styles.category_container}>
      <div className={styles.header}>
        <span className={styles.title}>Shops</span>

        <div className={styles.filterButtons}>
          {filters.map((filter) => (
            <button
              key={filter.id}
              className={`${styles.filterBtn} ${activeFilter === filter.id ? styles.active : ''}`}
              onClick={() => handleFilterChange(filter.id)}
              title={filter.label}
            >
              {filter.icon}
              <span className={styles.filterLabel}>{filter.label}</span>
            </button>
          ))}
        </div>
      </div>

      {activeFilter === "all" ? (
        <div className={styles.category_table}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>SlNo</th>
                <th>Shop Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {shops.length > 0 ? (
                shops.map((s, index) => (
                  <tr key={s._id}>
                    <td>{index + 1}</td>
                    <td>{s.shopName}</td>
                    <td>{s.shopEmail}</td>
                    <td>{s.shopContact}</td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${s.shopStatus === "verified"
                            ? styles.verified
                            : s.shopStatus === "pending"
                              ? styles.pending
                              : styles.rejected
                          }`}
                      >
                        {s.shopStatus}
                      </span>
                    </td>

                    <td>
                      <button className={styles.viewmore_btn} onClick={() => navigate(`/admin/shop/${s._id}`)}>View More</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>No shops found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <></>
      )}

      {activeFilter === "verified" ? (
        <div className={styles.category_table}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>SlNo</th>
                <th>Shop Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {shops.length > 0 ? (
                shops.filter((s) => s.shopStatus === "verified").map((s, index) => (
                  <tr key={s._id}>
                    <td>{index + 1}</td>
                    <td>{s.shopName}</td>
                    <td>{s.shopEmail}</td>
                    <td>{s.shopContact}</td>
                    <td>
                      <button className={styles.viewmore_btn} onClick={() => navigate(`/admin/shop/${s._id}`)}>View More</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>No shops found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <></>
      )}

      {activeFilter === "pending" ? (
        <div className={styles.category_table}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>SlNo</th>
                <th>Shop Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {shops.length > 0 ? (
                shops.filter((s) => s.shopStatus === "pending").map((s, index) => (
                  <tr key={s._id}>
                    <td>{index + 1}</td>
                    <td>{s.shopName}</td>
                    <td>{s.shopEmail}</td>
                    <td>{s.shopContact}</td>
                    <td>
                      <button className={styles.viewmore_btn} onClick={() => navigate(`/admin/shop/${s._id}`)}>View More</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>No shops found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <></>
      )}

      {activeFilter === "rejected" ? (
        <div className={styles.category_table}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>SlNo</th>
                <th>Shop Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {shops.length > 0 ? (
                shops.filter((s) => s.shopStatus === "rejected").map((s, index) => (
                  <tr key={s._id}>
                    <td>{index + 1}</td>
                    <td>{s.shopName}</td>
                    <td>{s.shopEmail}</td>
                    <td>{s.shopContact}</td>
                    <td>
                      <button className={styles.viewmore_btn} onClick={() => navigate(`/admin/shop/${s._id}`)}>View More</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>No shops found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <></>
      )}



    </div>
  );
}

export default Shop