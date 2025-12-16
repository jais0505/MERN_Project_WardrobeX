import React from 'react'
import { Route, Routes } from 'react-router'
import UserProfile from '../modules/user/pages/userprofile/UserProfile'
import Wishlist from '../modules/user/pages/wishlist/Wishlist'

const UserSettingsRoute = () => {
  return (
     <Routes>
        <Route path="/" element={<UserProfile />} />
        <Route path="/wishlist" element={<Wishlist />} />
    </Routes> 
  )
}

export default UserSettingsRoute