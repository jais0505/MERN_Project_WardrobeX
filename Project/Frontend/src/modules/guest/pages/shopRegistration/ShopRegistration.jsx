import { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash, FaStore, FaMapMarkerAlt, FaFileAlt, FaCheckCircle } from 'react-icons/fa';
import styles from './ShopRegistration.module.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';

const ShopRegistration = () => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [districtRows, setDistrictRows] = useState([]);
  const [placeRows, setPlaceRows] = useState([]);

  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    shopName: "",
    email: "",
    contactNo: "",
    password: "",
    confirmPassword: "",
    district: "",
    placeId: "",
    address: "",
    location: "",
    shopImage: null,
    shopProof: null,
    PANNo: "",
    GSTNo: ""
  });

  const handleNext = (e) => {
    e.preventDefault();

    // ✅ Step 1 Validation (Basic Info)
    if (step === 1) {
      if (
        !formData.shopName.trim() ||
        !formData.email.trim() ||
        !formData.contactNo.trim() ||
        !formData.password.trim() ||
        !formData.confirmPassword.trim()
      ) {
        toast.warn("Please fill all fields in Basic Info.");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toast.warn("Passwords do not match.");
        return;
      }
    }

    // ✅ Step 2 Validation (Location)
    if (step === 2) {
      if (
        !formData.district.trim() ||
        !formData.placeId.trim() ||
        !formData.address.trim()
      ) {
        toast.warn("Please fill location details.");
        return;
      }
    }

    // ✅ Step 3 Validation (Documents)
    if (step === 3) {
      if (!formData.shopImage || !formData.shopProof || !formData.PANNo.trim()) {
        toast.warn("Please upload required documents.");
        return;
      }
    }

    // ✅ Move to Next Step
    setStep(step + 1);
  };


  const handlePrev = (e) => {
    e.preventDefault();
    setStep(step - 1);
  };

  const fetchDistricts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/District");
      if (res.data.district) {
        setDistrictRows(res.data.district);
      }
    } catch (err) {
      console.error("Error fetching districts", err);
    }
  };

  const fetchPlaces = async () => {
    try {
      const res = await axios.get("http://localhost:5000/PlacePopulate");
      if (res.data.place) {
        setPlaceRows(res.data.place);
      }
    } catch (err) {
      console.error("Error fetching places", err);
    }
  };

  const handleSubmit = async () => {
    const form = new FormData();

    form.append("shopName", formData.shopName);
    form.append("shopEmail", formData.email);
    form.append("shopContact", formData.contactNo);
    form.append("shopPassword", formData.password);
    form.append("shopAddress", formData.address);
    form.append("placeId", formData.placeId);
    form.append("shopLocation", formData.location);
    form.append("PANNO", formData.PANNo);
    form.append("GSTNO", formData.GSTNo);

    if (formData.shopImage) {
      form.append("shopImage", formData.shopImage);
    }

    if (formData.shopProof) {
      form.append("shopProof", formData.shopProof);
    }

    try {
      const res = await axios.post('http://localhost:5000/Shop', form);
      toast.success(res.data.message);
      setFormData({
        shopName: "",
        email: "",
        contactNo: "",
        password: "",
        address: "",
        shopImage: null,
        shopProof: null,
        PANNo: "",
        GSTNo: "",
        district: "",
        placeId: ""
      });
      setTimeout(() => {
      navigate("/");
    }, 2000);
    } catch (err) {
      console.error(err);
      toast.error("Shop registartion failed");
    }
  }

  useEffect(() => {
    fetchDistricts();
    fetchPlaces();
  }, []);

  const steps = [
    { number: 1, label: 'Basic Info', icon: <FaStore /> },
    { number: 2, label: 'Location', icon: <FaMapMarkerAlt /> },
    { number: 3, label: 'Documents', icon: <FaFileAlt /> },
    { number: 4, label: 'Review', icon: <FaCheckCircle /> }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Step Progress Indicator */}
        <div className={styles.stepContainer}>
          <div className={styles.stepWrapper}>
            {steps.map((s, index) => (
              <div key={s.number} className={styles.stepGroup}>
                <div className={`${styles.step} ${step >= s.number ? styles.stepActive : ''} ${step > s.number ? styles.stepCompleted : ''}`}>
                  <div className={`${styles.stepIcon} ${step >= s.number ? styles.stepIconActive : ''}`}>
                    {step > s.number ? <FaCheckCircle /> : s.icon}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`${styles.line} ${step > s.number ? styles.lineActive : ''}`} />
                )}
              </div>
            ))}
          </div>
          <div className={styles.labels}>
            {steps.map(s => (
              <span key={s.number} className={`${styles.labelText} ${step >= s.number ? styles.labelActive : ''}`}>
                {s.label}
              </span>
            ))}
          </div>
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className={styles.formContainer}>
            <div className={styles.header}>
              <h2 className={styles.title}>Shop Registration</h2>
              <p className={styles.subtitle}>Let's get your shop set up in just a few steps</p>
            </div>

            <div className={styles.formContent}>
              <div className={styles.inputWrapper}>
                <label className={styles.label}>Shop Name</label>
                <input
                  type="text"
                  placeholder="Enter your shop name"
                  className={styles.input}
                  value={formData.shopName}
                  onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                  required
                />
              </div>

              <div className={styles.inputWrapper}>
                <label className={styles.label}>Email Address</label>
                <input
                  type="email"
                  placeholder="shop@example.com"
                  className={styles.input}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className={styles.inputWrapper}>
                <label className={styles.label}>Contact Number</label>
                <input
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  className={styles.input}
                  value={formData.contactNo}
                  onChange={(e) => setFormData({ ...formData, contactNo: e.target.value })}
                  required
                />
              </div>

              <div className={styles.inputWrapper}>
                <label className={styles.label}>Password</label>
                <div className={styles.inputGroup}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    className={styles.input}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <span
                    className={styles.eyeIcon}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>
              </div>

              <div className={styles.inputWrapper}>
                <label className={styles.label}>Confirm Password</label>
                <div className={styles.inputGroup}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    className={styles.input}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                  <span
                    className={styles.eyeIcon}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>
              </div>

              <div className={styles.buttonGroup}>
                <button className={styles.nextButton} onClick={handleNext}>
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <div className={styles.formContainer}>
            <div className={styles.header}>
              <h2 className={styles.title}>Location Details</h2>
              <p className={styles.subtitle}>Help customers find your shop easily</p>
            </div>

            <div className={styles.formContent}>
              <div className={styles.inputWrapper}>
                <label className={styles.label}>District</label>
                <select
                  className={styles.input}
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                >
                  <option value="">Select your district</option>
                  {districtRows.map((d) => (
                    <option key={d._id} value={d._id}>{d.districtName}</option>
                  ))}
                </select>

              </div>

              <div className={styles.inputWrapper}>
                <label className={styles.label}>Place</label>
                <select
                  className={styles.input}
                  value={formData.place}
                  onChange={(e) => setFormData({ ...formData, placeId: e.target.value })}
                >
                  <option value="">Select your place</option>
                  {placeRows
                    .filter((p) => p.districtId?._id === formData.district) // ✅ filter by district
                    .map((p) => (
                      <option key={p._id} value={p._id}>{p.placeName}</option>
                    ))}
                </select>

              </div>

              <div className={styles.inputWrapper}>
                <label className={styles.label}>Complete Address</label>
                <textarea
                  placeholder="Building name, street, landmark..."
                  className={`${styles.input} ${styles.textarea}`}
                  rows="3"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className={styles.inputWrapper}>
                <label className={styles.label}>Location</label>
                <input
                  type="text"
                  placeholder="Location"
                  className={styles.input}
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>

              <div className={styles.buttonGroup}>
                <button className={styles.prevButton} onClick={handlePrev}>
                  Back
                </button>
                <button className={styles.nextButton} onClick={handleNext}>
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Documents */}
        {step === 3 && (
          <div className={styles.formContainer}>
            <div className={styles.header}>
              <h2 className={styles.title}>Upload Documents</h2>
              <p className={styles.subtitle}>Required for verification purposes</p>
            </div>

            <div className={styles.formContent}>
              <div className={styles.inputWrapper}>
                <label className={styles.label}>Shop Image</label>
                <div className={styles.fileInputWrapper}>
                  <input
                    type="file"
                    id="shopImage"
                    className={styles.fileInputHidden}
                    onChange={(e) =>
                      setFormData({ ...formData, shopImage: e.target.files[0] })
                    }
                  />
                  <label htmlFor="shopImage" className={styles.fileLabel}>
                    {formData.shopImage ? (
                      <span>{formData.shopImage.name}</span>
                    ) : (
                      <span>Choose file or drag here</span>
                    )}
                  </label>
                </div>
              </div>


              <div className={styles.inputWrapper}>
                <label className={styles.label}>Shop Proof Document</label>
                <div className={styles.fileInputWrapper}>
                  <input
                    type="file"
                    id="shopProof"
                    className={styles.fileInputHidden}
                    onChange={(e) => setFormData({ ...formData, shopProof: e.target.files[0] })}
                  />
                  <label htmlFor="shopProof" className={styles.fileLabel}>
                    {formData.shopProof ? (
                      <span>{formData.shopProof.name}</span>
                    ) : (
                      <span>Choose file or drag here</span>
                    )}
                  </label>
                </div>
              </div>


              <div className={styles.inputWrapper}>
                <label className={styles.label}>PAN Number</label>
                <input
                  type="text"
                  placeholder="ABCDE1234F"
                  className={styles.input}
                  value={formData.PANNo}
                  onChange={(e) => setFormData({ ...formData, PANNo: e.target.value })}
                />
              </div>

              <div className={styles.inputWrapper}>
                <label className={styles.label}>GST Number (Optional)</label>
                <input
                  type="text"
                  placeholder="22AAAAA0000A1Z5"
                  className={styles.input}
                  value={formData.GSTNo}
                  onChange={(e) => setFormData({ ...formData, GSTNo: e.target.value })}
                />
              </div>

              <div className={styles.buttonGroup}>
                <button className={styles.prevButton} onClick={handlePrev}>
                  Back
                </button>
                <button className={styles.nextButton} onClick={handleNext}>
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className={styles.formContainer}>
            <div className={styles.header}>
              <div className={styles.successIcon}>
                <FaCheckCircle />
              </div>
              <h2 className={styles.title}>Review & Submit</h2>
              <p className={styles.subtitle}>You can update any details before submitting</p>
            </div>

            <div className={styles.formContent}>

              {/* ✅ Editable Fields */}
              <label className={styles.label}>Shop Name</label>
              <input
                type="text"
                className={styles.input}
                value={formData.shopName}
                disabled={!isEditing}
                onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
              />

              <label className={styles.label}>Email</label>
              <input
                type="email"
                className={styles.input}
                value={formData.email}
                disabled={!isEditing}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />

              <label className={styles.label}>Contact Number</label>
              <input
                type="text"
                className={styles.input}
                value={formData.contactNo}
                disabled={!isEditing}
                onChange={(e) => setFormData({ ...formData, contactNo: e.target.value })}
              />

              <label className={styles.label}>District</label>
              <select
                className={styles.input}
                disabled={!isEditing}
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              >
                {districtRows.map((d) => (
                  <option key={d._id} value={d._id}>{d.districtName}</option>
                ))}
              </select>

              <label className={styles.label}>Place</label>
              <select
                className={styles.input}
                disabled={!isEditing}
                value={formData.place}
                onChange={(e) => setFormData({ ...formData, place: e.target.value })}
              >
                {placeRows
                  .filter((p) => p.districtId?._id === formData.district)
                  .map((p) => (
                    <option key={p._id} value={p._id}>{p.placeName}</option>
                  ))}
              </select>

              <label className={styles.label}>Address</label>
              <textarea
                className={`${styles.input} ${styles.textarea}`}
                disabled={!isEditing}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />

              <label className={styles.label}>Shop Image</label>

              {formData.shopImage && (
                <p className={styles.fileName}>
                  {typeof formData.shopImage === "string"
                    ? formData.shopImage.split('/').pop()        // If existing URL
                    : formData.shopImage.name                    // If new file
                  }
                </p>
              )}

              {isEditing && (
                <input
                  type="file"
                  className={styles.fileInput}
                  onChange={(e) => setFormData({ ...formData, shopImage: e.target.files[0] })}
                />
              )}


              <label className={styles.label}>Shop Proof</label>

              {formData.shopProof && (
                <p className={styles.fileName}>
                  {typeof formData.shopProof === "string"
                    ? formData.shopProof.split('/').pop()        // If existing URL
                    : formData.shopProof.name                    // If new file
                  }
                </p>
              )}

              {isEditing && (
                <input
                  type="file"
                  className={styles.fileInput}
                  onChange={(e) => setFormData({ ...formData, shopProof: e.target.files[0] })}
                />
              )}



              <label className={styles.label}>PAN No.</label>
              <input
                type="text"
                className={styles.input}
                value={formData.PANNo}
                disabled={!isEditing}
                onChange={(e) => setFormData({ ...formData, PANNo: e.target.value })}
              />

              <label className={styles.label}>GST No.</label>
              <input
                type="text"
                className={styles.input}
                value={formData.GSTNo}
                disabled={!isEditing}
                onChange={(e) => setFormData({ ...formData, GSTNo: e.target.value })}
              />

            </div>

            {/* ✅ Buttons */}
            <div className={styles.buttonGroup}>
              <button className={styles.prevButton} onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? "Done Editing" : "Edit"}
              </button>

              <button className={styles.submitButton} onClick={handleSubmit}>
                Submit Registration
              </button>
            </div>
          </div>
        )}



      </div>
    </div>
  );
};

export default ShopRegistration;