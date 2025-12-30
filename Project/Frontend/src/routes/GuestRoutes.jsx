
import { Route, Routes } from 'react-router'
import Login from '../modules/guest/pages/login/Login'
import UserRegistration from '../modules/guest/pages/userRegistration/UserRegistration'
import GuestHome from '../modules/guest/pages/home/GuestHome'
import ShopRegistration from '../modules/guest/pages/shopRegistration/ShopRegistration'
import ForgotPassword from '../modules/guest/pages/forgotpassword/ForgotPassword'
import ResetPassword from '../modules/guest/pages/resetpassword/ResetPassword'

const GuestRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<GuestHome />} />
        <Route path="/login" element={<Login />}/>
        <Route path="/userreg" element={<UserRegistration />} />
        <Route path="/shopreg" element={<ShopRegistration />}/>
        <Route path="/forgot-password" element={<ForgotPassword />}/>
        <Route path="/reset-password/:token" element={<ResetPassword />}/>
        {/* <Route path="/hero" element={<Hero />}/> */}
    </Routes>
  )
}

export default GuestRoutes