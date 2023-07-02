import { useState, useEffect } from 'react'

import './Modal.scss'


const modalData = [
  {
    type: 'Product',
    description: "Archiving this product will prevent user from seeing it in the product catalog.",
  }
]

const Modal = ({type, action, show, name, onClose, onConfirm}) => {
  const [confirmText, setConfirmText] = useState('')
  const [isDisabled, setIsDisabled] = useState(true)
  const [modalType, setmodalType] = useState({
    type: null,
    description: null,
  })

  
  useEffect(() => {
    modalData.forEach((data) => {
      if(data.type === type) {
        setmodalType(data)
      }
    })
  },[type])

  useEffect(() => {
    if(confirmText===name){
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  },[confirmText, name])

  if(!show) {
    return null
  }
  return (
    <div className='app__box'>
      <div className='app__overlay' onClick={onClose} /> 
      <div className='app__modal' >
        <div className='app__modal-header'>
          <h1>{`${action} ${name}`} </h1>
          <hr />
        </div>
        
        <p>{modalType.description}</p>
        <p>To confirm type <span>{name}</span></p>
        <input type='text' value={confirmText} onChange={(e) => setConfirmText(e.target.value)} />
        <div className='app__modal-buttons'>
          <button 
            className={`custom__button ${action==='archive'?'archive__button':'activate__button'}`}
            type='button' 
            disabled = {isDisabled}
            onClick={() => {
              setConfirmText('')
              setIsDisabled(true)
              onConfirm()
            }} 
          >
            {`${action} ${modalType.type}`}
          </button>
          <button 
            className='custom__button' 
            type='button' 
            onClick={() => {
              setConfirmText('')
              setIsDisabled(true)
              onClose();
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

  )
}

export default Modal