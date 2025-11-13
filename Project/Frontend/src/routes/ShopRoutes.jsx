import { Route, Routes } from "react-router"
import ShopHomepage from "../modules/shop/pages/home/ShopHomepage"
import ProductAdding from "../modules/shop/pages/productAdding/ProductAdding"

const ShopRoutes = () => {
    return (
        <Routes>
            <Route path="/home" element={<ShopHomepage />} />
            <Route path="/product" element={<ProductAdding />} />
        </Routes>
    )
}

export default ShopRoutes