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
import ShopOrders from "../modules/shop/pages/shoporders/ShopOrders"
import OrderDetails from "../modules/shop/pages/orderdetails/OrderDetails"
import ShopProtected from "../modules/shop/components/ShopProtected"


const ShopRoutes = () => {
    return (
        <Routes>
            <Route path="/home" element={
                <ShopProtected>
                    <ShopHomepage />
                </ShopProtected>
              }
            />
                
            <Route path="/profile" element={
                <ShopProtected>
                    <ShopProfile />
                </ShopProtected>
            } />

            <Route path="/product" element={
                <ShopProtected>
                    <ProductAdding />
                </ShopProtected>
            } />

            <Route path="/viewproducts" element={
                <ShopProtected>
                    <ViewProducts />
                </ShopProtected>
            } />

            <Route path="/productdetails/:id" element={
                <ShopProtected>
                    <ProductDetails />
                </ShopProtected>
            } />
            <Route path="/addvariant/:id" element={
                <ShopProtected>
                    <AddVariants />
                </ShopProtected>
            } />

            <Route path="/viewvariants/:id" element={
                <ShopProtected>
                    <ViewVariants />
                </ShopProtected>
            } />
            
            <Route path="/addsizeandimage/:id" element={
                <ShopProtected>
                    <AddSizeAndImage />
                </ShopProtected>
            } />

            <Route path="/addstock/:id" element={
                <ShopProtected>
                    <ManageStock />
                </ShopProtected>
            } />
            <Route path="/orders" element={
                <ShopProtected>
                    <ShopOrders />
                </ShopProtected>
            } />
            <Route path="/order-details/:orderItemId" element={
                <ShopProtected>
                    <OrderDetails/>
                </ShopProtected>
            } />
        </Routes>
    )
}

export default ShopRoutes