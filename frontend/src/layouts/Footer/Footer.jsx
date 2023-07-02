import React from 'react'
import { FaFacebookF, FaInstagram, FaTiktok, FaLinkedin } from 'react-icons/fa'

import logo from '../../assets/logo.png'
import { payments } from '../../constants'
import './Footer.scss'

const Footer = () => {
  return (
    <div className='app__footer section__padding'>
      <div className="app__footer-links">

        <div className="app__footer-links_about">
          <p className='headertext__inter'>ABOUT WEE</p>
          <a href="#">About Us</a>
          <a href="#">Contact Us</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Shipping & Delivery</a>
          <a href="#">Refund Policy</a>
          <a href="#">Earn Money with Us</a>
        </div>

        <div className="app__footer-links_payment">
          <p className='headertext__inter'>PAYMENT</p>
          <div className="app__footer-links_icons">{ payments.map((payment, index) => (
            <img src={payment} alt='payment mode' key={index} />
          ))}
          
          </div>
          
        </div>

        <div className="app__footer-links_socials">
          <p className='headertext__inter'>FOLLOW US</p>
          <div>
          <FaFacebookF />
            <a href="https://www.facebook.com/weesheets" target='_blank'>  Facebook</a>
          </div>
          <div>
            <FaInstagram />
            <a href="https://www.facebook.com/weesheets" target='_blank'>Instagram</a>
          </div>
          <div>
            <FaTiktok />
            <a href="https://www.facebook.com/weesheets" target='_blank'>TikTok</a>
          </div>
          <div>
            <FaLinkedin />
            <a href="https://www.facebook.com/weesheets" target='_blank'>LinkedIn</a>
          </div>
        </div>

        <div className="app__footer-links_subscribe">
          <p className='headertext__inter'>GET 15% OFF INSTANTLY WHEN YOU SUBSCRIBE TO OUR LIST</p>
          <form action="">
            <input className='custom__input' type="text" placeholder='Email Address' />
            <button className='custom__button'>SUBSCRIBE</button>
          </form>
        </div>
      </div>
      <div className="app__footer-copyright">
        <div>
          <img src={logo} alt="logo" />
          <p>© 2023 Wee Sheets. All Rights Reserved.</p>
        </div>

        <p>Web design by <a href='https://www.facebook.com/warlonescander/' target='_blank'>Warlon Escander</a>. Built in React with SASS, deployed in Vercel</p>

      </div>
    
      
    </div>
  )
}

export default Footer