import React from 'react'
import Navbar from './Navbar/Navbar'
import Footer from './Footer/Footer'
import { Outlet } from 'react-router-dom'

const MainLayout = ({ activeMenu }) => {
  return (
    <>
        <Navbar activeMenu = {activeMenu} />
        <Outlet />
        <Footer />
    </>
  )
}

export default MainLayout