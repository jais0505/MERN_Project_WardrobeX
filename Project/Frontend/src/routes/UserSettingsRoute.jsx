import React from 'react'
import { Route, Routes } from 'react-router'
import UserProfile from '../modules/user/pages/userprofile/UserProfile'

const UserSettingsRoute = () => {
  return (
     <Routes>
        <Route path="/" element={<UserProfile />} />
    </Routes> 
  )
}

export default UserSettingsRoute