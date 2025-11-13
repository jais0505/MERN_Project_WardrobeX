import React from 'react'
import { Navigate, Route, Routes } from 'react-router'
import GuestRoutes from './GuestRoutes'
import Dashboard from '../modules/admin/pages/dashboard/Dashboard'
import UserRoutes from './UserRoutes'
import ShopRoutes from './ShopRoutes'

const AppRoutes = () => {
  return (
    <Routes>
        <Route path="admin/*" element={<Dashboard />} />
        <Route path="user/*" element={< UserRoutes/>} />
        <Route path="shop/*" element={< ShopRoutes/>} />
        <Route path="/*" element={<GuestRoutes />} />
    </Routes>
  )
} 

export default AppRoutes