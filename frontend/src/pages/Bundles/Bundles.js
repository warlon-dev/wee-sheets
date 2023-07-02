import  { useState, useEffect } from 'react'

import { Bundle } from '../../components'
import './Bundles.scss'
import imgBanner from '../../assets/templates-banner.png'

const Bundles = () => {
  const [bundles, setBundles] = useState([]);
  
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/products/bundles/active`)
    .then(results => results.json())
    .then(data => {
      if(data) {
        setBundles(data)
      }
    }) 
  })
  const viewDetails = () => {

  }

  return (
    <div className='app__bundles section__padding '>
      <div className='app__bundles-banner'>
        <img src={imgBanner} alt='banner' />
      </div>

      <div className='app__bundles-list'>
        {bundles.map((bundle,index) => (
          <Bundle key={bundle + index} bundleProps ={bundle} onAdd = {() => (viewDetails)} />
          ))}
      </div>
    </div>
  )
}

export default Bundles