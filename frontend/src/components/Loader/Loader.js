import React, { useEffect, useContext, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';

import './Loader.scss'
import UserContext from '../../UserContext';

const Loader = ({path, title, text}) => {
    const [dotCount, setDotCount] = useState(1);
    const [textWithDot, setTextWithDot] = useState(text);
    const [authenticated, setAuthenticated] = useState(false);

    const navigate = useNavigate();
    const urlParams = new URLSearchParams(window.location.search);
    const location = useLocation()
    const token = urlParams.get('token');
    const { setUser } = useContext(UserContext)
  
    useEffect(() => {
        if(location.pathname.includes('authenticating')){
            if(token){
                retrieveUserDetails(token)
            } else {
                navigate('/InvalidToken')
            }
        } else {
            setAuthenticated(true);
        }
        
    },[token])

    const retrieveUserDetails = (token) => {
        fetch(`${process.env.REACT_APP_API_URL}/users/userDetails`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(result => result.json())
        .then(data => {
            if(data){
                localStorage.setItem('token',token)
              setUser({
                  id: data._id,
                  name: data.firstName,
                  isAdmin: data.isAdmin,
                  profileUrl: data.profileUrl
              })
              setAuthenticated(true)
            } else {
                navigate('/InvalidToken')
            } 
        })
        .catch(error => console.log(error))
    }
      
    const appendDot = (text, dots) => {
        for(let i = 0; i <= dots-1; i++) {
            text += '.'
         }
        setTextWithDot(text)
    }

    const loadTime= (path) => {
        if(path ==='/login' || !token) {
            return 5000;
        } else if (path === '/') {
            return 2000;
        } else {
            return 1000;
        }
    }

    useEffect(() => {
        if(authenticated) {
            setTimeout(() => {
                navigate(path)
            }, loadTime(path));
        }
    },[authenticated, path])

    useEffect(() => {
        setTimeout(() => {
            appendDot(text, dotCount)
            if( dotCount === 3 ) {
                setDotCount(0)
            } else {
                setDotCount(dotCount+1)
            }
        }, 500);
    })

    return (
        <div className='app__loader'>
            <h1>{title}</h1>
            <div className="loadingio-spinner-interwind-9djpe29nrx">
                <div className="ldio-ebbizn9h2zc">
                    <div>
                        <div>
                            <div>
                                <div></div>
                            </div>
                        </div>
                        <div>
                            <div>
                                <div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <p>{textWithDot}</p>
        </div>
    )
}

export default Loader