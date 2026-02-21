import React from 'react'
import Sidebar from './Sidebar'
import MessageContainer from './MessageContainer'

const HomePage = () => {
  return (
    <div className='w-full h-screen flex items-center justify-center '>
    <div className='flex h-[85%] w-[60%] bg-blue-600 rounded-md backdrop-blur-xl bg-opacity-10 border border-gray-100 bg-transparent'>
    <Sidebar/>
    <MessageContainer/>
    </div>
        
    </div>
  )
}

export default HomePage