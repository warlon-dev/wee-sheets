import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Card } from '../../components';
import './ThankYou.scss';


const ThankYou = () => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/products/active`)
    .then(result => result.json())
    .then(data => {
      if(data) {
        setProducts(data);
      }
    })
  })

  return (
    <div className='app__thankyou section__padding page__margin'>
      <div className='app__thankyou-message'>
          <h1 className='page__title'>Thank you for Purchasing our Product</h1>
          <p className='page__text'>Your template is on the way, please check your email.</p>
          <p className='page__text'>You can also view all your puchased spreadsheets <span ><Link to='/account'>here.</Link></span></p>
      </div>

      <div className='app__thankyou-others'>
        <h2>You may also like</h2>
        <div className='app__thankyou-others_images'>
          {products.map((product,index) => (
            <Card key={product + index} cardProps = {product} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ThankYou