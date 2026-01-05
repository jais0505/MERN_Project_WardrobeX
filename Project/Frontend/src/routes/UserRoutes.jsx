import { Route, Routes } from "react-router";
import UserHomePage from "../modules/user/pages/home/UserHomePage";
import ViewProducts from "../modules/user/pages/viewProducts/ViewProducts";
import ProductDetails from "../modules/user/pages/productDetails/ProductDetails";
import UserProfile from "../modules/user/pages/userprofile/UserProfile";
import Wishlist from "../modules/user/pages/wishlist/Wishlist";
import ProfileSettings from "../modules/user/pages/profilesettings/ProfileSettings";
import Cart from "../modules/user/pages/cart/Cart";
import OrderSuccess from "../modules/user/pages/ordersuccess/OrderSuccess";
import MyOrders from "../modules/user/pages/myorders/MyOrders";
import CheckOut from "../modules/user/pages/checkout/CheckOut";
import OrderDetails from "../modules/user/pages/orderdetails/OrderDetails";
import RateProduct from "../modules/user/pages/rateproduct/RateProduct";
import Complaints from "../modules/user/pages/complaints/complaints";
import MyComplaints from "../modules/user/pages/mycomplaints/MyComplaints";
import UserProtected from "../modules/user/components/UserProtected";

const UserRoutes = () => {
  return (
    <Routes>

      <Route
        path="/profile"
        element={
          <UserProtected>
            <UserProfile />
          </UserProtected>
        }
      />
      <Route
        path="/viewproducts"
        element={
          <UserProtected>
            <ViewProducts />
          </UserProtected>
        }
      />
      <Route
        path="/productdetails/:id"
        element={
          <UserProtected>
            <ProductDetails />
          </UserProtected>
        }
      />
      <Route
        path="/wishlist"
        element={
          <UserProtected>
            <Wishlist />
          </UserProtected>
        }
      />
      <Route
        path="/cart"
        element={
          <UserProtected>
            <Cart />
          </UserProtected>
        }
      />
      <Route
        path="/profilesettings"
        element={
          <UserProtected>
            <ProfileSettings />
          </UserProtected>
        }
      />
      <Route
        path="/order-success"
        element={
          <UserProtected>
            <OrderSuccess />
          </UserProtected>
        }
      />
      <Route
        path="/myorders"
        element={
          <UserProtected>
            <MyOrders />
          </UserProtected>
        }
      />
      <Route
        path="/order-details/:orderId"
        element={
          <UserProtected>
            <OrderDetails />
          </UserProtected>
        }
      />
      <Route
        path="/checkout"
        element={
          <UserProtected>
            <CheckOut />
          </UserProtected>
        }
      />
      <Route
        path="/rate&review/:orderItemId"
        element={
          <UserProtected>
            <RateProduct />
          </UserProtected>
        }
      />
      <Route
        path="/complaints/new"
        element={
          <UserProtected>
            <Complaints />
          </UserProtected>
        }
      />
      
      <Route
        path="/mycomplaints"
        element={
          <UserProtected>
            <MyComplaints />
          </UserProtected>
        }
      />
    </Routes>
  );
};

export default UserRoutes;
