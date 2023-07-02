import React from 'react'

import './ProfilePhoto.scss'

const ProfilePhoto = ({name='None', imgUrl, size=50}) => {
  return (
    <div style={{width:size, height:size}} className='profile__photo'>
        {
        (!imgUrl)
         ? <p>{name.charAt(0)}</p>
         : <img src={imgUrl} alt='profile' />
        }
    </div>
  )
}

export default ProfilePhoto