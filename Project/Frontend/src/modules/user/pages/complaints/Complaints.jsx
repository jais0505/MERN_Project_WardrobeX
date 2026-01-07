import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  RiArrowLeftLine,
  RiImageAddLine,
  RiErrorWarningLine,
  RiCloseLine,
} from "react-icons/ri";
import { toast } from "react-toastify";
import axios from "axios";
import styles from "./Complaints.module.css";

const CreateComplaint = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get orderItemId passed from previous page
  const { orderItemId } = location.state || {};
  const userToken = sessionStorage.getItem("token");

  // Debug
  useEffect(() => {
    console.log("CreateComplaint Loaded");
    console.log("orderItemId:", orderItemId);
    console.log("userToken:", userToken);
  }, []);

  // Context Data

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  // const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Image Upload
  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file && file.size > 2 * 1024 * 1024) {
  //     toast.warning("Image size should be less than 2MB");
  //     return;
  //   }
  //   setSelectedImage(file);
  // };

  // Submit Complaint
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        complaintTitle: formData.title,
        complaintDescription: formData.description,
      };

      await axios.post(
        `http://127.0.0.1:5000/complaint/create/${orderItemId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      toast.success("Complaint submitted successfully");
      navigate("/user/mycomplaints");
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit complaint"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <button onClick={() => navigate(-1)} className={styles.backBtn}>
            <RiArrowLeftLine />
          </button>
          <h1 className={styles.pageTitle}>File a Complaint</h1>
          <div style={{ width: "40px" }}></div>
        </header>

        <form onSubmit={handleSubmit} className={styles.complaintForm}>
          {/* Context UI */}
          <div className={styles.contextBox}>
            <div className={styles.contextItem}>
              <label>Order Item</label>
              <p>#{orderItemId?.slice(-8)}</p>
            </div>
          </div>

          {/* Title */}
          <div className={styles.inputGroup}>
            <label htmlFor="title">Complaint Title</label>
            <input
              id="title"
              type="text"
              placeholder="Damaged Product / Wrong Item / Missing Parts"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className={styles.textInput}
            />
          </div>

          {/* Description */}
          <div className={styles.inputGroup}>
            <label htmlFor="description">Detailed Description</label>
            <textarea
              id="description"
              placeholder="Explain what went wrong..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className={styles.textarea}
            />
          </div>

          {/* Image Upload
          <div className={styles.imageUploadSection}>
            <label>Attachments (Optional)</label>

            {!selectedImage ? (
              <label className={styles.uploadPlaceholder}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  hidden
                />
                <RiImageAddLine size={24} />
                <span>Upload a photo of the issue</span>
              </label>
            ) : (
              <div className={styles.imagePreviewBox}>
                <img src={URL.createObjectURL(selectedImage)} alt="Preview" />
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className={styles.removeImgBtn}
                >
                  <RiCloseLine />
                </button>
              </div>
            )}
          </div> */}

          {/* Submit */}
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Submit Complaint"}
          </button>

          <p className={styles.supportNote}>
            <RiErrorWarningLine /> Our support team typically responds within
            24-48 hours.
          </p>
        </form>
      </div>
    </div>
  );
};

export default CreateComplaint;
