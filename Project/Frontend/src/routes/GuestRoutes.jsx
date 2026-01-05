
import { Route, Routes } from 'react-router'
import Login from '../modules/guest/pages/login/Login'
import UserRegistration from '../modules/guest/pages/userRegistration/UserRegistration'
import GuestHome from '../modules/guest/pages/home/GuestHome'
import ShopRegistration from '../modules/guest/pages/shopRegistration/ShopRegistration'
import ForgotPassword from '../modules/guest/pages/forgotpassword/ForgotPassword'
import ResetPassword from '../modules/guest/pages/resetpassword/ResetPassword'
import VerifyOtp from '../modules/guest/pages/verifyotp/VerifyOtp'
import VerifyResetOtp from '../modules/guest/pages/verifyresetotp/VerifyResetOtp'

const GuestRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<GuestHome />} />
        <Route path="/login" element={<Login />}/>
        <Route path="/userreg" element={<UserRegistration />} />
        <Route path="/shopreg" element={<ShopRegistration />}/>
        <Route path="/forgot-password" element={<ForgotPassword />}/>
        <Route path="/reset-password" element={<ResetPassword />}/>
        <Route path="/verify-otp" element={<VerifyOtp />}/>
        <Route path="/verify-reset-otp" element={<VerifyResetOtp />}/>
    </Routes>
  )
}

export default GuestRoutes