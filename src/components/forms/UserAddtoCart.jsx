// components/forms/UserAddtoCart.jsx
'use client'
import React, { useState, useContext } from 'react'
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { CiShoppingCart } from "react-icons/ci";
import { Context } from '../context/Context';

const UserAddtoCart = ({ product }) => {
  const { addToCart } = useContext(Context)
  const [quantity, setQuantity] = useState(1)

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  const handleAddToCart = () => {
    if (!product) return;
    // Map to id if _id exists (for safety during migration)
    const normalizedProduct = {
      ...product,
      id: product.id || product._id
    };
    addToCart(normalizedProduct, quantity);
  }

  return (
    <div className='w-full flex flex-col items-center justify-center gap-4 p-4 bg-gray-50 rounded-2xl'>
      <div className='w-full flex flex-row items-center justify-between'>
        <div className='flex flex-col'>
          <span className='text-[10px] text-gray-400 uppercase font-bold tracking-wider'>Unit Price</span>
          <p className='text-2xl font-black text-gray-800'>৳{product.price}</p>
        </div>
        <div className='flex flex-row items-center gap-4 bg-white px-4 py-2 rounded-full shadow-sm'>
          <button className='text-xl font-bold hover:text-pink-600 transition-colors cursor-pointer' onClick={decreaseQuantity}><IoIosArrowBack /></button>
          <p className='font-black text-lg w-6 text-center'>{quantity}</p>
          <button className='text-xl font-bold hover:text-pink-600 transition-colors cursor-pointer' onClick={increaseQuantity}><IoIosArrowForward /></button>
        </div>
      </div>
      <button 
        onClick={handleAddToCart} 
        className='w-full flex flex-row items-center justify-center gap-3 bg-pink-500 text-white py-3 rounded-xl font-bold hover:bg-pink-600 transition-all active:scale-[0.98] shadow-lg shadow-pink-900/10'
      >
        <CiShoppingCart className='text-2xl' />
        Add to Cart
      </button>
    </div>
  )
}

export default UserAddtoCart