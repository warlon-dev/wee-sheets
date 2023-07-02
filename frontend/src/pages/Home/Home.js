import React from 'react'

import { Hero, HotBundles, FeaturedTemplate } from '../../containers'

const Home = () => {
  window.scrollTo({
    top:0,
    behavior: 'instant'
  })
  return (
    <>
      <Hero />
      <HotBundles />
      <FeaturedTemplate />
    </>
  )
}

export default Home