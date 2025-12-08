
import { Route, Routes } from 'react-router'
import Login from '../modules/guest/pages/login/Login'
import UserRegistration from '../modules/guest/pages/userRegistration/UserRegistration'
import GuestHome from '../modules/guest/pages/home/GuestHome'
import ShopRegistration from '../modules/guest/pages/shopRegistration/ShopRegistration'

const GuestRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<GuestHome />} />
        <Route path="/login" element={<Login />}/>
        <Route path="/userreg" element={<UserRegistration />} />
        <Route path="/shopreg" element={<ShopRegistration />}/>
        {/* <Route path="/hero" element={<Hero />}/> */}
    </Routes>
  )
}

export default GuestRoutes