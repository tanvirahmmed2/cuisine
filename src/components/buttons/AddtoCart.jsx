'use client'
import React, { useContext } from 'react'
import { CiShoppingCart } from "react-icons/ci";
import { Context } from '../context/Context';

const AddtoCart = ({product}) => {
  const {addToCart}=useContext(Context)
  return (
    <button onClick={()=>addToCart(product)} className="bg-primary text-tertiary-light px-8 py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors flex flex-row gap-2 cursor-pointer items-center justify-center">Cart <CiShoppingCart className='text-xl'/></button>
  )
}

export default AddtoCart
