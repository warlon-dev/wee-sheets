import React from 'react'
import { useNavigate } from 'react-router-dom'

import './PageNotFound.scss'
import pageNotFound from '../../assets/404error.webp'

const PageNotFound = () => {
  const navigate = useNavigate();
  return (
    <div className='app__404'>
          <img src={pageNotFound} alt='page not found' />
          <h1>Whoops</h1>
          <h2><span>Wee</span> can't find what you're looking for!</h2>
          <p>Let me get you <span onClick={() => (navigate('/'))}>home</span></p>
    </div>
  )
}

export default PageNotFound