import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';

import { Loader } from '../../components';
import img1 from '../../assets/product-1.png';
import paypal from '../../assets/payment-paypal.png';
import grab from '../../assets/payment-grabpay.png';
import gcash from '../../assets/payment-gcash.png';
import './Checkout.scss';


const Item = (props) => {
  const { name, image, subtotal } = props.itemProps
  return (
    <div className='app__item'>
    <div>
      <img src = {img1} alt={name} />
      <h2>{name}</h2>
    </div>
    <h1>{subtotal.toLocaleString('en-US', {style: 'currency', currency: 'PHP'})}</h1>
  </div>
  )
}


const Checkout = (props) => {
  const location = useLocation()
  const [totalAmount, setTotalAmount] = useState(0)
  const [showLoader, setShowLoader] = useState(false)

  useEffect(() => {
    const total = location.state.reduce((acc,current) => {
     return acc + current.subtotal
    }, 0)
    setTotalAmount(total)

  },[location])

  const processPayment = () => {
    console.log(location.state)
    fetch(`${process.env.REACT_APP_API_URL}/orders/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }, 
      body: JSON.stringify({
        products: location.state
      })
    }).then(results => results.json())
    .then(data => {
      if(data){
        setShowLoader(true)
      } else {
        swal({
          title:'Something went wrong',
          text: 'Please try again later',
          icon: 'error'
        })
      }
    })
  }

  return (
    <div className='app__checkout'>
      {showLoader && <Loader path='/thank-you' title="Wee'll Done!" text='Please wait a moment while we process your payment.' />}
      <div className='app__checkout-banner'>
        <img src={img1} alt = 'banner'/>
      </div>
      
      <div className='app__checkout-content '>
        <div className='app__checkout-content_payment'>
          <div className='app__payment-express'>
            <h2>Express checkout</h2>

            <div className='app__payment-express_buttons'>
              <button><img src={paypal} alt='paypal'/></button>
              <button><img src={gcash} alt='gcash'/></button>
              <button><img src={grab} alt='grab'/></button>
            </div>

            <div className='form__divider'>
              <div />
              <p className='page__subtext'>OR</p>
              <div />
            </div>
          </div>

          <div className='app__payment-form'>
            <div className='app__payment-form_contact'>
              <h1 className='page__text'>Contact</h1>
              <input className='custom__input' type='email' placeholder='Email'/>
              <div className='form__checkbox'>
                <input type='checkbox' id="correctEmail" />
                <label htmlFor='correctEmail'>Yes, I confirm this is the correct email to receive my templates.</label>
              </div>
            </div>

            <div className='app__payment-form_billing'>
              <h1 className='page__text'>Billing Address</h1>
              <input className='custom__input' type='text' placeholder='Country/Region'/>
              <div>
                <input className='custom__input' type='text' placeholder='First name'/>
                <input className='custom__input' type='text' placeholder='Last name'/>
              </div>
              <input className='custom__input' type='text' placeholder='Address'/>
              <div>
                <input className='custom__input' type='text' placeholder='Postal code'/>
                <input className='custom__input' type='text' placeholder='City'/>
              </div>
              <input className='custom__input' type='text' placeholder='Region'/>
              <div className='form__checkbox'>
                <input type='checkbox' />
                <label>Yes, I will leave my Phone Number for FREE Updates Notifications and Exclusive Offers (Optional).</label>
              </div>
            </div>

            <div className='app__payment-form_buttons'>
              <Link className='page__text' to ='/cart'>Return to cart</Link>
              <button className='custom__button' onClick={processPayment}>Continue to payment</button>
            </div>

          </div>

        </div>
        <div className='app__checkout-content_items'>
          <div className='app__checkout-content_items-container'>
            <div className='app__checkout-content_items-list'>
              { location.state.map((product,index)=>  {
                return (
                  <Item itemProps={product} key={product+index}/>
                )
                })}
            </div>
            <div className='app__checkout-content_items-total'>
              <h2>Total Amount Due</h2>
              <h1>{totalAmount.toLocaleString('en-US', {style: 'currency', currency: 'PHP'})}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout