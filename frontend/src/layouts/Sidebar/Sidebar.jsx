import { useContext, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';

import UserContext from '../../UserContext';
import './Sidebar.scss';
import logo from '../../assets/logo.png';


const Sidebar = () => {
  const { unsetUser } = useContext(UserContext);

  const resetOverflow = () => {
    document.body.style.overflowX ='visible';
  }
  useEffect(() => {
    document.body.style.overflowX ='hidden';
  })

  return (
    <div className='app__sidebar'>
      <div className='app__sidebar-content_logo'>
        <img src={logo} alt="logo" />
      </div>
      <div className='app__sidebar-content'>
        <div className='app__sidebar-content_links'>
          <NavLink to = '/admin/'>dashboard</NavLink> 
          <NavLink to = '/admin/products'>products</NavLink> 
          <NavLink to = '/admin/orders'>orders</NavLink> 
          <NavLink to = '/admin/customers'>customers</NavLink> 
        </div>

        <div className='app__sidebar-logout'>
          <Link  to ="/login" onClick={() => {
            resetOverflow()
            unsetUser()
            }}>LOGOUT</Link>
        </div>
      </div>
    </div>
  )
}

export default Sidebar