import { Routes, Route } from 'react-router-dom'

import { Dashboard, Products, Orders, Customers, PageNotFound } from '../pages'
import { AdminLayout } from '../layouts'
  
const AdminRoutes = () => {
  return (
    <>  
        <Routes >
          <Route path='/' element ={<AdminLayout/>}>
            <Route index element ={<Dashboard />} />
            <Route path ='products' element ={<Products />} />
            <Route path ='orders' element ={<Orders />} />
            <Route path ='customers' element ={<Customers />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
    </>
  )
}

export default AdminRoutes