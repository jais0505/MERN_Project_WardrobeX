import React from 'react'
import { Link } from 'react-router'

const ShopHomepage = () => {
  return (
    <div>
      <h1>Shop HomePage</h1>
      <Link to="/shop/product">Add Product</Link>
      <br />
      <Link to="/shop/viewproducts">View Product</Link>
    </div>
  )
}

export default ShopHomepage