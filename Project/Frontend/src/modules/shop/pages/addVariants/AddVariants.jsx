import { useEffect, useState } from 'react'
import styles from './AddVariants.module.css'
import { MdArrowBack, MdAdd, MdClose, MdCheck, MdCloudUpload } from 'react-icons/md'
import { useNavigate, useParams } from 'react-router'
import axios from 'axios'
import { toast } from 'react-toastify'

const AddVariants = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    const [availableColors, setAvailableColors] = useState([]);
    const [selectedColor, setSelectedColor] = useState(null);
    const [variants, setVariants] = useState([]);

    const fetchProductDetails = async () => {
        try {
            console.log(`ProductId: ${id}`);
            const res = await axios.get(`http://localhost:5000/Product/${id}`);
            if (res.data.product) {
                setProduct(res.data.product);
                console.log(res.data.product);
            }
        } catch (err) {
            console.error("Error fetching product details", err);
        }
    }

    const fetchColors = async () => {
        try {
            const res = await axios.get("http://localhost:5000/Color");
            if (res.data.color) {
                setAvailableColors(res.data.color);
                console.log(res.data.color);
            }
        } catch (err) {
            console.log("Error fetching colors", err);
        }
    };

    useEffect(() => {
        fetchProductDetails();
        fetchColors();
    }, []);

    const handleColorSelect = (color) => {
        setSelectedColor(color)
    }

    const handleAddVariant = () => {
        if (!selectedColor) {
            alert('Please select a color')
            return
        }

        // Check if color already exists
        if (variants.some(v => v.color._id === selectedColor._id)) {
            alert('This color variant already exists')
            return
        }

        const newVariant = {
            id: Date.now(),
            color: selectedColor
        }

        setVariants([...variants, newVariant])

        // Reset form
        setSelectedColor(null)
    }

    const removeVariant = (id) => {
        setVariants(variants.filter(v => v.id !== id))
    }

    const handleSubmit = async () => {
    if (variants.length === 0) {
        alert('Please add at least one variant');
        return;
    }

    try {
        for (const variant of variants) {
            await axios.post("http://localhost:5000/Variant", {
                productId: id,
                colorId: variant.color._id
            });
        }

        toast.success("Variants saved successfully!");
        navigate(-1);
    } catch (err) {
        toast.error("Error saving variants", err);
        alert("Failed to save variants");
    }
};


    if (!product) {
        return <div className={styles.loading}>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <button className={styles.backBtn} onClick={() => navigate(-1)}>
                <MdArrowBack /> Back to Product
            </button>

            <div className={styles.content}>
                <div className={styles.productHeader}>
                    <img src={`http://127.0.0.1:5000/images/${product.productImage}`} alt={product.productName} className={styles.productThumb} />
                    <div>
                        <h1 className={styles.pageTitle}>Add Color Variants</h1>
                        <p className={styles.productName}>{product.productName}</p>
                    </div>
                </div>

                <div className={styles.mainContent}>
                    <div className={styles.formSection}>
                        <h2 className={styles.sectionTitle}>Create New Variant</h2>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Select Color <span className={styles.required}>*</span>
                            </label>
                            <div className={styles.colorGrid}>
                                {availableColors.map((color) => (
                                    <div
                                        key={color._id}
                                        className={`${styles.colorOption} ${selectedColor?._id === color._id ? styles.selected : ''
                                            }`}
                                        onClick={() => handleColorSelect(color)}
                                    >
                                        <div
                                            className={styles.colorCircle}
                                            style={{ backgroundColor: color.colorName }}
                                        >
                                            {selectedColor?._id === color._id && (
                                                <MdCheck className={styles.checkIcon} />
                                            )}
                                        </div>

                                        <span className={styles.colorName}>{color.colorName}</span>
                                    </div>
                                ))}
                            </div>

                        </div>

                        <button className={styles.addVariantBtn} onClick={handleAddVariant}>
                            <MdAdd /> Add Color Variant
                        </button>
                    </div>

                    <div className={styles.variantsSection}>
                        <h2 className={styles.sectionTitle}>
                            Added Variants ({variants.length})
                        </h2>

                        {variants.length === 0 ? (
                            <div className={styles.emptyState}>
                                <p>No variants added yet</p>
                                <span>Start by selecting a color and adding details</span>
                            </div>
                        ) : (
                            <div className={styles.variantsList}>
                                {variants.map((variant) => (
                                    <div key={variant.id} className={styles.variantCard}>
                                        <div className={styles.variantColor}>
                                            <div
                                                className={styles.variantColorCircle}
                                                style={{ backgroundColor: variant.color.colorName }}
                                            ></div>
                                            <span className={styles.variantColorName}>{variant.color.colorName}</span>
                                        </div>
                                        <button
                                            className={styles.removeVariantBtn}
                                            onClick={() => removeVariant(variant.id)}
                                        >
                                            <MdClose />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {variants.length > 0 && (
                            <button className={styles.submitBtn} onClick={handleSubmit}>
                                Save All Variants
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddVariants
