import React from 'react'
import { useNavigate } from 'react-router-dom'

import './Hero.scss'
import heroImg from '../../assets/hero-login.png'

const Hero = () => {
  const navigate = useNavigate()

  return (
    <div className='app__hero section__padding page__margin'>
      <div className='app__hero-content'>
        <div className='app__hero-content_banner'>
          <h4 >Achieve your personal and financial goals</h4>
        </div>
        <h1 ><span>Wee</span>’ll make it happen.</h1>
        <p>Take control of your personal development with our easy-to-use templates.</p>
        <p>Premium Tools for everyone!</p>
        <button className='custom__button' onClick={() => (navigate('/templates'))}>Get the Hot Deals Today</button>
      </div>

      <div className='app__hero-image'>
        <img src={heroImg} alt="" />
      </div>
      
    </div>
  )
}

export default Hero