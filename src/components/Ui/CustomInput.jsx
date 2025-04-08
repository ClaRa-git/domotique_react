import React from 'react'

const CustomInput = ({state, label, type, callable}) => {
  return (
    <div className="mb-4">
        <label 
            htmlFor={state}
            className='block text-white font-bold mb-2'
            >
            {label}
        </label>
        <input 
            type={type}
            className='bg-white shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline'
            value={state}
            onChange={callable}
        />
    </div>
  )
}

export default CustomInput