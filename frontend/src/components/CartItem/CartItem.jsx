import { useEffect, useState } from 'react';
import { GrAdd, GrSubtract, GrTrash } from 'react-icons/gr';

import './CartItem.scss'
import defaultImg from '../../assets/default.jpg'

const CartItem = ({onChangeQty, onItemRemoved, onChecked, ...props}) => {
    const { product: { _id, name, price } = {}, quantity, imgFiles } = props.itemProps;
    const [subtotal, setSubtotal] = useState(0);

    useEffect(() => {
      console.log(quantity)
        setSubtotal(quantity*price)
    },[price,quantity])

  return (
    <tr className='app__cartitem'>
        <td><input type='checkbox' onChange={e => onChecked(e.target.checked, props.itemProps)} /></td>
        <td>
            <div>
                {imgFiles.length > 0 
                    ? <img src={imgFiles[0]?.imageDataUri} alt={name} />
                    : <img src={defaultImg} alt={name} />
                }
                <h2>{name}</h2>
            </div>
        </td>
        <td>{price.toLocaleString('en-US', {style: 'currency', currency: 'PHP'})}</td>
        <td>
            <div className='app__cartItem-quantity_change'>
                <div 
                    onClick={() => {
                        onChangeQty(_id, quantity+1)
                    }}
                >
                  <GrAdd />
                </div>
                <input 
                    type='number' 
                    value = {quantity} 
                    onChange={(e) => {
                        onChangeQty(_id, e.target.value)
                    }} 
                />
                <div 
                  onClick={() => {
                    if(quantity > 1) {
                        onChangeQty(_id, quantity-1)
                    }}
                  }
                >
                  <GrSubtract />
                </div>
            </div>
            <div className='app__cartItem-remove'
                onClick={() => {
                  onItemRemoved(_id)
                }}
            >
              <GrTrash />
            </div>
            
        </td>
        <td>{subtotal.toLocaleString('en-US', {style: 'currency', currency: 'PHP'})}</td>

    </tr>
  )
}

export default CartItem