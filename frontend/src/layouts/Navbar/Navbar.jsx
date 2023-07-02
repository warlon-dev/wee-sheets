import React, { useState, useContext } from 'react'
import { GiHamburgerMenu, GiNinjaStar, GiShoppingCart } from 'react-icons/gi'
import { NavLink, Link } from 'react-router-dom'

import UserContext from '../../UserContext.js'
import logo from '../../assets/logo.png'
import './Navbar.scss'
import { ProfilePhoto } from '../../components/index.js'


const Navbar = ({ activeMenu }) => {
  const [toggleMenu, setToggleMenu] = useState(false)
  const { user, unsetUser } = useContext(UserContext)
  const logout = () => {
    unsetUser()
  }


  return (
    <div className='app__navbar nav__padding'>
        <div className="app__navbar-logo">
          <Link to='/'><img  src={logo} alt="logo" /></Link>
        </div>

        <ul className='app__navbar-links'>
          <li><NavLink className={activeMenu==='home' && 'active__link'} to="/">Home</NavLink></li>
          <li><NavLink className={activeMenu==='templates' && 'active__link'} to="/templates">Templates</NavLink></li>
          <li><NavLink className={activeMenu==='bundles' && 'active__link'} to="/bundles">Bundles</NavLink></li>
          <li><NavLink className={activeMenu==='contact' && 'active__link'} to="/contact" >Support</NavLink></li>
        </ul>
        <div className='app__navbar-sign'> 
          {user.id 
            ? <>
                <NavLink className={activeMenu==='account' && 'active__link'} to="/account">
                  <div id='user__profile'>
                    <ProfilePhoto name={user.name} imgUrl={user.profileUrl} size={30} />
                    Account
                  </div>
                </NavLink>
                <NavLink className={activeMenu==='login' && 'active__link'} to ="/login" onClick={logout} >Log Out</NavLink>
              </>
            : <>
                <NavLink className={activeMenu==='login' && 'active__link'} to="/login">Log In</NavLink>
                <NavLink className={activeMenu==='signup' && 'active__link'} to="/signup">Sign up</NavLink>
              </>
          }
           <NavLink to="/cart"><GiShoppingCart className={activeMenu==='cart' && 'active__link'} /></NavLink>
        </div>



        <div className='app__navbar-smallscreen'>
          <GiHamburgerMenu fontSize={27} onClick={() => {setToggleMenu(true)}}/>
          { toggleMenu && (
             <div className="app__navbar-smallscreen_sidebar slide-left">
              <GiNinjaStar  fontSize={27} onClick={() => {setToggleMenu(false)}} />
              <ul className='app__navbar-smallscreen_links'>
                <li><NavLink className={activeMenu==='home' && 'active__link'} to="/" >Home</NavLink></li>
                <li><NavLink className={activeMenu==='templates' && 'active__link'} to="/templates">Templates</NavLink></li>
                <li><NavLink className={activeMenu==='bundles' && 'active__link'} to="/bundles">Bundles</NavLink></li>
                <li><NavLink className={activeMenu==='contact' && 'active__link'} to="/contact">Support</NavLink></li>
              </ul>
              <div className='app__navbar-smallscreen_sign'>
                {user.id 
                  ? <>
                      <NavLink className={activeMenu==='login' && 'active__link'} to="/logout" onClick={logout} >Log Out</NavLink>
                      <NavLink className={activeMenu==='account' && 'active__link'} to="/account" >
                        Account
                      </NavLink>
                    </>
                  : <>
                      <NavLink className={activeMenu==='login' && 'active__link'} to="/login">Log In</NavLink>
                      <NavLink className={activeMenu==='signup' && 'active__link'} to="/signup">Sign up</NavLink>
                      <GiShoppingCart />
                   </>
                }
                </div>
             </div>
          )}
        </div>

    </div>
  )
}

export default Navbar