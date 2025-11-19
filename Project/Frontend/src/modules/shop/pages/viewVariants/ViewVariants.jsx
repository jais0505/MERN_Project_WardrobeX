import { useEffect, useState } from "react";
import styles from "./ViewVariants.module.css";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { MdArrowBack } from "react-icons/md";

const ViewVariants = () => {
    const { id } = useParams();
    const [variants, setVariants] = useState([]);
    const navigate = useNavigate();

    const fetchVarinats = async () => {
        try {
            const res = await axios.get('http://localhost:5000/Variant');
            if (res.data.variant) {
                setVariants(res.data.variant);
                console.log(res.data.variant);
            }
        } catch (err) {
            console.error("Error fetching variants", err);
        }
    }
    const filteredVariants = variants.filter(
        variant => variant.productId === id
    );


    useEffect(() => {
        fetchVarinats();
    }, []);
    return (
        <div className={styles.container}>
            <button className={styles.backBtn} onClick={() => navigate(-1)}>
                <MdArrowBack /> Back to Products
            </button>
            <h2 className={styles.title}>Product Variants</h2>

            <div className={styles.list}>
                {filteredVariants.length === 0 ? (
                    <p className={styles.noData}>No variants found</p>
                ) : (
                    filteredVariants.map((variant, index) => (
                        <div key={variant._id} className={styles.card}>
                            <div
                                className={styles.colorBox}
                                style={{ background: variant.colorId?.colorName?.toLowerCase() }}
                            ></div>

                            <div className={styles.info}>
                                <p className={styles.colorName}>{variant.colorId?.colorName}</p>
                                <p className={styles.index}>Variant #{index + 1}</p>
                            </div>

                            <button className={styles.manageBtn} onClick={() => navigate(`/shop/addsizeandimage/${variant._id}`)}>
                                Add Sizes & Images
                            </button>
                        </div>
                    ))
                )}

            </div>
        </div>
    );
};

export default ViewVariants;
