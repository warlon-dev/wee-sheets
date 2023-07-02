import { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { 
    Home, Login, Signup, Templates, Bundles, ProductInfo, Cart,
    Checkout,  ThankYou, Account, PageNotFound, Contact
  } from '../pages'
import { MainLayout } from '../layouts'
import { Loader } from '../components'
  
const MainRoutes = () => {
  const [activeMenu, setActiveMenu] = useState('home')

  const location = useLocation();
  useEffect(() => {
    let menu = location.pathname.substring(1);
    if (menu===""){
      menu ='home'
    }
    setActiveMenu(menu)
  },[location])

  return (
    <>  
        <Routes >
           <Route element ={<MainLayout activeMenu={activeMenu} />} >
              <Route index element = {<Home />} />
              <Route path ='signup' element ={<Signup />} />
              <Route path ='login' element ={<Login /> } />
              <Route path ='templates' element ={<Templates />} />
              <Route path ='bundles' element ={<Bundles />} />
              <Route path ='templates/:templateID' element ={<ProductInfo />} />
              <Route path ='bundles/:bundleID' element ={<ProductInfo />} />
              <Route path ='cart' element ={<Cart />} />
              <Route path ='account' element ={<Account />} />
              <Route path ='thank-you' element ={<ThankYou />} />
              <Route path ='contact' element ={<Contact />} />
           </Route>
           <Route path="*" element={<PageNotFound />} />
           <Route path ='checkout' element ={<Checkout />} />
           <Route path ='authenticating/*' element ={<Loader title='Welcome' text='Please wait a moment while we load your account' path='/templates' />} />
        </Routes>
    </>
  )
}

export default MainRoutes