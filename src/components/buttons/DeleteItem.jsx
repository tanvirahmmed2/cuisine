'use client'
import axios from 'axios';
import React from 'react'

import { MdDeleteOutline } from "react-icons/md";
import toast from 'react-hot-toast'

const DeleteItem = ({id}) => {
    const deleteProduct=async()=>{
      try {
        const res= await axios.delete('/api/product',{data: {id}},{ withCredentials: true})
        console.log(res)
        toast.success(res.data.message)
      } catch (error) {
        console.log(error)
        toast.error(error?.response?.data?.message)
        
      }
    }
  return (
    <button onClick={deleteProduct} className='cursor-pointer text-xl text-red-500 hover:text-red-700 transition-colors'><MdDeleteOutline/></button>
  )
}

export default DeleteItem
