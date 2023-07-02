import { useState, useContext, useEffect } from 'react'

import { CardItem } from '../../components'
import UserContext from '../../UserContext.js'
import './Account.scss'


const Account = () => {
  const [products, setProducts] = useState([]);
  const [emptyAccount, setEmptyAccount] = useState(true);
  const { user } = useContext(UserContext);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/orders`,{
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).then(results => results.json())
    .then(data => {
      if(data) {
        if(data.length > 0){
          setEmptyAccount(false)
        } else {
          setEmptyAccount(true)
        }
        setProducts(data)
      }
    })
  },[])

  return (
    <div className='app__account section__padding page__margin'>
      <div className='app__account-header'>
        <p className='page__text'>Hello {user.name} 👋</p>
        {emptyAccount 
          ? <h1 className='page__title'>Your currently have no templates purchased</h1>
          : <h1 className='page__title'>Here are your purchased templates</h1>
        }
      </div>

      <div className='app__account-content'>
        {products.map((item,index) => (
          <CardItem key={item+index} itemProps={item}/>
        ))}
      </div>
    </div>
  )
}

export default Account