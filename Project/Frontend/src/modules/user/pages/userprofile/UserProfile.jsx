import { useEffect, useState } from "react";
import styles from "./UserProfile.module.css";
import {
  MdEdit,
  MdSave,
  MdClose,
  MdPerson,
  MdEmail,
  MdPhone,
  MdLocationOn,
} from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { TbHome } from "react-icons/tb";
import axios from "axios";
import { RiLockPasswordLine } from "react-icons/ri";
import { toast } from "react-toastify";

const UserProfile = () => {
  const userToken = sessionStorage.getItem("token");
  const [user, setUser] = useState("");
  const [places, setPlaces] = useState([]);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswordPanel, setShowPasswordPanel] = useState(false);

  const handlePasswordChange = async () => {
    try {
      const { currentPassword, newPassword, confirmPassword } = passwordData;

      // 🔄 Function to reset fields & close panel
      const resetAll = () => {
        setShowPasswordPanel(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      };

      // 1️⃣ Validate new password match
      if (newPassword !== confirmPassword) {
        toast.warn("New password mismatch");
        resetAll(); // clear everything
        return;
      }

      // 2️⃣ API call (send only required fields)
      const res = await axios.put(
        `http://localhost:5000/ChangePassword`,
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      // 3️⃣ Success
      toast.success(res.data.message || "Password updated successfully");
      resetAll(); // clear everything
    } catch (err) {
      console.error("Password update failed", err);

      // 4️⃣ Error: still clear everything
      toast.error(err.response?.data?.message || "Something went wrong");
      setShowPasswordPanel(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });

  const fetchUser = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/UserDataFetch`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (res.data.user) {
        setUser(res.data.user);
        console.info(res.data.user);
      }
    } catch (err) {
      console.error("Error fetching userdetails", err);
    }
  };

  useEffect(() => {
    setEditedUser({ ...user });
  }, [user]);

  const fetchPlaces = async () => {
    try {
      const res = await axios.get("http://localhost:5000/Place");
      if (res.data.place) {
        setPlaces(res.data.place);
      }
    } catch (err) {
      console.error("Error fetching places", err);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchPlaces();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedUser({ ...user });
  };

  const handleSave = async () => {
    try {
      const body = {
        userName: editedUser.userName,
        userContact: editedUser.userContact,
        userAddress: editedUser.userAddress,
        userLocation: editedUser.userLocation,
        placeId: editedUser.placeId?._id,
      };

      const res = await axios.put(
        `http://localhost:5000/UserEditProfile`,
        body,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (res.data.user) {
        setUser(res.data.user);
        toast.success("Profile updated successfully");
      }

      setIsEditing(false);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser({ ...user });
  };

  const handleChange = (field, value) => {
    setEditedUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className={styles.container}>
      {!showPasswordPanel && (
        <div className={styles.profileCard}>
          {/* Profile Details */}
          <div className={styles.detailsSection}>
            <div className={styles.header}>
              <h2 className={styles.sectionTitle}>Personal Information</h2>
              {!isEditing ? (
                <div className={styles.actionButtons}>
                  <button className={styles.editBtn} onClick={handleEdit}>
                    <MdEdit /> Edit Profile
                  </button>

                  <button
                    className={styles.changepswbtn}
                    onClick={() => setShowPasswordPanel(true)}
                  >
                    <RiLockPasswordLine /> Change password
                  </button>
                </div>
              ) : (
                <div className={styles.actionButtons}>
                  <button className={styles.saveBtn} onClick={handleSave}>
                    <MdSave /> Save
                  </button>
                  <button className={styles.cancelBtn} onClick={handleCancel}>
                    <MdClose /> Cancel
                  </button>
                </div>
              )}
            </div>

            <div className={styles.detailsGrid}>
              {/* Name */}
              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>
                  <MdPerson className={styles.detailIcon} />
                  <span>Full Name</span>
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedUser.userName}
                    onChange={(e) => handleChange("userName", e.target.value)}
                    className={styles.input}
                    placeholder="Enter your name"
                  />
                ) : (
                  <p className={styles.detailValue}>{user.userName}</p>
                )}
              </div>

              {/* Email */}
              <div className={styles.detailItem}>
                {isEditing ? (
                  <></>
                ) : (
                  <>
                    <div className={styles.detailLabel}>
                      <MdEmail className={styles.detailIcon} />
                      <span>Email Address</span>
                    </div>
                    <p className={styles.detailValue}>{user.userEmail}</p>
                  </>
                )}
              </div>

              {/* Contact Number */}
              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>
                  <MdPhone className={styles.detailIcon} />
                  <span>Contact Number</span>
                </div>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedUser.userContact}
                    onChange={(e) =>
                      handleChange("userContact", e.target.value)
                    }
                    className={styles.input}
                    placeholder="Enter your contact number"
                  />
                ) : (
                  <p className={styles.detailValue}>{user.userContact}</p>
                )}
              </div>

              {/* Address */}
              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>
                  <TbHome className={styles.detailIcon} />
                  <span>Address</span>
                </div>
                {isEditing ? (
                  <textarea
                    value={editedUser.userAddress}
                    onChange={(e) =>
                      handleChange("userAddress", e.target.value)
                    }
                    className={styles.textarea}
                    placeholder="Enter your address"
                    rows="3"
                  />
                ) : (
                  <p className={styles.detailValue}>{user.userAddress}</p>
                )}
              </div>

              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>
                  <FaLocationDot className={styles.detailIcon} />
                  <span>Location</span>
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedUser.userLocation}
                    onChange={(e) =>
                      handleChange("userLocation", e.target.value)
                    }
                    className={styles.input}
                  />
                ) : (
                  <p className={styles.detailValue}>{user.userLocation}</p>
                )}
              </div>

              {/* ✅ Place (inside grid now) */}
              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>
                  <TbHome className={styles.detailIcon} />
                  <span>Place</span>
                </div>
                {isEditing ? (
                  <select
                    className={styles.input}
                    value={editedUser.placeId?._id || ""}
                    onChange={(e) =>
                      setEditedUser((prev) => ({
                        ...prev,
                        placeId: places.find((p) => p._id === e.target.value),
                      }))
                    }
                  >
                    <option value="">Select Place</option>
                    {places.map((place) => (
                      <option key={place._id} value={place._id}>
                        {place.placeName}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className={styles.detailValue}>
                    {user.placeId?.placeName}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {showPasswordPanel && (
        <div className={styles.pwdContainerBox}>
          <div className={styles.pwdHeaderSection}>
            <h3 className={styles.pwdTitleText}>Change Password</h3>
            <button
              className={styles.pwdCloseButton}
              onClick={() => setShowPasswordPanel(false)}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className={styles.pwdFormSection}>
            <div className={styles.pwdInputBlock}>
              <label className={styles.pwdInputLabel}>Current Password</label>
              <input
                type="password"
                placeholder="Enter current password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                className={styles.pwdInputField}
              />
            </div>

            <div className={styles.pwdInputBlock}>
              <label className={styles.pwdInputLabel}>New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                className={styles.pwdInputField}
              />
            </div>

            <div className={styles.pwdInputBlock}>
              <label className={styles.pwdInputLabel}>
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="Re-enter new password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                className={styles.pwdInputField}
              />
            </div>

            <div className={styles.pwdButtonGroup}>
              <button
                className={styles.pwdCancelBtn}
                onClick={() => setShowPasswordPanel(false)}
              >
                Cancel
              </button>
              <button
                className={styles.pwdUpdateBtn}
                onClick={handlePasswordChange}
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
