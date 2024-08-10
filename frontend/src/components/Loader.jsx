import React from 'react';
import img from '../images/loader.svg'

function Loader() {
  return (
    <div className='h-screen w-screen absolute top-0 left-0 z-[100] bg-[rgba(255,255,255,.8)] flex flex-col items-center justify-center'>
            <img src={img} alt="Loading..." className='w-16'/>
            <span className='font-bold text-[#2b468b]'>Loading...</span>
    </div>
  )
}

export default Loader;