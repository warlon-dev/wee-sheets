import React from 'react'
import { Link } from 'react-router-dom'

import './Bundle.scss'
import defaultImg from '../../assets/default.jpg'

const Bundle = ({onAdd,...props}) => {
  const { _id, name, description, price, imgFiles } = props.bundleProps;
  console.log(props.bundleProps)
  return (
    <div className='app__bundle'>
      <div className='app__bundle-images'>
        {imgFiles.length === 0
          ? <img src={defaultImg} alt={name} />
          : <img src={imgFiles[0]?.imageDataUri} alt={name} />
        }
        <div>
          {imgFiles.map((imgUrl) => {
            <img src={imgUrl?.imageDataUri} alt={name} />
            })
          }
        </div>
      </div>
      <div className='app__bundle-content'>
        <div className='app__bundle-content_info'>
          <h1>{name}</h1>
          <p>{description}</p>
          <div>
            <h2>{price}</h2>
            <h3>{price*2}</h3>
          </div>
        </div>

        <div className='card__button'>
        <Link to={`/templates/${_id}`} className='custom__button'>ADD TO CART</Link>
      </div>
      </div>
    </div>
  )
}

export default Bundle