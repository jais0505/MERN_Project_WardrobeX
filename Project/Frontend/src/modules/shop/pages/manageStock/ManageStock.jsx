import { useEffect, useState } from 'react'
import styles from './ManageStock.module.css'
import { MdArrowBack, MdEdit, MdSave, MdClose } from 'react-icons/md'
import { useNavigate, useParams } from 'react-router'
import axios from 'axios'
import { toast } from 'react-toastify'

const ManageStock = () => {
    const navigate = useNavigate()
    const { id } = useParams();
    const [variants, setVariants] = useState([]);
    const [variantSizes, setVariantSizes] = useState({});


    const [editingItem, setEditingItem] = useState(null)
    const [editStock, setEditStock] = useState('')
    const [editDescription, setEditDescription] = useState('')
    const [expandedVariant, setExpandedVariant] = useState(null)

    const fetchProductVariants = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/Variant/Product/${id}`);
            if (res.data.variants) {
                setVariants(res.data.variants);
                console.log(res.data.variants);
            }
        } catch (err) {
            console.error("Error fetching product variants", err);
        }
    }

    const fetchVariantSizes = async (variantId) => {
        try {
            const res = await axios.get(`http://localhost:5000/VariantSize/variant/${variantId}/withStock`);
            return res.data.sizes || [];
        } catch (err) {
            console.error("Error fetching variant sizes", err);
            return [];
        }
    };


    useEffect(() => {
        fetchProductVariants();
    }, []);

    useEffect(() => {
        const loadSizes = async () => {
            const sizeMap = {};

            for (const variant of variants) {
                sizeMap[variant._id] = await fetchVariantSizes(variant._id);
            }

            setVariantSizes(sizeMap);
        };

        if (variants.length > 0) {
            loadSizes();
        }
    }, [variants]);

    const handleEdit = (variantId, sizeId, currentStock, currentDescription) => {
        setEditingItem({ variantId, sizeId });
        setEditStock((currentStock ?? 0).toString());
        setEditDescription(currentDescription ?? "");
    }

    const handleSave = async (variantId, sizeId) => {
        console.log('Saving stock:', {
            variantId,
            sizeId,
            stock: parseInt(editStock),
            description: editDescription
        });

        try {
            const payload = {
                variantSizeId: sizeId,
                stockQuantity: parseInt(editStock),
                stockDescription: editDescription,
            };

            const res = await axios.post("http://localhost:5000/Stock", payload);

            if (res.data.stock) {
                console.log(res.data.stock);
                toast.success(res.data.message);
            }

            setVariantSizes((prev) => ({
                ...prev,
                [variantId]: prev[variantId].map((item) =>
                    item._id === sizeId
                        ? {
                            ...item,
                            currentStock: payload.stockQuantity,
                            description: payload.stockDescription
                        }
                        : item
                )
            }));
        } catch (err) {
            console.error("Error addting stock", err);
            toast.error("Failed to add stock");
        }

        setEditingItem(null);
        setEditStock('');
        setEditDescription('');
    }

    const handleCancel = () => {
        setEditingItem(null)
        setEditStock('')
        setEditDescription('')
    }

    const toggleVariant = (variantId) => {
        setExpandedVariant(expandedVariant === variantId ? null : variantId)
    }

    const getStockStatus = (stock) => {
        if (stock === 0 || stock === null) return 'outOfStock'
        if (stock < 10) return 'lowStock'
        if (stock < 30) return 'mediumStock'
        return 'highStock'
    }

    return (
        <div className={styles.container}>
            {/* Back Button */}
            <button className={styles.backBtn} onClick={() => navigate(-1)}>
                <MdArrowBack /> Back to Products
            </button>

            <div className={styles.content}>
                {variants.length > 0 && variants[0].productId && (
                    <div className={styles.productHeader}>
                        <img src={`http://127.0.0.1:5000/images/${variants[0].productId?.productImage}`} alt={variants[0].productId?.productName} className={styles.productImage} />
                        <div>
                            <h1 className={styles.pageTitle}>Manage Stock</h1>
                            <p className={styles.productName}>{variants[0].productId?.productName}</p>
                            <p className={styles.variantCount}>{variants.length} Color Variants</p>
                        </div>
                    </div>
                )}

                {/* Variants List */}
                <div className={styles.variantsList}>
                    {variants.map((variant) => (
                        <div key={variant._id} className={styles.variantSection}>
                            {/* Variant Header */}
                            <div
                                className={styles.variantHeader}
                                onClick={() => toggleVariant(variant._id)}
                            >
                                <div className={styles.variantInfo}>
                                    <div
                                        className={styles.colorCircle}
                                        style={{ backgroundColor: variant.colorId?.colorName }}
                                    ></div>
                                    <div>
                                        <h3 className={styles.variantName}>{variant.colorId?.colorName}</h3>
                                        {/* <p className={styles.sizesCount}>{variant.variantSizes.length} sizes available</p> */}
                                    </div>
                                </div>
                                <span className={styles.expandIcon}>
                                    {expandedVariant === variant.id ? '−' : '+'}
                                </span>
                            </div>

                            {/* Sizes Table */}
                            {expandedVariant === variant._id && (
                                <div className={styles.sizesTable}>
                                    <table className={styles.table}>
                                        <thead>
                                            <tr>
                                                <th>Size</th>
                                                <th>Current Stock</th>
                                                <th>Description</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {variantSizes[variant._id].map((sizeItem) => (
                                                <tr key={sizeItem._id}>
                                                    <td>
                                                        <span className={styles.sizeBadge}>{sizeItem.sizeId?.sizeName}</span>
                                                    </td>
                                                    <td>
                                                        {editingItem?.variantId === variant._id && editingItem?.sizeId === sizeItem._id ? (
                                                            <input
                                                                type="number"
                                                                value={editStock}
                                                                onChange={(e) => setEditStock(e.target.value)}
                                                                className={styles.stockInput}
                                                                min="0"
                                                            />
                                                        ) : (
                                                            <span className={`${styles.stockValue} ${styles[getStockStatus(sizeItem.currentStock)]}`}>
                                                                {sizeItem.currentStock ?? 0} units
                                                            </span>
                                                        )}
                                                    </td>

                                                    <td>
                                                        {editingItem?.variantId === variant._id && editingItem?.sizeId === sizeItem._id ? (
                                                            <textarea
                                                                value={editDescription}
                                                                onChange={(e) => setEditDescription(e.target.value)}
                                                                className={styles.descriptionInput}
                                                                rows="2"
                                                                placeholder="Enter description"
                                                            />
                                                        ) : (
                                                            <span className={styles.description}>{sizeItem.description ?? ""}</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {editingItem?.variantId === variant._id && editingItem?.sizeId === sizeItem._id ? (
                                                            <div className={styles.actionButtons}>
                                                                <button
                                                                    className={styles.saveBtn}
                                                                    onClick={() => handleSave(variant._id, sizeItem._id)}
                                                                >
                                                                    <MdSave /> Save
                                                                </button>
                                                                <button
                                                                    className={styles.cancelBtn}
                                                                    onClick={handleCancel}
                                                                >
                                                                    <MdClose /> Cancel
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                className={styles.editBtn}
                                                                onClick={() => handleEdit(variant._id, sizeItem._id, sizeItem.currentStock, sizeItem.description)}
                                                            >
                                                                <MdEdit /> Edit
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ManageStock