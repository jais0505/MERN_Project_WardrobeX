import { useEffect, useState } from 'react';
import styles from "./ProductAdding.module.css";
import { MdCloudUpload, MdDelete } from 'react-icons/md';
import { BsImageFill } from 'react-icons/bs';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProductAdding = () => {

    const [categoryRows, setCategoryRows] = useState([]);
    const [subcategoryRows, setSubcategoryRows] = useState([]);
    const [fitRows, setFitRows] = useState([]);
    const [materialRows, setMaterialRows] = useState([]);
    const [brandRows, setBrandRows] = useState([]);
    const [typeRows, setTypeRows] = useState([]);

    const [formData, setFormData] = useState({
        shopId: sessionStorage.getItem('sid'),
        productName: "",
        productDesc: "",
        selectedCategory: "",
        selectedSubcategory: "",
        selectedFit: "",
        selectedMaterial: "",
        selectedBrand: "",
        selectedType: "",
        productPrice: "",
        productImage: null,
        imagePreview: null
    });
    

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFormData(prev => ({
            ...prev,
            productImage: file,
            imagePreview: URL.createObjectURL(file)
        }));
    };


    const fetchCategories = async () => {
        try {
            const res = await axios.get("http://localhost:5000/Category");
            if (res.data.category) {
                setCategoryRows(res.data.category);
            }
        } catch (err) {
            console.log("Error fetching categories", err);
        }
    }

    const fetchSubcategory = async () => {
        try {
            const res = await axios.get("http://localhost:5000/SubcategoryPopulate");
            if (res.data.subcategory) {
                setSubcategoryRows(res.data.subcategory);
                console.log(subcategoryRows);
            }
        } catch (err) {
            console.error("Error fetching places", err);
        }
    }

    const filteredSubcategories = subcategoryRows.filter(
        (sub) => sub.categoryId?._id === formData.selectedCategory
    );

    const fetchFits = async () => {
        try {
            const res = await axios.get("http://localhost:5000/Fit");
            if (res.data.fit) {
                setFitRows(res.data.fit);
            }
        } catch (err) {
            console.log("Error fetching fits", err);
        }
    };

    const fetchMaterials = async () => {
        try {
            const res = await axios.get("http://localhost:5000/Material");
            if (res.data.material) {
                setMaterialRows(res.data.material);
            }
        } catch (err) {
            console.log("Error fetching materials", err);
        }
    }

    const fetchBrands = async () => {
        try {
            const res = await axios.get("http://localhost:5000/Brand");
            if (res.data.brand) {
                setBrandRows(res.data.brand);
            }
        } catch (err) {
            console.log("Error fetching brands", err);
        }
    };

    const fetchTypes = async () => {
        try {
            const res = await axios.get("http://localhost:5000/Type");
            if (res.data.type) {
                setTypeRows(res.data.type);
            }
        } catch (err) {
            console.log("Error fetching types", err);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchSubcategory();
        fetchFits();
        fetchMaterials();
        fetchBrands();
        fetchTypes();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = new FormData();
        form.append("shopId", formData.shopId);
        form.append("productName", formData.productName);
        form.append("productDescription", formData.productDesc);
        form.append("subcategoryId", formData.selectedSubcategory);
        form.append("productPrice", formData.productPrice);
        form.append("fitId", formData.selectedFit);
        form.append("materialId", formData.selectedMaterial);
        form.append("brandId", formData.selectedBrand);
        form.append("typeId", formData.selectedType);
            
        if(formData.productImage){
            form.append("productImage", formData.productImage);
        }

        try {
            const res = await axios.post("http://localhost:5000/Product", form);
            toast.success(res.data.message);
            setFormData({
                productName: "",
                productDesc: "",
                selectedCategory: "",
                selectedSubcategory: "",
                selectedFit: "",
                selectedMaterial: "",
                selectedBrand: "",
                selectedType: "",
                productPrice: "",
                productImage: null,
                imagePreview: null
            });

            console.log(formData);
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong!");
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.formBox}>
                <div className={styles.header}>
                    <h2 className={styles.heading}>Add New Product</h2>
                    <p className={styles.subheading}>Fill in the details below to add a product to your store</p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            Product Name <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g., Winter Classic Jacket"
                            className={styles.input}
                            value={formData.productName}
                            onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                        />
                    </div>


                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            Product Description <span className={styles.required}>*</span>
                        </label>
                        <textarea
                            placeholder="Describe your product in detail..."
                            rows="4"
                            className={styles.textarea}
                            value={formData.productDesc}
                            onChange={(e) => setFormData({ ...formData, productDesc: e.target.value })}
                        ></textarea>
                    </div>


                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Category <span className={styles.required}>*</span>
                            </label>
                            <select
                                className={styles.select}
                                value={formData.selectedCategory}
                                onChange={(e) => setFormData({ ...formData, selectedCategory: e.target.value })}>
                                <option value="">Select Category</option>
                                {categoryRows.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.categoryName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Subcategory <span className={styles.required}>*</span>
                            </label>
                            <select className={styles.select} value={formData.selectedSubcategory} onChange={(e) => setFormData({ ...formData, selectedSubcategory: e.target.value })}>
                                <option value="">Select Subcategory</option>
                                {filteredSubcategories.map((sub) => (
                                    <option key={sub._id} value={sub._id}>
                                        {sub.subcategoryName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Fitting</label>
                            <select className={styles.select} value={formData.selectedFit} onChange={(e) => setFormData({ ...formData, selectedFit: e.target.value })}>
                                <option value="">Select Fitting</option>
                                {fitRows.map((fit) => (
                                    <option key={fit._id} value={fit._id}>{fit.fitName}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Material</label>
                            <select className={styles.select} value={formData.selectedMaterial} onChange={(e) => setFormData({ ...formData, selectedMaterial: e.target.value })}>
                                <option value="">Select Material</option>
                                {materialRows.map((mat) => (
                                    <option key={mat._id} value={mat._id}>{mat.materialName}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Type</label>
                            <select className={styles.select} value={formData.selectedType} onChange={(e) => setFormData({ ...formData, selectedType: e.target.value })}>
                                <option value="">Select Type</option>
                                {typeRows.map((typ) => (
                                    <option key={typ._id} value={typ._id}>{typ.typeName}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Brand</label>
                            <select className={styles.select} value={formData.selectedBrand} onChange={(e) => setFormData({ ...formData, selectedBrand: e.target.value })}>
                                <option value="">Select Brand</option>
                                {brandRows.map((bar) => (
                                    <option key={bar._id} value={bar._id}>{bar.brandName}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            Product Price <span className={styles.required}>*</span>
                        </label>
                        <div className={styles.priceInput}>
                            <span className={styles.currencySymbol}>₹</span>
                            <input
                                type="number"
                                placeholder="0.00"
                                className={styles.input}
                                value={formData.productPrice}
                                onChange={(e) => setFormData({ ...formData, productPrice: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            Product Image <span className={styles.required}>*</span>
                        </label>

                        <div className={styles.uploadArea}>
                            <input
                                type="file"
                                accept="image/*"
                                id="imageUpload"
                                className={styles.fileInput}
                                onChange={handleImageUpload}
                            />

                            <label htmlFor="imageUpload" className={styles.uploadLabel}>
                                <MdCloudUpload className={styles.uploadIcon} />
                                <span className={styles.uploadText}>Click to upload</span>
                                <span className={styles.uploadSubtext}>PNG, JPG or WEBP (max. 5MB)</span>
                            </label>
                        </div>

                        {formData.imagePreview && (
                            <div className={styles.ImagePreviewCard}>
                                <img src={formData.imagePreview} alt="Preview" className={styles.previewImage} />
                            </div>
                        )}

                    </div>



                    <div className={styles.submitContainer}>
                        <button type="button" className={styles.cancelBtn}>
                            Cancel
                        </button>
                        <button type="submit" className={styles.submitBtn}>
                            Add Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductAdding;