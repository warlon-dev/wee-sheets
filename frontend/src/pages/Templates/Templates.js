import React, { useState, useEffect } from 'react';

import { Card } from '../../components';
import './Templates.scss';
import banner from '../../assets/templates-banner.png';



const Templates = () => {
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeProducts, setActiveProducts] = useState([])

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/products/categories`)
    .then(results => results.json())
    .then(data => {
      setCategories(['All', ...data]);
    })
  },[])
  
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/products/active`)
    .then(results => results.json())
    .then(data => {
      setActiveProducts(data);
    })
  }, [activeCategory])
  

  const filterItems = () => {

  }

  return (
    <div className='app__templates section__padding'>
      <div className='app__templates-banner'>
        <img src={banner} alt='banner'/>
      </div>
      <div className='app__templates-category'>
         {categories.map((category,index) => (
          <button 
            type='button' 
            key={category + index}
            name = {category}
            id = {`${activeCategory === category ?  "active__category":''}`} 
            onClick={e => setActiveCategory(category)}
          >
            {category}
          </button>
         ))} 
      </div>

      <div className='app__templates-list'>
          {activeProducts
            .filter(product => {
              if(activeCategory==="All"){
                return product;
              } else if (product.category?.includes(activeCategory)) {
                return product;
              }
            })
            .map((product, index) => (
              <Card cardProps ={product} key={product+index}  />
            ))
          }
      </div>
    </div>
  )
}

export default Templates