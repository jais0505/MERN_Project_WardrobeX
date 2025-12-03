import styles from "./ShopHomepage.module.css";
import Navbar from "../../components/navbar/Navbar";
import ShopRoutes from "../../../../routes/ShopRoutes";
import ShopHeroBanner from "../../components/shopherobanner/ShopHeroBanner";

const ShopHomepage = () => {
  return (
    <div>
      <Navbar />
      <div className={styles.home_content}>
        <ShopRoutes />
        <ShopHeroBanner />
      </div>
    </div>
  );
};

export default ShopHomepage;
