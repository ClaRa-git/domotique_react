import React from 'react'
import { RingLoader } from 'react-spinners'

const PageLoader = () => {
    return (
        <div className='bg-black flex flex-col items-center justify-center h-screen'>
            <RingLoader
                size={100}
                color='#36d7b7'
            />
        </div>
    )
}

export default PageLoader