import  React, { useState, useEffect } from 'react';
import swal from 'sweetalert';
import { AiFillCheckCircle, AiFillCloseCircle, AiFillEdit } from 'react-icons/ai';
import { BsFillArchiveFill } from 'react-icons/bs';
import { RiInboxUnarchiveFill } from 'react-icons/ri'
import { GiNinjaStar } from 'react-icons/gi';
import { GrPowerReset } from 'react-icons/gr';

import { Modal } from '../../../components';
import './Orders.scss'

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const [filter, setFilter] = useState('');
  const [orderCount, setOrderCount] = useState(0)


  useEffect( () => {
    const list = orders.filter(order => {
      if(filter===""){
        return order;
      } else if (order.userId.email.toLowerCase().includes(filter.toLocaleLowerCase()) || order.products.productID.name.toLowerCase().includes(filter.toLocaleLowerCase())){
        return order;
      }
    })
    setOrderCount(list.length)
  })

  useEffect(() => { 
    fetch(`${process.env.REACT_APP_API_URL}/orders/all`,{
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).then(result => result.json())
    .then(data => {
      setOrders(data)
    }).catch(error => console.log(error))
  });

  return (
    <div className='app__orders dashboard__padding page__margin-left'>
      <div className='app__orders-header'>
        <h1 className='page__title'>Orders</h1>
        <div className='app__orders-controls'>

          <div className='app__orders-controls_search'>
            <input 
              className='custom__input' 
              placeholder='Search Order'
              value={filter}
              onChange={e => setFilter(e.target.value)}
            />
            <div onClick={() => setFilter('')}><GrPowerReset /></div>
          </div>
          <div className='app__orders-controls_button'>
            <p>{`${orderCount} Order(s) found`}</p>
          </div>
        </div>
      </div> 

      <div className='app__orders-table'>
         <table id='table'>
            <thead>
              <tr className='page__text'>
                <th>Order ID</th>
                <th>Purchase Date</th>
                <th>Email</th>
                <th>Product</th>
                <th style={{textAlign:'right'}}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {
              orders.filter(order => {
                console.log(order)
                if(filter===""){
                  return order;
                } else if (order.userId.email.toLowerCase().includes(filter.toLocaleLowerCase()) || order.products.productID.name.toLowerCase().includes(filter.toLocaleLowerCase())) {
                  return order;
                }
              }).map((order, index) => {
                return(
                <tr className='page__subtext' key ={order._id}>
                  {order.products.map((product,index) => (
                    <React.Fragment key ={product + index}>
                      <td >{order._id}</td>
                        <td style={{fontSize:'1rem', fontWeight: 500,  color:'#1ABC9C'}}>{order.purchasedOn}</td>
                        <td>{order.userId.email}</td>
                        <td>{product.productID.name}</td>
                        <td style={{textAlign:'right'}}>{(order.totalAmount).toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'PHP'
                        })}</td>
                    </React.Fragment>
                  ))}
                </tr>
              )})}
            </tbody>
         </table>
      </div>

    </div>
  )
}

export default Orders