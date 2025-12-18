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

const AdminRoutes = () => (
  <Routes>
    <Route index element={<DashboardHero />} /> 
    <Route path="/district" element={<District />} />
    <Route path="/place" element={<Place />} />
    <Route path="/category" element={<Category />} />
    <Route path="/subcategory" element={<Subcategory />} />
    <Route path="/brand" element={<Brand />} />
    <Route path="/type" element={<Type />} />
    <Route path="/size" element={<Size />} />
    <Route path="/fit" element={<Fit />} />
    <Route path="/color" element={<Color />} />
    <Route path="/user" element={<User />} />
    <Route path="/shop" element={<Shop />} />
    <Route path="/shop/:id" element={<ShopDetails />} />
    <Route path="/complaint" element={<AdminComplaints />} />
    <Route path="/refunds" element={<Refunds />} />
  </Routes>
)

export default AdminRoutes