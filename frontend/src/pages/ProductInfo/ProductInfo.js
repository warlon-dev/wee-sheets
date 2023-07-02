import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GrAdd, GrSubtract } from 'react-icons/gr';
import { GiShoppingCart } from 'react-icons/gi';
import { MdShoppingCartCheckout } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

import { Card } from '../../components';
import './ProductInfo.scss';
import defaultImg from '../../assets/default.jpg'

const ProductInfo = () => {
  const [product, setProduct] = useState({
    _id: null,
    name: null,
    description: null,
    price: 0,
    imgFiles: [defaultImg]
  })
  const [quantity, setQuantity] = useState(1)
  const [products, setProducts] = useState([])

  const param = useParams()
  const navigate = useNavigate()

  
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/products/${param.templateID}`)
    .then(results => results.json())
    .then(data => {
      if(data){
        setQuantity(1);
        setProduct(data);
        window.scrollTo({
          top:0,
          behavior: 'instant'
        });
      } else {
        navigate('/TemplateNotFound')
      }
    })
  },[param]);
  
  
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/products/active`)
    .then(result => result.json())
    .then(data => {
      if(data) {
        setProducts(data);
      }
    })
  },[param])

  const checkout = () => {
    const productArray = [];
    let newProduct = product;
    newProduct.quantity = quantity
    newProduct.subtotal = newProduct.price * quantity
    newProduct.productID = newProduct._id

    productArray.push(newProduct)

    navigate(`/checkout`,{state: productArray})
  }

  const addToCart = (item, quantity) => {
    fetch(`${process.env.REACT_APP_API_URL}/products/${item}/addToCart`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }, 
      body: JSON.stringify({
        quantity: quantity
      })
    })
    .then(results => results.json())
    .then(data => {
      if(data) {
        setQuantity(1);
        swal({
          title: 'Item Added to Cart!',
          text: 'Go to your cart to checkout or browse for more templates',
          icon: 'success'
        })
      } else {
        swal({
          title: 'Something went wrong',
          text: 'Please try gain adding the item to your cart',
          icon: 'error'
        })
      }
    })
  }


  return (
    <div className='app__product section__padding page__margin'>
      <div className='app__product-detail'>

        <div className='app__product-detail_images'>
          {product.imgFiles.length > 0 
            ? <img src={product.imgFiles[0]?.imageDataUri} alt={product.name} />
            : <img src={defaultImg} alt={product.name} />
          }
        </div>

        <div className='app__product-content'>
          <h1>{product.name}</h1>
          <h2>
            {product.price.toLocaleString('en-US', {style: 'currency',currency: 'PHP'})} 
                    <span>{(product.price*2).toLocaleString('en-US', {style: 'currency', currency: 'PHP'})}</span>
          </h2>
          <div className='app__product-quantity'>
              <input className='custom__input' type='number' value={quantity} onChange={(e) => setQuantity(e.target.value)} />
              <div className='app__product-quantity_change'>
                <div onClick={() => setQuantity(quantity+1)}>
                  <GrAdd />
                </div>
                <div 
                  onClick={() => {
                    if(quantity > 1) {setQuantity(quantity-1)}}
                  }
                >
                  <GrSubtract />
                </div>
              </div>
          </div>
          <div className='app__product-buttons'>
            <button className='custom__button' onClick={() => addToCart(product._id, quantity)}>
              <GiShoppingCart fontSize={30} /> 
              <span>ADD TO CART</span>
            </button>
            <button className='custom__button' onClick={checkout}>
              <MdShoppingCartCheckout fontSize={30} />
              <span>CHECKOUT</span>
            </button>
          </div>
          <p>{product.description}</p>
        </div>

      </div>
      <div className='app__product-others'>
          <h2>You may also like</h2>
          <div className='app__product-others_images'>
          {products
            .filter(otherProduct => {
              if(otherProduct.name !== product.name){
                return product;
              }
            })
            .map((product,index) => (
              <Card key={product + index} cardProps = {product} />
            ))
          }
          </div>
      </div>
    </div>
  )
}

export default ProductInfo