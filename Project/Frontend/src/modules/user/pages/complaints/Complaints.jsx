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

  // Data from OrderDetails
  const { orderItemId } = location.state || {};
  const userId = sessionStorage.getItem("uid");
  
  useEffect(() => {
  console.log("CreateComplaint Loaded");
  console.log("orderItemId:", orderItemId);
  console.log("userId:", userId);
}, []);

  const [context, setContext] = useState(null);
  const [loadingContext, setLoadingContext] = useState(true);

  useEffect(() => {
    if (!orderItemId) {
      navigate("/user/myorders");
      return;
    }

    const fetchContext = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:5000/complaint/context/${orderItemId}`
        );

        setContext(res.data);
      } catch (err) {
        console.error("Error fetching complaint context:", err);
        toast.error("Unable to load complaint details");
        // navigate(-1);
      } finally {
        setLoadingContext(false);
      }
    };

    fetchContext();
  }, [orderItemId]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Security check: Redirect if no order data is present
  useEffect(() => {
    if (!orderItemId) {
      toast.error("No order selected. Redirecting...");
      navigate("/user/myorders");
    }
  }, [orderItemId, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) {
      toast.warning("Image size should be less than 2MB");
      return;
    }
    setSelectedImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = sessionStorage.getItem("uid");

    if (!formData.title || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Using FormData in case you decide to support image uploads to the backend
      const payload = {
        userId,
        orderItemId,
        complaintTitle: formData.title,
        complaintDescription: formData.description,
      };

      await axios.post("http://127.0.0.1:5000/complaint/create", payload);

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
          {/* Read-Only Context Section */}
          <div className={styles.contextBox}>
            <div className={styles.contextItem}>
              <label>Product</label>
              <p>{loadingContext ? "Loading..." : context?.productName}</p>
            </div>

            <div className={styles.contextItem}>
              <label>Order Item</label>
              <p>#{orderItemId.slice(-8)}</p>
            </div>
          </div>  

          {/* Input: Title */}
          <div className={styles.inputGroup}>
            <label htmlFor="title">Complaint Title</label>
            <input
              id="title"
              type="text"
              placeholder="Briefly describe the issue (e.g., Damaged Product)"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className={styles.textInput}
            />
          </div>

          {/* Input: Description */}
          <div className={styles.inputGroup}>
            <label htmlFor="description">Detailed Description</label>
            <textarea
              id="description"
              placeholder="Please provide as much detail as possible..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className={styles.textarea}
            />
          </div>

          {/* Optional: Image Upload UI */}
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
          </div>

          {/* Submit Button */}
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
