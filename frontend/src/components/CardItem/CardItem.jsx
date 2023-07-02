import React from 'react'

import './CardItem.scss'
import defaultImg from '../../assets/default.jpg'

const CardItem = (props) => {
    const { name, description, imgUrl } = props.itemProps

  return (
    <div className='cardItem__container'>
        <div className='cardItem__container-img'>
            {imgUrl
            ?   <img src={imgUrl} alt={name}/>
            :   <img src={defaultImg} alt={name}/>
            }
        </div>
        <div className='cardItem__container-content'>
            <h1>{name}</h1>
            <p>{description}</p>
        </div>
    </div>
  )
}

export default CardItem