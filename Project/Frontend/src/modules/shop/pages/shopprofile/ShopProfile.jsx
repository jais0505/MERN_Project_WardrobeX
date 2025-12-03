import { useEffect, useState } from "react";
import styles from "./ShopProfile.module.css";
import {
  MdEdit,
  MdSave,
  MdClose,
  MdStorefront,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdMyLocation,
} from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import axios from "axios";
import { toast } from "react-toastify";

const ShopProfile = () => {
  const shopId = sessionStorage.getItem("sid");
  console.log("ShopId:", shopId);
  const [shop, setShop] = useState();
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  

  const fetchShopData = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/Shop/${shopId}`);
      if (res.data.shop) {
        setShop(res.data.shop);
        console.log("Shop data:", res.data.shop);
      }
    } catch (err) {
      console.error("Error fetching shop data:", err);
    }
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editedShop, setEditedShop] = useState({ ...shop });
  const [imagePreview, setImagePreview] = useState(shop?.shopImage);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedShop({
      shopName: shop.shopName,
      shopEmail: shop.shopEmail,
      shopContact: shop.shopContact,
      shopAddress: shop.shopAddress,
      shopLocation: shop.shopLocation,
      shopImage: shop.shopImage,
    });
    setImagePreview(shop.shopImage);
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("shopName", editedShop.shopName);
      formData.append("shopContact", editedShop.shopContact);
      formData.append("shopAddress", editedShop.shopAddress);
      formData.append("shopLocation", editedShop.shopLocation);

      if (editedShop.shopImageFile) {
        formData.append("shopImage", editedShop.shopImageFile);
      }

      await axios.put(`http://localhost:5000/ShopEditing/${shopId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Shop updated");
      setIsEditing(false);
      fetchShopData();
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setImagePreview(shop.shopImage);
  };

  const handleChange = (field, value) => {
    setEditedShop((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);

      setEditedShop((prev) => ({
        ...prev,
        shopImage: reader.result,
        shopImageFile: file,
      }));
    };

    reader.readAsDataURL(file);
  };


  useEffect(() => {
    fetchShopData();
  }, []);

  useEffect(() => {
    if (shop) {
      setEditedShop({
        shopName: shop.shopName || "",
        shopEmail: shop.shopEmail || "",
        shopContact: shop.shopContact || "",
        shopAddress: shop.shopAddress || "",
        shopLocation: shop.shopLocation || "",
        shopImage: shop.shopImage || "",
      });
      setImagePreview(shop.shopImage);
    }
  }, [shop]);

  const ChangePasswordSection = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handlePasswordUpdate = async () => {
      if (!oldPassword || !newPassword || !confirmPassword) {
        return toast.warn("All fields are required");
      }

      if (newPassword !== confirmPassword) {
        return toast.warn("New password mismatch");
      }

      try {
        const res = await axios.put(
          `http://localhost:5000/ShopChangePassword/${shopId}`,
          { oldPassword, newPassword }
        );

        if(res){
          toast.success("Password updated successfully");
        setIsChangingPassword(false);

        // Clear fields
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to update password");
      }
    };

    return (
      <div className={styles.pwd_container}>
        <h2 className={styles.pwd_title}>Change Password</h2>

        <label className={styles.pwd_label}>Old Password</label>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className={styles.pwd_input}
        />

        <label className={styles.pwd_label}>New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className={styles.pwd_input}
        />

        <label className={styles.pwd_label}>Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={styles.pwd_input}
        />

        <div className={styles.pwd_btn_group}>
          <button
            className={styles.pwd_save_btn}
            onClick={handlePasswordUpdate}
          >
            <MdSave /> Save
          </button>

          <button
            className={styles.pwd_cancel_btn}
            onClick={() => setIsChangingPassword(false)}
          >
            <MdClose /> Cancel
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {isChangingPassword ? (
        <ChangePasswordSection />
      ) : (
        <div className={styles.profileCard}>
          {/* Header */}
          <div className={styles.header}>
            <h1 className={styles.title}>Shop Profile</h1>
            <div className={styles.headerButtons}>
              {!isEditing ? (
                <>
                  <button className={styles.editBtn} onClick={handleEdit}>
                    <MdEdit /> Edit Profile
                  </button>
                  <button
                    className={styles.changePswBtn}
                    onClick={() => setIsChangingPassword(true)}
                  >
                    <RiLockPasswordLine /> Change Password
                  </button>
                </>
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
          </div>

          <div className={styles.content}>
            {/* Shop Image Section */}
            <div className={styles.imageSection}>
              <div className={styles.imageWrapper}>
                <img
                  src={isEditing ? imagePreview : shop?.shopImage}
                  alt={shop?.shopName}
                  className={styles.shopImage}
                />
                {isEditing && (
                  <label className={styles.imageUploadBtn}>
                    <MdEdit />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className={styles.fileInput}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Details Section */}
            <div className={styles.detailsSection}>
              <div className={styles.detailsGrid}>
                {/* Shop Name */}
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>
                    <MdStorefront className={styles.detailIcon} />
                    <span>Shop Name</span>
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedShop.shopName}
                      onChange={(e) => handleChange("shopName", e.target.value)}
                      className={styles.input}
                      placeholder="Enter shop name"
                    />
                  ) : (
                    <p className={styles.detailValue}>{shop?.shopName}</p>
                  )}
                </div>

                {/* Email */}
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>
                    <MdEmail className={styles.detailIcon} />
                    <span>Email Address</span>
                  </div>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedShop.shopEmail}
                      onChange={(e) =>
                        handleChange("shopEmail", e.target.value)
                      }
                      className={styles.input}
                      placeholder="Enter email"
                      disabled
                    />
                  ) : (
                    <p className={styles.detailValue}>{shop?.shopEmail}</p>
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
                      value={editedShop.shopContact}
                      onChange={(e) =>
                        handleChange("shopContact", e.target.value)
                      }
                      className={styles.input}
                      placeholder="Enter contact number"
                    />
                  ) : (
                    <p className={styles.detailValue}>{shop?.shopContact}</p>
                  )}
                </div>

                {/* Address */}
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>
                    <MdLocationOn className={styles.detailIcon} />
                    <span>Address</span>
                  </div>
                  {isEditing ? (
                    <textarea
                      value={editedShop.shopAddress}
                      onChange={(e) =>
                        handleChange("shopAddress", e.target.value)
                      }
                      className={styles.textarea}
                      placeholder="Enter address"
                      rows="2"
                    />
                  ) : (
                    <p className={styles.detailValue}>{shop?.shopAddress}</p>
                  )}
                </div>

                {/* Location */}
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>
                    <MdMyLocation className={styles.detailIcon} />
                    <span>Location</span>
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedShop.shopLocation}
                      onChange={(e) =>
                        handleChange("shopLocation", e.target.value)
                      }
                      className={styles.input}
                      placeholder="Enter location"
                    />
                  ) : (
                    <p className={styles.detailValue}>{shop?.shopLocation}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopProfile;
