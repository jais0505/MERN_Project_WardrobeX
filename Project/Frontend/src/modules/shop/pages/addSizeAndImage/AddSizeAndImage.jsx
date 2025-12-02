import { useEffect, useState } from 'react'
import styles from './AddSizeAndImage.module.css'
import { MdArrowBack, MdAdd, MdClose, MdCloudUpload, MdCheck, MdDelete } from 'react-icons/md'
import { useNavigate, useParams } from 'react-router'
import axios from 'axios'

const AddSizeAndImage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [variant, setVariant] = useState(null);
  const [availableSizes, setAvailableSizes] = useState([]);

  const fetchVarinatDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/Variant/${id}`);
      if (res.data.variant) {
        setVariant(res.data.variant);
        console.log(res.data.variant);
      }
    } catch (err) {
      console.error("Error fetching variants details", err);
    }
  }

  const fetchSizes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/Size");
      if (res.data.size) {
        setAvailableSizes(res.data.size);
      }
    } catch (err) {
      console.log("Error fetching sizes", err);
    }
  };

  useEffect(() => {
    fetchVarinatDetails();
    fetchSizes();
  }, [])
  const [selectedSizes, setSelectedSizes] = useState([])
  const [uploadedImages, setUploadedImages] = useState([])

  const toggleSize = (size) => {
    if (selectedSizes.some(s => s._id === size._id)) {
      setSelectedSizes(selectedSizes.filter(s => s._id !== size._id))
    } else {
      setSelectedSizes([...selectedSizes, size])
    }
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const newImages = files.map(file => ({
      id: Math.random(),
      preview: URL.createObjectURL(file),
      file: file
    }))
    setUploadedImages(prev => [...prev, ...newImages])
  }

  const removeImage = (id) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id))
  }

  const handleSubmit = async () => {
    if (selectedSizes.length === 0) {
      alert('Please select at least one size')
      return
    }

    if (uploadedImages.length === 0) {
      alert('Please upload at least one image')
      return
    }

    try {
      // 1️⃣ INSERT SIZE ENTRIES
      for (const size of selectedSizes) {
        await axios.post("http://localhost:5000/VariantSize", {
          variantId: id,
          sizeId: size._id,
        });
      }

      // 2️⃣ INSERT IMAGES
      const formData = new FormData();
      formData.append("variantId", id);

      uploadedImages.forEach((img) => {
        formData.append("productImage", img.file);
      });

      await axios.post("http://localhost:5000/Image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Sizes & Images added successfully!");
      navigate(-1);

    } catch (error) {
      console.error("Error submitting:", error);
      alert("Something went wrong!");
    }
  }

  if (!variant) {
    return (
      <div>Variant details loading...</div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Back Button */}
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        <MdArrowBack /> Back to Variants
      </button>

      <div className={styles.content}>
        {/* Variant Info Header */}
        <div className={styles.variantHeader}>
          <div className={styles.colorIndicator}>
            <div
              className={styles.colorCircle}
              style={{ backgroundColor: variant.colorId?.colorName }}
            ></div>
            <div>
              <h1 className={styles.pageTitle}>Add Sizes & Images</h1>
              <p className={styles.variantInfo}>
                {variant.productId?.productName} - {variant.colorId?.colorName}
              </p>
            </div>
          </div>
        </div>

        <div className={styles.mainContent}>
          {/* Sizes Section */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Available Sizes</h2>
              <span className={styles.selectedCount}>
                {selectedSizes.length} selected
              </span>
            </div>

            <div className={styles.sizeGrid}>
              {availableSizes.map((size) => (
                <div
                  key={size._id}
                  className={`${styles.sizeOption} ${selectedSizes.some(s => s._id === size._id) ? styles.selected : ''}`}
                  onClick={() => toggleSize(size)}
                >
                  <span className={styles.sizeName}>{size.sizeName}</span>
                  {selectedSizes.some(s => s._id === size._id) && (
                    <MdCheck className={styles.checkIcon} />
                  )}
                </div>
              ))}
            </div>

            {selectedSizes.length > 0 && (
              <div className={styles.selectedSizesList}>
                <p className={styles.selectedLabel}>Selected Sizes:</p>
                <div className={styles.selectedTags}>
                  {selectedSizes.map((size) => (
                    <span key={size._id} className={styles.sizeTag}>
                      {size.sizeName}
                      <button
                        className={styles.removeTagBtn}
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleSize(size)
                        }}
                      >
                       <MdDelete style={{color : "red"}} /> 
                      </button>
                      
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Images Section */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Product Images</h2>
              <span className={styles.selectedCount}>
                {uploadedImages.length} uploaded
              </span>
            </div>

            <div className={styles.uploadArea}>
              <input
                type="file"
                multiple
                accept="image/*"
                id="imageUpload"
                className={styles.fileInput}
                onChange={handleImageUpload}
              />
              <label htmlFor="imageUpload" className={styles.uploadLabel}>
                <MdCloudUpload className={styles.uploadIcon} />
                <span className={styles.uploadText}>Click to upload images</span>
                <span className={styles.uploadSubtext}>PNG, JPG or WEBP (max. 5MB each)</span>
              </label>
            </div>

            {uploadedImages.length > 0 && (
              <div className={styles.imagePreviewGrid}>
                {uploadedImages.map((img) => (
                  <div key={img.id} className={styles.imagePreviewCard}>
                    <img src={img.preview} alt="Preview" className={styles.previewImage} />
                    <button
                      type="button"
                      className={styles.deleteBtn}
                      onClick={() => removeImage(img.id)}
                    >
                      <MdClose />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className={styles.submitSection}>
          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={selectedSizes.length === 0 || uploadedImages.length === 0}
          >
            <MdAdd /> Save Sizes & Images
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddSizeAndImage