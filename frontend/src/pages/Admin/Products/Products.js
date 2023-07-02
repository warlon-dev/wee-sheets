import { useState, useEffect } from 'react';
import swal from 'sweetalert';
import { AiFillCheckCircle, AiFillCloseCircle, AiFillEdit } from 'react-icons/ai';
import { BsFillArchiveFill } from 'react-icons/bs';
import { RiInboxUnarchiveFill } from 'react-icons/ri'
import { GiNinjaStar } from 'react-icons/gi';
import { GrPowerReset } from 'react-icons/gr';

import { DragDropFile, Modal } from '../../../components';
import util from '../../../utils'
import './Products.scss'
import defaultImg from '../../../assets/default.jpg'

const Products = () => {
  const [productId, setProductId] = useState(null)
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isBundle, setIsBundle] = useState(false);
  const [price, setPrice] = useState(0);
  const [imgFiles, setImgFiles] = useState([]);
  const [products, setProducts] = useState([]);

  const [animateHide, setAnimateHide] = useState(false);
  const [editMode, setEditMode] = useState(0);  // 0 - hidden | 1 - add | 2 - edit
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState('archive'); // archive | activate
  const [filter, setFilter] = useState('');
  const [productCount, setProductCount] = useState(0)


  const addProduct = (e) => {
    e.preventDefault()

    const formData = new FormData();
    formData.append('name', name)
    formData.append('description', description)
    formData.append('category', category)
    formData.append('isBundle', isBundle)
    formData.append('price', price)
    for (let i=0; i < imgFiles.length; i++) {
      formData.append('files', imgFiles[i]);
    }
    
    fetch(`${process.env.REACT_APP_API_URL}/products/add`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    }).then(result => result.json())
    .then(data => {
      if(data) {
        swal({
          title: 'Hooray!',
          text: 'Your product has been created successfully',
          icon:'success'
        });
        loadProducts();
        setEditMode(0);
        setAnimateHide(false)
      } else {
        swal({
          title: 'Something went wrong',
          text: 'Please try again',
          icon:'error'
        });
      }
    })
  }

  const editProduct = (index) => {
    const selectedProduct = products[index];

    setProductId(selectedProduct._id)
    setName(selectedProduct.name)
    setDescription(selectedProduct.description)
    setCategory(selectedProduct.category)
    setIsBundle(selectedProduct.isBundle)
    setPrice(util.priceToNumber(selectedProduct.price))

    setEditMode(2);
  }

  const updateProduct = (e) => {
    e.preventDefault()
    
    const formData = new FormData();
    formData.append('name', name)
    formData.append('description', description)
    formData.append('category', category)
    formData.append('isBundle', isBundle)
    formData.append('price', price)
    for (let i=0; i < imgFiles.length; i++) {
      formData.append('files', imgFiles[i]);
    }

    fetch(`${process.env.REACT_APP_API_URL}/products/${productId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    })
    .then(result => result.json())
    .then(data => {
      if(data) {
        swal({
          title: 'Hooray!',
          text: 'Your product has been created successfully',
          icon:'success'
        });
        loadProducts();
        setEditMode(0);
        setAnimateHide(false)
      } else {
        swal({
          title: 'Something went wrong',
          text: 'Please try again',
          icon:'error'
        });
      }
    })
  }

  const displayModal = (index) => {
      // DISPLAY MODAL CONFIRMATION
      var table = document.getElementById('table');
      let row = table.rows[index+1] // GETS THE ROW EXCLUDING THE HEADER
      setProductId(row.cells[0].innerHTML)
      setName(row.cells[1].innerHTML)

      setShowModal(true)
  }

  const setProductStatus = () => {
    fetch(`${process.env.REACT_APP_API_URL}/products/${productId}/${modalAction}`,{
      method: 'PATCH', 
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).then(results => results.json)
    .then(data => {
      if(data) {
        setShowModal(false);
      } else {
        swal({
          title: 'Something went wrong',
          text: 'Please try again',
          icon:'error'
        });
      }
    })
  }
  
  useEffect(() => { 
    loadProducts();
  },[]);

  const loadProducts = () => {
    fetch(`${process.env.REACT_APP_API_URL}/products/all`,{
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).then(result => result.json())
    .then(data => {
      setProducts(data)
    }).catch(error => console.log(error))
  }

  useEffect(() => {
    const list = products.filter(product => {
      if(filter===""){
        return product;
      } else if (product.name.toLowerCase().includes(filter.toLocaleLowerCase()) || product.description.toLowerCase().includes(filter.toLocaleLowerCase())){
        return product;
      }
    })
    setProductCount(list.length)
  },[products])

  useEffect(() => {
    setTimeout(() => {
      setEditMode(0);
      setName('');
      setDescription('');
      setCategory('Finance')
      setIsBundle(false);
      setPrice(0);
      setImgFiles([])
      setAnimateHide(false);
  }, 300);
  },[animateHide])

  const handleUpload = (files) => {
    setImgFiles(files)
  }


  return (
    <div className='app__products dashboard__padding page__margin-left'>
      <Modal type='Product' action={modalAction} id={productId} name={name} show={showModal} 
        onClose={() => setShowModal(false)} onConfirm={setProductStatus} 
      />
      <div className='app__products-header'>
        <h1 className='page__title'>PRODUCTS</h1>
        <div className='app__products-controls'>

          <div className='app__products-controls_search'>
            <input 
              className='custom__input' 
              placeholder='Search Product'
              value={filter}
              onChange={e => setFilter(e.target.value)}
            />
            <div onClick={() => setFilter('')}><GrPowerReset /></div>
          </div>
          <div className='app__products-controls_button'>
            <p>{`${productCount} product(s) found`}</p>
            <button className='custom__button' onClick={() => {setEditMode(1)}}>+ Add Product</button>
          </div>
        </div>
      </div> 

      <div className='app__products-table'>
         <table id='table'>
            <thead>
              <tr className='page__text'>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {
              products.filter(product => {
                if(filter===""){
                  return product;
                } else if (product.name.toLowerCase().includes(filter.toLocaleLowerCase()) || product.description.toLowerCase().includes(filter.toLocaleLowerCase())) {
                  return product;
                }
              }).map((product, index) => {
                return(
                  <tr className='page__subtext' key ={product._id}>
                    <td style={{display:'none'}}>{product._id}</td>
                    <td 
                      style={{fontSize:'1rem', fontWeight: 500,  color:'#1ABC9C'}}
                    >
                      <div id='product__name'>
                        {product.imgFiles.length > 0 
                          ? <img src={product.imgFiles[0]?.imageDataUri} alt={product.name} />
                          : <img src={defaultImg} alt={product.name} />
                        }
                        {product.name}
                      </div>
                    </td>
                    <td>{product.description}</td>
                    <td style={{textAlign:'center'}}>{(product.price).toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'PHP'
                    })}</td>
                    <td style={{textAlign:'center'}}>
                    {product.isActive 
                    ? <AiFillCheckCircle color='#1ABC9C' fontSize={24} /> 
                    : <AiFillCloseCircle color='#D52D2C' fontSize={24} />} 
                    </td>
                    <td className='col__actions'>
                      <AiFillEdit className='action__edit' fontSize={20} onClick={() => {editProduct(index)}} />
                      {product.isActive
                      ? <BsFillArchiveFill 
                          className='action__archive' 
                          fontSize={20} 
                          onClick={() => {
                            setModalAction('archive')
                            displayModal(index)
                          }}  
                      />
                      : <RiInboxUnarchiveFill 
                          className='action__activate' 
                          fontSize={20} 
                          onClick={() => {
                            setModalAction('activate')
                            displayModal(index)
                          }}  
                      />
                      }
                    </td>
                  </tr>
                )
              })}
            </tbody>
         </table>
      </div>

      {/* ADD AND EDIT PRODUCT SIDEBAR */}

      {editMode !== 0 && (
        <div className={`app__products-add ${animateHide?'hide-right':'slide-left'} ${editMode===2?'bg__yellow':'bg__green'}`}>
          <div className='app__products-wrapper'>
            <div className='app__products-close'>
              <GiNinjaStar onClick={() => setAnimateHide(true)} />
            </div>
            <div className='app__products-form'>
              <form onSubmit={editMode===1? addProduct : updateProduct} id="3" encType="multipart/form-data">
                <h1 className='page__title'>{editMode===1?'ADD NEW PRODUCT': 'UPDATE PRODUCT INFO'}</h1>
                
                <div>
                  <label className='page__text' htmlFor='name'>Product Name</label>
                  <input 
                    id='name'
                    type='text'
                    placeholder='Enter product name' 
                    className='custom__input' 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label className='page__text' htmlFor='description'>Product Description</label>
                  <textarea 
                    id='description'
                    placeholder='Enter product description' 
                    className='custom__input'  
                    rows ='4'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div>
                  <label  className='page__text' >Product Category</label>
                  <select 
                    className={`custom__input ${editMode === 2 && 'update__select'}`} 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option>Finance</option>
                    <option>Personal Development</option>
                  </select>
                </div>

                <div id='product__bundle'>
                  <input 
                    id='bundle'
                    type='checkbox'
                    checked={isBundle}
                    onChange={(e) => {
                      setIsBundle(e.target.checked)
                    }}
                  />
                  <label className='page__text' htmlFor='bundle'>Bundled Product</label>
                </div>

                <div>
                  <label className='page__text' htmlFor='price'>Price</label>
                  <input 
                    id='price'
                    type='number'
                    placeholder='Enter product price'
                    className='custom__input' 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <DragDropFile onUpload={handleUpload} />
                
                <button type='submit' className='custom__button'>SAVE CHANGES</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Products