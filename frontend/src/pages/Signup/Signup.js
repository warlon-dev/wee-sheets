import React, { useState, useEffect, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';
import swal from 'sweetalert'

import UserContext from '../../UserContext';
import { Loader } from '../../components'
import './Signup.scss';
import heroImg from '../../assets/hero-signup.png';
import googleSign from '../../assets/sign-google.png';


const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubscriber, setIsSubscriber] = useState(false);
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user } = useContext(UserContext)
  const [justSignedUp, setJustSignedUp] = useState(false)
  const navigate = useNavigate()

  const register = (e) => {
    e.preventDefault()

    console.log(isSubscriber)
    fetch(`${process.env.REACT_APP_API_URL}/users/register`,{
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        isSubscriber: isSubscriber
      })
    }).then(results => results.json())
    .then(data => {
      if(data) {
        setJustSignedUp(true)
        setLoading(true)
      } else {
        swal({
          title: 'Something went wrong',
          text: 'Please try again',
          icon: "error"
        });
      }
    })
    .catch(error => {
      swal({
        title: 'Something went wrong',
        text: 'Please try again',
        icon: "error"
      });
    })
  }

  // GOOGLE SIGN IN FUNCTION
  const auth = () => {
    console.log('google')
    fetch(`${process.env.REACT_APP_API_URL}/request`, {
      method: 'POST'    
    }).then(results => results.json())
    .then(data => {
      window.location.href = data.url
    })
  }
  
  useEffect(() => {
    if(user.id && !justSignedUp) {
      navigate('/NotAccessible')
    }
  })

  return (
    <div className='app__signup section__padding page__margin'>
      {loading && (<Loader path='/login' title='Wee`lcome' text='Please wait a moment while we create your account.'/>)}

      <div className='app__signup-content'>
        <h1 className='page__title'>Sign up</h1>
        <button type='button' onClick={auth}>
          <img src={googleSign} alt='google sign in'  />Continue with Google
        </button>

        <div className='form__divider'>
          <div />
          <p className='page__subtext'>OR</p>
          <div />
        </div>
        
        <form className='app__signup-form' onSubmit={register}>

          <div className='app__signup-form_name'>
            <div className='form__input'>
              <label className='page__text' htmlFor='firstName'>
                First Name
              </label>
              <input 
                className='custom__input' 
                type='text'
                placeholder='First Name' 
                required
                id = 'firstName'
                value = {firstName}
                onChange={(e) => setFirstName(e.target.value)} 
              />
            </div>

            <div className='form__input'>
              <label className='page__text' htmlFor='lastName'>Last Name</label>
              <input 
                className='custom__input' 
                type='text'
                placeholder='Last Name' 
                required
                id = 'lastName'
                value = {lastName}
                onChange={(e) => {setLastName(e.target.value)}} 
              />
             </div>
            
          </div>
          <div className='form__input'>
              <label className='page__text' htmlFor='email'>Email</label>
              <input 
                className='custom__input' 
                type='email'
                placeholder='Email Address' 
                required
                id = 'email'
                value = {email}
                onChange={(e) => setEmail(e.target.value)} 
              />
          </div>
          <div className='form__input'>
              <label className='page__text' htmlFor='password'>Password</label>

              <div className='app__signup-form_password'>
                <input 
                  className='custom__input' 
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Password' 
                  required
                  id = 'password'
                  value = {password}
                  onChange={(e) => setPassword(e.target.value)} 
                />
                {showPassword 
                  ? <AiOutlineEyeInvisible  color='#fff' fontSize={27} onClick={() => setShowPassword(false)}  />
                  : <AiOutlineEye color='#fff' fontSize={27} onClick={() => setShowPassword(true)}/> 
                }
              </div>
          </div>
          
    
          <div className='form__checkbox'>
            <input 
              type='checkbox' 
              value={isSubscriber} 
              defaultChecked
              onChange={(e) => {
                setIsSubscriber(e.target.checked)
              }}
            /> 
            <label className='page__text'>Yes, I want to receive FREE Updates Notifications and Exclusive Offers (Optional)</label>
          </div>

          <button className='custom__button' type='submit' >Sign up with Email</button>
          <p className='page__text'>By continuing with Google or Email, you agree to WeeSheets Terms of Service and Privacy Policy.</p>
        </form>

        <p className='page__text'>Already signed up? <NavLink to ='/login' >Go to login</NavLink></p>
      </div>

      <div className='app__signup-image'>
        <img src={heroImg} alt='hero' />
      </div>

    </div>
  ) 
}

export default Signup