import { Route, Routes } from 'react-router'
import Category from '../modules/admin/pages/category/Category'
import Subcategory from '../modules/admin/pages/subcategory/Subcategory'
import Brand from '../modules/admin/pages/brand/Brand'
import User from '../modules/admin/pages/user/User'
import Shop from '../modules/admin/pages/shop/Shop'
import Type from '../modules/admin/pages/type/Type'
import Size from '../modules/admin/pages/size/Size'
import Fit from '../modules/admin/pages/fit/Fit'
import Color from '../modules/admin/pages/color/Color'
import DashboardHero from '../modules/admin/components/dashboardhero/DashboardHero'
import District from '../modules/admin/pages/district/District'
import Place from '../modules/admin/pages/place/Place'
import ShopDetails from '../modules/admin/pages/shopDetails/ShopDetails'
import Refunds from '../modules/admin/pages/refunds/Refunds'
import AdminComplaints from '../modules/admin/pages/admincomplaints/AdminComplaints'
import AdminProtected from '../modules/admin/components/AdminProtected'
import AdminProfile from '../modules/admin/pages/adminprofile/AdminProfile'
import AdminEditProfile from '../modules/admin/pages/admineditprofile/AdminEditProfile'
import AdminChangePassword from '../modules/admin/pages/adminchangepassword/AdminChangePassword'

const AdminRoutes = () => (
  <Routes>
    <Route index element={
      <AdminProtected>
        <DashboardHero /> 
      </AdminProtected>
    } /> 

    <Route path="/district" element={
      <AdminProtected>
        <District />
      </AdminProtected>
    } />

    <Route path="/place" element={
      <AdminProtected>
        <Place />
      </AdminProtected>
    } />

    <Route path="/category" element={
      <AdminProtected>
        <Category />
      </AdminProtected>
    } />

    <Route path="/subcategory" element={
      <AdminProtected>
        <Subcategory />
      </AdminProtected>
    } />

    <Route path="/brand" element={
      <AdminProtected>
        <Brand />
      </AdminProtected>
    } />
    <Route path="/type" element={
      <AdminProtected>
        <Type />
      </AdminProtected>
    } />

    <Route path="/size" element={
      <AdminProtected>
        <Size />
      </AdminProtected>
    } />

    <Route path="/fit" element={
      <AdminProtected>
        <Fit />
      </AdminProtected>
    } />

    <Route path="/color" element={
      <AdminProtected>
        <Color />
      </AdminProtected>
    } />

    <Route path="/user" element={
      <AdminProtected>
        <User />
      </AdminProtected>
    } />

    <Route path="/shop" element={
      <AdminProtected>
        <Shop />
      </AdminProtected>
    } />

    <Route path="/shop/:id" element={
      <AdminProtected>
        <ShopDetails />
      </AdminProtected>
    } />

    <Route path="/complaint" element={
      <AdminProtected>
        <AdminComplaints />
      </AdminProtected>
    } />

    <Route path="/refunds" element={
      <AdminProtected>
        <Refunds />
      </AdminProtected>
    } />

     <Route path="/profile" element={
      <AdminProtected>
        <AdminProfile />
      </AdminProtected>
    } />

    <Route path="/editprofile" element={
      <AdminProtected>
        <AdminEditProfile />
      </AdminProtected>
    } />

    <Route path="/changepassword" element={
      <AdminProtected>
        <AdminChangePassword />
      </AdminProtected>
    } />
  </Routes>
)

export default AdminRoutes