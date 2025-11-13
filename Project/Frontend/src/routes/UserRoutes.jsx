import { Route, Routes } from 'react-router'
import UserHomePage from '../modules/user/pages/home/UserHomePage'

const UserRoutes = () => {
  return (
    <Routes>
        <Route path="/home" element={<UserHomePage />} />
    </Routes>
  )
}

export default UserRoutes