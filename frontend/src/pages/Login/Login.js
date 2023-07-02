import React, { useState, useContext, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';
import swal from 'sweetalert'

import { Loader } from '../../components'
import heroImg from '../../assets/hero-login.png';
import googleSign from '../../assets/sign-google.png';

import './Login.scss'
import UserContext from '../../UserContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [justLogin, setJustLogin] = useState(false)

  const { user, setUser } = useContext(UserContext)

  const login = (e) => {
    e.preventDefault()

    fetch(`${process.env.REACT_APP_API_URL}/users/login`,{
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password,
      })
    }).then(results => results.json())
    .then(data => {
      if(data) {
        setJustLogin(true)
        localStorage.setItem('token', data.auth)
        retrieveUserDetails(data.auth)

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

  const retrieveUserDetails = (token) => {
    fetch(`${process.env.REACT_APP_API_URL}/users/userDetails`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(result => result.json())
    .then(data => {
        console.log(data)
        if(data){
          setIsAdmin(data.isAdmin)
          setUser({
            id: data._id,
            name: data.firstName,
            isAdmin: data.isAdmin,
            profileUrl: data.profileUrl
          })
          setLoading(true)
          return true;
        } else {
          return false
        } 
    })
    .catch(error => console.log(error))
  }

  useEffect(() => {
    if(user.id && !justLogin) {
      navigate('/NotAccessible')
    }
  })

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
    
  return (
    <div className='app__login section__padding page__margin'>
    {loading && (<Loader path={isAdmin?'/admin':'/templates'} title='Wee`lcome' text='Please wait a moment while we load your account.'/>)}

      <div className='app__login-content'>
        <h1 className='page__title'>Log In</h1>
        <button type='button' onClick={auth}>
          <img src={googleSign} alt='google sign in'  />Continue with Google
        </button>

        <div className='form__divider'>
          <div />
          <p className='page__subtext'>OR</p>
          <div />
        </div>
        
        <form className='app__login-form' onSubmit={login}>

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

              <div className='app__login-form_password'>
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

          <button className='custom__button' type='submit' >Log In</button>
          <a className='page__subtext'>Forgot your password?</a>
          <p className='page__text'>By continuing with Google or Email, you agree to WeeSheets Terms of Service and Privacy Policy.</p>
        </form>

        <p className='page__text'>Don't have an account? <NavLink to ='/signup' >Sign up</NavLink></p>
      </div>

      <div className='app__login-image'>
        <img src={heroImg} alt='hero' />
      </div>

  </div>
  )
}

export default Login