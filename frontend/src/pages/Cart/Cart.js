import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';

import { CartItem } from '../../components';
import './Cart.scss';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState([])
  const [totalAmount, setTotalAmount] = useState(0);
  const [isCheckoutDisabled, setIsCheckoutDisabled] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadCartItems()
  },[])

  useEffect(() => {
    computeTotal()
  },[checkedItems, cartItems])

  const loadCartItems = () => {
    if(localStorage.getItem('token')){
      fetch(`${process.env.REACT_APP_API_URL}/users/cart`,{
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }).then(results => results.json())
      .then(data => {
        if(data) {
          setCartItems(data);
          computeTotal()
        } else {
          swal({
            title: "Something went wrong",
            text: "Please try again",
            icon: 'error'
          })
        }
      });
    } else {
      swal({
        title: "Whoops!",
        text: "You need to login first before you can access the cart",
        icon: 'info'
      })
      navigate('/login')
    }
    
  }

  const updateQuantity = (id, qty) => {
    fetch(`${process.env.REACT_APP_API_URL}/users/cart/updateQty`,{
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        productId: id,
        quantity: qty
      })
    }).then(results => results.json())
    .then(data => {
      if(data) {
        setCartItems(prevCartItems => prevCartItems.map((item) => {
          if(item.product._id === id){
             item.quantity = qty
         } 
           return item
         }))
      } else {
        swal({
          title: "Something went wrong",
          text: "Please try again",
          icon: 'error'
        })
      }
    })
  }

  const removeCartItem = (id) => {
    fetch(`${process.env.REACT_APP_API_URL}/users/cart/removeItem`,{
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        productId: id,
      })
    }).then(results => results.json())
    .then(data => {
      if(data) {
          swal({
            title: "Item removed from Cart",
            text: "You can browse this item again if you've changed your mind.",
            icon: 'success'
          });
          loadCartItems();
      } else {
        swal({
          title: "Something went wrong",
          text: "Please try again",
          icon: 'error'
        })
      }
    })
  }

  const handleCheck = (value, item) =>{
    if(value) {
      setCheckedItems([item.product._id, ...checkedItems])
    } else {
      setCheckedItems(prevCartItems => prevCartItems.filter(itemId => itemId !== item.product._id))
    }
    console.log(item)
  }

  const computeTotal = () => {
    let totalAmt = 0;
    cartItems.forEach(item => {
      let itemTotal;
      if(checkedItems.includes(item.product._id)){
        itemTotal = item.product.price * item.quantity;
        totalAmt += itemTotal;
      }
    });
    if(totalAmt==0){
      setIsCheckoutDisabled(true)
    }else{
      setIsCheckoutDisabled(false)
    }
    
    setTotalAmount(totalAmt);
    
  }
  
  const checkout = () => {
    const productArray = [];
    cartItems.forEach(item => {
      if(checkedItems.includes(item.product._id)){
        let newProduct = item.product;
        newProduct.quantity = item.quantity
        newProduct.subtotal = newProduct.price * item.quantity
        newProduct.productID = newProduct._id
    
        productArray.push(newProduct)
      }
    });


    navigate(`/checkout`,{state: productArray})
  }


  return (
    <div className='app__cart section__padding page__margin'>
        <div className='app__cart-header'>
            <h1 className='page__title'>Your Cart</h1>
            <Link to={'/templates'}>Continue shopping</Link>
        </div>

        <div className='app__cart-table'>
          <table>

            <thead>
              <tr>
                <th></th>
                <th>PRODUCT</th>
                <th>PRICE</th>
                <th>QUANTITY</th>
                <th>TOTAL</th>
              </tr>
            </thead>

            <tbody>
              { cartItems.map((item,index) => (
                <CartItem 
                  key={item+index} 
                  itemProps ={item} 
                  onChangeQty = {updateQuantity}
                  onItemRemoved ={removeCartItem}
                  onChecked = {handleCheck}
                />
              ))}
            </tbody>

          </table>
        </div>

        <div className='app__cart-footer'>
          <div className='app__cart-footer_total'>
            <h4>Total Amount Due</h4>
            <p>{totalAmount.toLocaleString('en-US', {style: 'currency', currency: 'PHP'})}</p>
          </div>

          <button className='custom__button' onClick={checkout} disabled={isCheckoutDisabled}>PROCEED TO CHECK OUT</button>
        </div>
    </div>
  )
}

export default Cart