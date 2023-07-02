import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { MainRoutes, AdminRoutes } from './routes'
import { UserProvider } from './UserContext.js'
import './App.scss'


const App = () => {

  const [user, setUser] = useState({
    id: null,
    name: null,
    isAdmin: null,
    profileUrl: null
  });

  const unsetUser = () => {
    localStorage.clear()

    setUser({
      id: null,
      name: null,
      isAdmin: null,
      profileUrl: null
    })
  }
  useEffect( () => {
    if(localStorage.getItem('token')) {
      fetch(`${process.env.REACT_APP_API_URL}/users/userDetails`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }).then(result => result.json())
      .then(data => {
          setUser({
            id: data._id,
            name: data.firstName,
            isAdmin: data.isAdmin,
            profileUrl: data.profileUrl
          })
      })
      .catch(error => console.log(error))
    }
    
},[])
  return (
    <UserProvider value ={{user, setUser, unsetUser}}>
      <BrowserRouter >
        <Routes>
          <Route path='/*' element = {<MainRoutes />} />
          <Route path='/admin/*' element = {<AdminRoutes />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  )
}

export default App