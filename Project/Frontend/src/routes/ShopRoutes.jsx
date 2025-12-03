import { Route, Routes } from "react-router"
import ShopHomepage from "../modules/shop/pages/home/ShopHomepage"
import ProductAdding from "../modules/shop/pages/productAdding/ProductAdding"
import ViewProducts from "../modules/shop/pages/viewProducts/ViewProducts"
import AddVariants from "../modules/shop/pages/addVariants/AddVariants"
import ProductDetails from "../modules/shop/pages/productDetails/ProductDetails"
import ViewVariants from "../modules/shop/pages/viewVariants/ViewVariants"
import AddSizeAndImage from "../modules/shop/pages/addSizeAndImage/AddSizeAndImage"
import ManageStock from "../modules/shop/pages/manageStock/ManageStock"
import ShopProfile from "../modules/shop/pages/shopprofile/ShopProfile"


const ShopRoutes = () => {
    return (
        <Routes>
            <Route path="/home" element={<ShopHomepage />} />
            <Route path="/profile" element={<ShopProfile />} />
            <Route path="/product" element={<ProductAdding />} />
            <Route path="/viewproducts" element={<ViewProducts />} />
            <Route path="/productdetails/:id" element={<ProductDetails />} />
            <Route path="/addvariant/:id" element={<AddVariants />} />
            <Route path="/viewvariants/:id" element={<ViewVariants />} />
            <Route path="/addsizeandimage/:id" element={<AddSizeAndImage />} />
            <Route path="/addstock/:id" element={<ManageStock />} />
        </Routes>
    )
}

export default ShopRoutes