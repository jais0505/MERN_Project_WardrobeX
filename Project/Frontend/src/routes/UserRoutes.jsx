import { Route, Routes } from 'react-router'
import UserHomePage from '../modules/user/pages/home/UserHomePage'
import ViewProducts from '../modules/user/pages/viewProducts/ViewProducts'
import ProductDetails from '../modules/user/pages/productDetails/ProductDetails'
import UserProfile from '../modules/user/pages/userprofile/UserProfile'
import Wishlist from '../modules/user/pages/wishlist/Wishlist'
import ProfileSettings from '../modules/user/pages/profilesettings/ProfileSettings'
import Cart from '../modules/user/pages/cart/Cart'
import OrderSuccess from '../modules/user/pages/ordersuccess/OrderSuccess'
import MyOrders from '../modules/user/pages/myorders/MyOrders'

const UserRoutes = () => {
  return (
    <Routes>
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/viewproducts" element={<ViewProducts />} />
        <Route path="/productdetails/:id" element={<ProductDetails />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profilesettings" element={<ProfileSettings />} />
        <Route path="/order-success" element={<OrderSuccess />}/>
        <Route path="/myorders" element={<MyOrders />}/>
    </Routes> 
  )
}

export default UserRoutes