import styles from "./ProductAdding.module.css";

const ProductAdding = () => {
    return (
        <div className={styles.container}>
            <div className={styles.formBox}>
                <h2 className={styles.heading}>Add Product</h2>

                <form className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>Product Name</label>
                        <input type="text" placeholder="Enter product name" />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Product Description</label>
                        <textarea placeholder="Enter description" rows="3"></textarea>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Category</label>
                            <select>
                                <option>-- Select Category --</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Subcategory</label>
                            <select>
                                <option>-- Select Subcategory --</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Fitting</label>
                            <select>
                                <option>-- Select Fitting --</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Material</label>
                            <select>
                                <option>-- Select Material --</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Brand</label>
                            <select>
                                <option>-- Select Brand --</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Product Images</label>
                        <input type="file" multiple />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Product Price</label>
                        <input type="text" placeholder="Enter product price" />
                    </div>


                    <div className={styles.submitContainer}>
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
