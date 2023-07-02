import React from 'react'
import { Outlet } from 'react-router-dom'

import Sidebar from './Sidebar/Sidebar'

const AdminLayout = () => {
  return (
    <div style={{display:'flex', overflow:'hidden'}}>
        <Sidebar />
        <div className='app__content' style={{width:'100%'}}>
          <Outlet />
        </div>
    </div>
  )
}

export default AdminLayout