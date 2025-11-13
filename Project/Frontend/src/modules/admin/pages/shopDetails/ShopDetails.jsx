import React, { useEffect, useState } from 'react';
import { FaStore, FaEnvelope, FaPhone, FaMapMarkerAlt, FaFileAlt, FaCheckCircle, FaTimesCircle, FaEye, FaImage, FaSpinner } from 'react-icons/fa';
import styles from './ShopDetails.module.css';
import { useParams } from 'react-router';
import axios from 'axios';
import { toast } from 'react-toastify';

const ShopDetails = () => {

    const { id } = useParams();
    const [shop, setShop] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchShopDetails = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/Shop/${id}`);
            if (res.data.shop) {
                setShop(res.data.shop);
                console.log(res.data.shop);
            }
        } catch (err) {
            console.error("Error fetcing shop details", err);
        }
    }



    const handleViewImage = () => {
        window.open(shop.shopImage, '_blank');
    };

    const handleViewProof = () => {
        window.open(shop.shopProof, '_blank');
    };

    useEffect(() => {
        fetchShopDetails();
    }, []);

    const handleVerification = async (status) => {
        try {
            const res = await axios.put(`http://localhost:5000/ShopVerification/${id}`, { status });
            toast.info(res.data.message);
            fetchShopDetails();
        } catch (err) {
            console.error("Error in shop", err);
            toast.error("Something went wrong!");
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div>
            {!shop ? (
                <div className={styles.container}>
                    <div className={styles.loadingCard}>
                        <div className={styles.iconWrapper}>
                            <FaStore className={styles.storeIcon} />
                            <FaSpinner className={styles.spinner} />
                        </div>
                        <h2 className={styles.title}>Loading Shop Details</h2>
                        <p className={styles.subtitle}>Please wait while we fetch the information...</p>
                        <div className={styles.progressBar}>
                            <div className={styles.progressFill}></div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={styles.container}>
                    <div className={styles.header}>
                        <div className={styles.headerLeft}>
                            <FaStore className={styles.headerIcon} />
                            <div>
                                <h1 className={styles.title}>Shop Details</h1>
                                <p className={styles.headerSubtitle}>Review and verify shop information</p>
                            </div>
                        </div>
                        <div className={styles.statusBadge}>
                            <span className={`${styles.badge} ${shop.shopStatus === "verified" ? styles.verified :
                                    shop.shopStatus === 'rejected' ? styles.rejected :
                                        styles.pending
                                }`}>
                                {shop.shopStatus === 'verified' ? 'Verified' :
                                    shop.shopStatus === 'rejected' ? 'Rejected' :
                                        'Pending'}
                            </span>
                        </div>
                    </div>

                    <div className={styles.content}>
                        {/* Information Rows */}
                        <div className={styles.infoSection}>
                            <h2 className={styles.sectionTitle}>Basic Information</h2>

                            <div className={styles.infoRow}>
                                <div className={styles.rowLabel}>
                                    <FaStore className={styles.rowIcon} />
                                    <span>Shop Name</span>
                                </div>
                                <div className={styles.rowValue}>{shop.shopName}</div>
                            </div>

                            <div className={styles.infoRow}>
                                <div className={styles.rowLabel}>
                                    <FaEnvelope className={styles.rowIcon} />
                                    <span>Email Address</span>
                                </div>
                                <div className={styles.rowValue}>{shop.shopEmail}</div>
                            </div>

                            <div className={styles.infoRow}>
                                <div className={styles.rowLabel}>
                                    <FaPhone className={styles.rowIcon} />
                                    <span>Contact Number</span>
                                </div>
                                <div className={styles.rowValue}>{shop.shopContact}</div>
                            </div>
                        </div>

                        <div className={styles.infoSection}>
                            <h2 className={styles.sectionTitle}>Location Details</h2>

                            <div className={styles.infoRow}>
                                <div className={styles.rowLabel}>
                                    <FaMapMarkerAlt className={styles.rowIcon} />
                                    <span>District</span>
                                </div>
                                <div className={styles.rowValue}>{shop.placeId?.districtId?.districtName || "N/A"}</div>
                            </div>

                            <div className={styles.infoRow}>
                                <div className={styles.rowLabel}>
                                    <FaMapMarkerAlt className={styles.rowIcon} />
                                    <span>Place</span>
                                </div>
                                <div className={styles.rowValue}>{shop.placeId?.placeName || "N/A"}</div>
                            </div>

                            <div className={styles.infoRow}>
                                <div className={styles.rowLabel}>
                                    <FaMapMarkerAlt className={styles.rowIcon} />
                                    <span>Complete Address</span>
                                </div>
                                <div className={styles.rowValue}>{shop.shopAddress}</div>
                            </div>
                        </div>

                        <div className={styles.infoSection}>
                            <h2 className={styles.sectionTitle}>Documents & Verification</h2>

                            <div className={styles.infoRow}>
                                <div className={styles.rowLabel}>
                                    <FaImage className={styles.rowIcon} />
                                    <span>Shop Image</span>
                                </div>
                                <div className={styles.rowValue}>
                                    <button className={styles.viewBtn} onClick={handleViewImage}>
                                        <FaEye /> View Image
                                    </button>
                                </div>
                            </div>

                            <div className={styles.infoRow}>
                                <div className={styles.rowLabel}>
                                    <FaFileAlt className={styles.rowIcon} />
                                    <span>Proof Document</span>
                                </div>
                                <div className={styles.rowValue}>
                                    <button className={styles.viewBtn} onClick={handleViewProof}>
                                        <FaEye /> View Document
                                    </button>
                                </div>
                            </div>

                            <div className={styles.infoRow}>
                                <div className={styles.rowLabel}>
                                    <FaFileAlt className={styles.rowIcon} />
                                    <span>PAN Number</span>
                                </div>
                                <div className={styles.rowValue}>{shop.PANNO}</div>
                            </div>

                            <div className={styles.infoRow}>
                                <div className={styles.rowLabel}>
                                    <FaFileAlt className={styles.rowIcon} />
                                    <span>GST Number</span>
                                </div>
                                <div className={styles.rowValue}>{shop.GSTNO}</div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {shop.shopStatus === "pending" && (
                            <div className={styles.actionSection}>
                                <button
                                    className={`${styles.actionBtn} ${styles.rejectBtn}`}
                                    onClick={() => handleVerification("rejected")}
                                    disabled={loading}
                                >
                                    <FaTimesCircle />
                                    {loading ? "Processing..." : "Reject"}
                                </button>
                                <button
                                    className={`${styles.actionBtn} ${styles.verifyBtn}`}
                                    onClick={() => handleVerification("verified")}
                                    disabled={loading}
                                >
                                    <FaCheckCircle />
                                    {loading ? "Processing..." : "Verify"}
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            )}
        </div>
    );
};

export default ShopDetails;