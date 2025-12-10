import styles from "./ShopHomepage.module.css";
import Navbar from "../../components/navbar/Navbar";
import ShopRoutes from "../../../../routes/ShopRoutes";
import ShopHeroBanner from "../../components/shopherobanner/ShopHeroBanner";
import Footer from "../../../user/components/footer/Footer";

const ShopHomepage = () => {
  return (
    <div>
      <Navbar />
      <div className={styles.home_content}>
        <ShopRoutes />
        <ShopHeroBanner />
      </div>
      <Footer />
    </div>
  );
};

export default ShopHomepage;
