import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './Card.scss';
import defaultImg from '../../assets/default.jpg'

const Card = ({onClick, onAddToCart, ...props}) => {
  
  const { _id, name, imgFiles, description, price } = props.cardProps
  let navigate = useNavigate();
  let oldPrice = price * 2;

  return (
    <div className='card__container' onClick={() => navigate(`/templates/${_id}`)}>

      <div className='card__content'>
        <div className='card__image'>
          {imgFiles.length > 0 
            ? <img src={imgFiles[0]?.imageDataUri} alt={name} />
            : <img src={defaultImg} alt={name} />
          }
        </div>

        <div className='card__body'> 
          <h1>{name}</h1>
          <p>{description}</p>
          <div>
            <h2>{price.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'PHP'
                    })}</h2>
            <h3>{oldPrice.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'PHP'
                    })}</h3>
          </div>
        </div>
      </div>

      <div className='card__button'>
        <Link to={`/templates/${_id}`} className='custom__button'>ADD TO CART</Link>
      </div>

    </div>
  )
}

export default Card